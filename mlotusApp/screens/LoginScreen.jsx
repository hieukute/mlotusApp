import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, Keyboard, Alert, StatusBar, ActivityIndicator, ToastAndroid, Platform, ImageBackground } from 'react-native';
import { redbackground, logo } from "../assest";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { UserTextInput } from "../components"
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Cái này cho Android
import LinearGradient from 'react-native-linear-gradient';

// Cái này cho IOS
// import {LinearGradient} from 'expo-linear-gradient';


import { SelectCountry } from 'react-native-element-dropdown';
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { setConfig } from "../context/actions/userActions";

const HomeScreen = ({ route }) => {
    const Navigation = useNavigation();
    const { data = {} } = route.params;
    const config = useSelector((state) => state.config);
    const [email, setEmail] = useState(config.email);
    const [password, setPassword] = useState(null);
    const [domain, setDomain] = useState(config.domain);
    const [database, setDatabase] = useState(config.database);
    const [confirmPassword, setconfirmPassword] = useState(Object.keys(data).length !== 0);
    const [useImage, setUseImage] = useState(data.images);
    const [userName, setUserName] = useState(data.display_name);
    const [company, setCompany] = useState(data.company);
    const [isSpinLoading, setIsSpinLoading] = useState(false);
    const [method, setMethod] = useState(config.method || 'http://');
    const [hidenLogo, setHidenLogo] = useState('');
    const [mt15, setMt15] = useState('')
    const disPatch = useDispatch();
    const http_method = [
        {
            value: 'http://',
            lable: 'http://'
        },
        {
            value: 'https://',
            lable: 'https://'
        }
    ]

    useEffect(() => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                BackHandler.exitApp();
            }
        );
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setHidenLogo('hidden');
                setMt15('mt-15');
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setHidenLogo('');
                setMt15('');
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSignIn = async () => {
        Keyboard.dismiss();
        if (method == null) {
            return handleShowNotification('Vui lòng chọn giao thức.');
        } else if (domain == null) {
            return handleShowNotification('Địa chỉ không được bỏ trống.');
        } else if (database == null) {
            return handleShowNotification('Mã chi nhánh không được bỏ trống.');
        } else if (email == null) {
            return handleShowNotification('Email không được bỏ trống.');
        } else if (password == null) {
            return handleShowNotification('Mật khẩu không được bỏ trống.');
        }
        try {
            let data = JSON.stringify({
                "jsonrpc": "2.0",
                "method": "call",
                "params": {
                    "db": database,
                    "login": email,
                    "password": password
                }
            });
            const storeData = async () => {
                try {
                    await AsyncStorage.setItem('email_user', email);
                    await AsyncStorage.setItem('password_user', password);
                    await AsyncStorage.setItem('domain', domain);
                    await AsyncStorage.setItem('database', database);
                    await AsyncStorage.setItem('method_url', method);
                } catch (e) {
                    Navigation.navigate('LoginScreen', { user: {} });
                }
            };
            disPatch(setConfig(domain, database, email, password, method));
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${method + domain}/web/api/v1/mobile_authen`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            console.log('data',config)
            axios.request(config)
                .then((response) => {
                    if (response.data) {
                        let data = JSON.parse(JSON.stringify(response.data)).result;
                        if (data && data.code == 200) {
                            storeData();
                            setIsSpinLoading(true);
                            setTimeout(() => {
                                Navigation.navigate('WebviewScreen', {
                                    'data': data.user
                                })
                                setIsSpinLoading(false);
                            }, 1000)
                            console.log(data);
                        } else {
                            handleShowNotification('Sai thông tin đăng nhập. Vui lòng thử lại!', 'error');
                        }
                    }
                })
                .catch((e) => {
                    // Đây là đoạn show lỗi nhé
                    Alert.alert('Vui lòng kiểm tra lại cấu hình và kết nối Internet');
                });
        } catch (e) {
            // Đây là đoạn show lỗi nhé
            Alert.alert('Vui lòng kiểm tra lại cấu hình và kết nối Internet');
        }
    }

    const handleShowNotification = (text, type) => {
        if (Platform.OS === 'android') {
            ToastAndroid.show(text, ToastAndroid.SHORT)
        } else {
            Alert.alert('Thông báo', text);
        }
    };

    return (
        <LinearGradient colors={['#edf5f6', '#edf5f6', '#edf5f6']} style={tw`h-full`}>
            <StatusBar
                translucent={false}
                // Đây là màu thành wifi, các file đều có
                backgroundColor={'#4bb965'}
                barStyle="white-content"
            />
            <ImageBackground source={redbackground} resizeMode="cover" style={tw`w-full h-full`}>
                <View style={tw`flex-1 h-full items-center justify-start`}>
                    <View style={tw`w-full h-[45%] flex items-center justify-center ${hidenLogo}`}>
                        <View style={tw`flex justify-center items-center`}>
                            <View style={tw`w-40 rounded-5 flex justify-center items-center`}>
                                {/* <FontAwesome5 name="ghost" size={40} color="#ffffff" /> */}
                                <Image source={logo} style={tw`max-w-[100%]`} resizeMode='contain'/>
                            </View>
                            <Text style={tw`text-[#4bb965] font-bold text-[22px]`}>Đồng hành làm giàu</Text>
                        </View>
                    </View>
                    <View style={tw`bg-white h-[55%] h-full px-3 py-5 rounded-t-10 ${mt15}`}>
                        {confirmPassword &&
                            <TouchableOpacity style={tw`w-full mt-3`} onPress={() => Navigation.navigate('LogoutScreen', { user: data })}>
                                <View style={tw`w-full rounded-2 px-4 py-3 flex-row items-center content-start justify-between bg-[#4bb965]`}>
                                    <View style={tw`w-1.3/12`}>
                                        <Image source={{ uri: useImage }} resizeMode='cover' style={tw`h-11 w-11 rounded-full`} />
                                    </View>
                                    <View style={tw`w-8/12`}>
                                        <Text style={tw`font-semibold text-[15px] text-white`}>{userName}</Text>
                                        <Text style={tw`font-500 text-[13px] text-white`}>{company}</Text>
                                    </View>
                                    <View style={tw`w-1/12`}>
                                        {/* <MaterialIcons name="chevron-right" size={32} color="#ffffff" /> */}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        }

                        {/* Debug */}
                        {!confirmPassword && <>
                            <View style={tw`flex-row`}>
                                <SelectCountry
                                    style={tw`w-[27%] border-b-[0.5px] px-1 pt-3 border-b-[#7a7a7a]`}
                                    selectedTextStyle={tw`text-[15.5px] text-[#404040]`}
                                    placeholderStyle={tw`text-[15.5px]`}
                                    value={method}
                                    data={http_method}
                                    valueField="value"
                                    labelField="lable"
                                    placeholder={'Giao thức'}
                                    onChange={e => {
                                        setMethod(e.value);
                                    }}
                                />
                                <UserTextInput
                                    placeholder="Địa chỉ"
                                    isPass={false}
                                    domainType={true}
                                    setStateValue={setDomain}
                                />
                            </View>
                        </>}


                        {/* Database */}
                        {!confirmPassword &&
                            <UserTextInput
                                placeholder="Mã chi nhánh"
                                iconInput="code"
                                isPass={false}
                                setStateValue={setDatabase}
                            />
                        }

                        {/* Email */}
                        {!confirmPassword &&
                            <UserTextInput
                                placeholder="Tài khoản"
                                iconInput="email"
                                isPass={false}
                                setStateValue={setEmail}
                            />
                        }

                        {/* Password */}
                        <UserTextInput
                            placeholder="Mật khẩu"
                            isPass={true}
                            iconInput="lock"
                            setStateValue={setPassword}
                        />

                        <View style={tw`w-full pt-3 pb-5`}>
                            <TouchableOpacity onPress={() => handleShowNotification('Vui lòng liên hệ quản trị viên', 'error')}>
                                <Text style={tw`text-[#4bb965] text-[15px]`}>Quên mật khẩu?</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={tw`w-full flex-row justify-between items-center h-13.5`}>
                            <View style={tw`w-full pr-1 h-full`}>
                                <TouchableOpacity style={tw`h-full bg-[#4bb965] flex-row justify-center items-center rounded-15`}
                                    onPress={handleSignIn}>
                                    <Text style={tw`text-white font-bold text-[15px] py-2 px-2`}>Đăng nhập</Text>
                                    {isSpinLoading &&
                                        <ActivityIndicator color="#ffffff" size={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={tw`w-full flex-row items-center justify-center py-5`}>
                            <Text style={tw`text-[#000000] text-[15px]`}>Bạn chưa có tài khoản?</Text>
                            <TouchableOpacity onPress={() => handleShowNotification('Vui lòng liên hệ quản trị viên', 'error')}>
                                <Text style={tw`pl-1 text-[#4bb965] text-[15px]`}>Liên hệ</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </LinearGradient>
    );
}

export default HomeScreen
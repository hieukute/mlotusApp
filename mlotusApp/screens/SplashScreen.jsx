
import { useLayoutEffect } from "react"
import { View, TouchableOpacity, StatusBar, Alert, SafeAreaView, Image } from 'react-native';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import tw from "twrnc";

import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Android
import LinearGradient from 'react-native-linear-gradient';

// IOS
// import {LinearGradient} from 'expo-linear-gradient';


import { useDispatch } from 'react-redux';
import { setConfig } from "../context/actions/userActions";

// mình hướng dẫn nhé: Ở index.js trong mục Image đã export cái logo ra
// rồi thì ở bất kỳ file nào mình đều có thể nhận được logo ấy
// Để lấy thì cần import
// Cách import logo vào file mình cần
// Khi export ở kia ra thì ở đây sẽ nhận được
import {logo64} from '../assest/'
const HomeScreen = () => {
    const Navigation = useNavigation();
    const isFocused = useIsFocused();
    const disPatch = useDispatch();

    useLayoutEffect(() => {
        checkLoginUser();
    }, [isFocused]);

    const checkLoginUser = async () => {
        try {
            const email_user = await AsyncStorage.getItem('email_user');
            const password_user = await AsyncStorage.getItem('password_user');
            const domain_user = await AsyncStorage.getItem('domain');
            const database_user = await AsyncStorage.getItem('database');
            const method_url = await AsyncStorage.getItem('method_url');
            if (email_user === null || password_user === null || domain_user == null || database_user == null || method_url == null) {
                setTimeout(() => {
                    Navigation.navigate('LoginScreen', { data: {} })
                }, 1500);
            } else {
                disPatch(setConfig(domain_user, database_user, email_user, password_user, method_url));
                let data = JSON.stringify({
                    "jsonrpc": "2.0",
                    "method": "call",
                    "params": {
                        "db": database_user,
                        "login": email_user,
                        "password": password_user
                    }
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    mode: 'no-cors',
                    url: `${method_url + domain_user}/web/api/v1/mobile_authen`,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                    },
                    data: data
                };
                console.log(config);
                await axios.request(config)
                    .then((response) => {
                        if (response.data) {
                            let data = JSON.parse(JSON.stringify(response.data)).result;
                            setTimeout(() => {
                                Navigation.navigate('LoginScreen', {
                                    data: data.user
                                })
                            }, 1500);
                        }
                    })
                    .catch((error) => {
                        Alert.alert('Đã có lỗi xảy ra: ' + JSON.stringify(e));
                    });
            };
        } catch (e) {
            Alert.alert('Vui lòng kiểm tra lại kết nối của bạn');
        };
    }


    return (
        <LinearGradient colors={['#fbe1ed', '#f0e8f4', '#edf5f6']} style={tw`h-full`}>
            <SafeAreaView style={tw`h-full w-full`}>
                <StatusBar
                    translucent={true}
                    backgroundColor={'transparent'}
                    barStyle="dark-content"
                />
                <View style={tw`flex-1 items-center justify-center h-full w-full`}>
                    <TouchableOpacity style={tw`flex justify-center items-center`}>
                        <View style={tw`w-27 h-27 bg-[#ffffff] rounded-5 flex justify-center items-center`}>
                            {/* CHỗ Này để DùNG ảnH THì DùNG THẻ Image */}
                            <Image source={logo64}/>
                            {/* <FontAwesome5 name="ghost" size={58} color="#a41d3b" /> */}
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>

    );
}

export default HomeScreen
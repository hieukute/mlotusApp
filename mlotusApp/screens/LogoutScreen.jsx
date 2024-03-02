import { useState } from "react"
import { View, Text, Image, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import tw from "twrnc";
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { setConfig } from "../context/actions/userActions";

const MainScreen = ({ route }) => {
    const { user } = route.params;
    const [useImage, setUseImage] = useState(user.images);
    const [userName, setUserName] = useState(user.display_name);
    const [company, setCompany] = useState(user.company);
    const disPatch = useDispatch();
    const Navigation = useNavigation();

    const handleOnLogout = async () => {
        await AsyncStorage.removeItem('email_user');
        await AsyncStorage.removeItem('password_user');
        await AsyncStorage.removeItem('domain');
        await AsyncStorage.removeItem('database');
        await AsyncStorage.removeItem('method_url');
        disPatch(setConfig(null, null, null, null, null));
        Navigation.navigate('SplashScreen');
    }

    return (
        <SafeAreaView style={tw`h-full w-full`}>
            <View style={tw`flex items-center justify-between`}>
                <StatusBar
                    translucent={false}
                    backgroundColor={'#7b0031'}
                    barStyle="white-content"
                />
                <View style={tw`w-full h-14 absolute z-10 bg-[#ffffff] flex-row justify-start items-center`}>
                    <TouchableOpacity onPress={() => Navigation.goBack()} style={tw`ml-2`}>
                        <MaterialIcons name="chevron-left" size={35} color="#a41d3b" />
                    </TouchableOpacity>
                    <Text style={tw`text-base font-semibold text-[17px] text-[#a41d3b]`}>Chuyển tài khoản đăng nhập</Text>
                </View>
                <LinearGradient colors={['#fbe1ed', '#f0e8f4', '#edf5f6']} style={tw`h-full w-full`}>
                    <View style={tw`w-full h-full flex items-center justify-between py-2 px-3`}>
                        <View style={tw`w-full flex items-center justify-start mt-14`}>
                            <TouchableOpacity style={tw`w-full`} onPress={() => Navigation.goBack()}>
                                <View style={tw`w-full rounded-2.5 px-2 py-2 flex-row items-center content-start justify-start bg-[#a41d3b]`}>
                                    <Image source={{ uri: useImage }} resizeMode='cover' style={tw`h-11 w-11 rounded-full`} />
                                    <View style={tw`px-3`}>
                                        <Text style={tw`text-base font-semibold text-[16px] text-[#ffffff]`}>{userName}</Text>
                                        <Text style={tw`font-500 text-[13px] text-[#ffffff]`}>{company}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={tw`w-full`} onPress={handleOnLogout}>
                                <View style={tw`w-full rounded-2.5 px-2 py-2 flex-row items-center content-start justify-start`}>
                                    <View style={tw`h-11 w-11 rounded-full flex justify-center items-center`}>
                                        <View style={tw`h-8 w-8 rounded-full bg-[#a41d3b] flex justify-center items-center`}>
                                            <Entypo name="plus" size={15} color="#ffffff" />
                                        </View>
                                    </View>
                                    <View style={tw`px-2`}>
                                        <Text style={tw`text-base text-[15px] text-[#a41d3b]`}>Đăng nhập tài khoản khác</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </SafeAreaView>
    )
}
export default MainScreen
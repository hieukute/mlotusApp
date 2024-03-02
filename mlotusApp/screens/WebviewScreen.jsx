import { useState } from "react"
import { StatusBar, SafeAreaView } from 'react-native';
import WebView from 'react-native-webview';
import tw from "twrnc";
import { useSelector, useDispatch} from "react-redux";
import { setConfig } from "../context/actions/userActions";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPrint from "react-native-print";

const MainScreen = ({ route }) => {
    const config = useSelector((state) => state.config);
    const Navigation = useNavigation();
    const disPatch = useDispatch();
    const url = config.method + config.domain + `/web/api/v1/odoo_app_authenticate?login=${config.email}&&password=${config.password}&&db=${config.database}`

    const handleNavigationStateChange = (newNavState) => {
        const url_webview = newNavState.url;
        console.log(url_webview);
        if (url_webview.includes('logout') || url_webview.includes('web/login')) {
            handleOnLogout();
        }
    };
    const handleOnLogout = async () => {
        await AsyncStorage.removeItem('email_user');
        await AsyncStorage.removeItem('password_user');
        await AsyncStorage.removeItem('domain');
        await AsyncStorage.removeItem('database');
        await AsyncStorage.removeItem('method_url');
        disPatch(setConfig(null, null, null, null, null));
        Navigation.navigate('SplashScreen');
    }

    const handlePrint = (event) => {
        const base64Data = event.nativeEvent.data;
        const printOption = {
            html: `<img src=${base64Data} style='width:100%;height: auto;'/>`
        };
        RNPrint.print(printOption)
    }


    return (
        <SafeAreaView style={tw`h-full w-full`}>
            <StatusBar
                translucent={false}
                backgroundColor={'#4bb965'}
                barStyle="white-content"
            />
            <WebView
                source={{ uri: url }}
                originWhitelist={['*']}
                startInLoadingState={true}
                style={tw`h-full w-full`}
                cacheEnabled={false}
                onNavigationStateChange={handleNavigationStateChange}
                onMessage={handlePrint}/>
        </SafeAreaView>
    )
}
export default MainScreen
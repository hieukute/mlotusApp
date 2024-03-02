import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen, LoginScreen, LogoutScreen, WebviewScreen } from "./screens";
import { Provider } from "react-redux";
import Store from "./context/store";

const Stack = createNativeStackNavigator();

function HomeScreens() {
  return (
    <NavigationContainer>
        <Provider store={Store}>
            <Stack.Navigator screenOptions={{ 
                    headerShown: false
                }} initialRouteName='SplashScreen'>
                <Stack.Screen name="SplashScreen" component={SplashScreen} />
                <Stack.Screen options={{
                    animation: 'ios'
                }} name="LoginScreen" component={LoginScreen}/>
                <Stack.Screen name="LogoutScreen" options={{
                    animation: 'ios'
                }} component={LogoutScreen}/>
                <Stack.Screen name="WebviewScreen" options={{
                    animation: 'ios',
                    headerShown:false
                }} component={WebviewScreen}/>
            </Stack.Navigator>
        </Provider>
    </NavigationContainer>
  );
}

export default HomeScreens;

import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Linking
} from "react-native";
import Home from "../Screens/Home";
import Camera from "../Screens/Camera";
const Stack = createStackNavigator();
function LoginNavigator() {
    const linking = {
        prefixes: ['blindapp://','blindApp://pattern{?noofimages}','blindApp://pattern'],
      };
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ animationEnabled: false, headerShown: false }} >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Camera" component={Camera} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default LoginNavigator;
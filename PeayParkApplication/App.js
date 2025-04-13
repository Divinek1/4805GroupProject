// Main Application .js file. This is where it all starts! It takes you to LoginPage.js upon successful login.
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "./LoginPage"; // Importing LoginPage
import VerificationPage from './VerificationPage';
import SettingsPage from "./SettingsPage"; // Importing Settings Page
import MapPage from "./MapPage"; // Importing Map Page
import AdminPage from "./AdminPage"; // Importing Admin Page.
import ReportingPage from "./ReportingPage.js";
import createAccountPage from './createAccountPage';


const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? "MapPage" : "LoginPage"}>
                <Stack.Screen
                    name="LoginPage"
                    component={LoginPage}
                    options={{ headerShown: false }} // Hide the header for LoginPage
                />

                <Stack.Screen
                    name="createAccountPage"
                    component={createAccountPage} // This is your Create Account page
                    options={{ headerShown: false }} // Hide the header for SignupPage
                />

                <Stack.Screen
                    name="VerificationPage"
                    component={VerificationPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MapPage"
                    component={MapPage}
                    options={{ headerShown: false }} // Hide the header for MapPage
                />
                <Stack.Screen
                    name="AdminPage"
                    component={AdminPage}
                    options={{ headerShown: false }} // Hide the header for AdminPage
                />
                <Stack.Screen
                    name="ReportingPage"
                    component={ReportingPage}
                    options={{ headerShown: false }} // Hide the header for ReportingPage
                />
                <Stack.Screen
                    name="SettingsPage"
                    component={SettingsPage}
                    options={{ headerShown: false }} // Hide the header for SettingsPage
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
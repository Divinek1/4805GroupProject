/*
 Main Application .js file. This is where it all starts! It takes you to LoginPage.js upon successful login. It also
 manages the StackScreen for the entire application and allows us to navigate freely through each of the pages,
 represented by various .js files.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './AuthContext'; // Importing AuthContext so we can do user session that allow us to not have to sign in every time we open and close application.
import LoginPage from "./LoginPage"; // Importing LoginPage
import VerificationPage from './VerificationPage';
import SettingsPage from "./SettingsPage"; // Importing Settings Page
import MapPage from "./MapPage"; // Importing Map Page
import AdminPage from "./AdminPage"; // Importing Admin Page.
import ReportingPage from "./ReportingPage.js";
import createAccountPage from './createAccountPage';

const Stack = createNativeStackNavigator();


export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="LoginPage">
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
        </AuthProvider>
    );
}

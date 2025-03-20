import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

// Put your page imports here :) -CD
import MapPage from './MapPage';
import SettingsPage from './SettingsPage';

const LoginPage = () => { // Copy this to make new pages :) -CD Mitchell working on it.



    return (
        <View style={styles.container}>
            <Text>PeayPark Login Page 🚗🚗🚗</Text>
            {/* Add custom content for Page  here */}
            <TouchableOpacity
                className="bg-indigo-500 mr-3 mt-2 rounded-md py-2"
                style={{ elevation: 3 }}
                onPress={() => navigation.navigate("Signup")}>

                <Text>Sign up</Text>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text>Login</Text>
            </TouchableOpacity>



        </View>


    );
};
const AdminPage = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Admin Page</Text>
            {/* Add custom content for Page  here */}
        </View>
    );
};

const Page4 = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Page 4</Text>
            {/* Add custom content for Page here */}
        </View>
    );
};

const Page5 = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Page 5</Text>
            {/* Add custom content for Page  here */}
        </View>
    );
};

const ReportingPage = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Reporting Page</Text>
            {/* Add custom content for Page  here */}
        </View>
    );
};


const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
      <View style={styles.container}>
        <Text>PeayPark!</Text>
        <Button title="Go to Login Page" onPress={() => navigation.navigate('Login Page')} />
        <Button title="Go to Map Page" onPress={() => navigation.navigate('Map Page')} />
        <Button title="Go to Administration Page" onPress={() => navigation.navigate('Admin Page')} />
        <Button title="Go to Whatever Page" onPress={() => navigation.navigate('Page 4')} />
        <Button title="Go to Whatever Page" onPress={() => navigation.navigate('Page 5')} />
        <Button title="Go to Reporting Page" onPress={() => navigation.navigate('Reporting Page')} />
        <Button title="Go to Settings Page" onPress={() => navigation.navigate('Settings Page')} />
      </View>
  );
};

export default function App() { // Once pages are customized, copy what I did for the pages :)
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login Page" component={LoginPage} />
          <Stack.Screen name="Map Page" component={MapPage} />
          <Stack.Screen name="Admin Page" component={AdminPage} />
          <Stack.Screen name="Page 4" component={Page4} />
          <Stack.Screen name="Page 5" component={Page5} />
          <Stack.Screen name="Reporting Page" component={ReportingPage} />
          <Stack.Screen name="Settings Page" component={SettingsPage}  />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

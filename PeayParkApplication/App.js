import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Button, StyleSheet, Text, View} from 'react-native';


const LoginPage = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Login Page</Text>
            {/* Add custom content for Page  here */}
        </View>
    );
};

const MapPage = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Map Page</Text>
            {/* Add custom content for Page  here */}
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

const SettingsPage = () => { // Copy this to make new pages.
    return (
        <View style={styles.container}>
            <Text>Welcome to Settings Page</Text>
            {/* Add custom content for Page  here */}
        </View>
    );
};









const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
      <View style={styles.container}>
        <Text>PeayPark!</Text>
        <Button title="Go to Login Page" onPress={() => navigation.navigate('LoginPage')} />
        <Button title="Go to Map Page" onPress={() => navigation.navigate('MapPage')} />
        <Button title="Go to Administration Page" onPress={() => navigation.navigate('AdminPage')} />
        <Button title="Go to Whatever Page" onPress={() => navigation.navigate('Page4')} />
        <Button title="Go to Whatever Page" onPress={() => navigation.navigate('Page5')} />
        <Button title="Go to Reporting Page" onPress={() => navigation.navigate('ReportingPage')} />
        <Button title="Go to Settings Page" onPress={() => navigation.navigate('SettingsPage')} />
      </View>
  );
};

export default function App() { // Once pages are customized, copy what I did for the pages :)
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="MapPage" component={MapPage} />
          <Stack.Screen name="AdminPage" component={AdminPage} />
          <Stack.Screen name="Page4" component={Page4} />
          <Stack.Screen name="Page5" component={Page5} />
          <Stack.Screen name="ReportingPage" component={ReportingPage} />
          <Stack.Screen name="SettingsPage" component={SettingsPage}  />
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

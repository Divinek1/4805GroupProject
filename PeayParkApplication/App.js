import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import {Button, StyleSheet, Text, View} from 'react-native';

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
  return (
      <View style={styles.container}>
        <Text>PeayPark!</Text>
        <Button title="Go to Page 1" onPress={() => navigation.navigate('Page1')} />
        <Button title="Go to Page 2" onPress={() => navigation.navigate('Page2')} />
        <Button title="Go to Page 3" onPress={() => navigation.navigate('Page3')} />
        <Button title="Go to Page 4" onPress={() => navigation.navigate('Page4')} />
        <Button title="Go to Page 5" onPress={() => navigation.navigate('Page5')} />
        <Button title="Go to Page 6" onPress={() => navigation.navigate('Page6')} />
        <Button title="Go to Page 7" onPress={() => navigation.navigate('Page7')} />
      </View>
  );
};

const PageScreen = ({ route }) => {
  return (
      <View style={styles.container}>
        <Text>{route.params.title}</Text>
        <Button title="Go Back" onPress={() => route.navigation.goBack()} />
      </View>
  );
};

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Page1" component={PageScreen} initialParams={{ title: 'Welcome to Login Page' }} />
          <Stack.Screen name="Page2" component={PageScreen} initialParams={{ title: 'Welcome to Map Page' }} />
          <Stack.Screen name="Page3" component={PageScreen} initialParams={{ title: 'Welcome to Page 3' }} />
          <Stack.Screen name="Page4" component={PageScreen} initialParams={{ title: 'Welcome to Page 4' }} />
          <Stack.Screen name="Page5" component={PageScreen} initialParams={{ title: 'Welcome to Page 5' }} />
          <Stack.Screen name="Page6" component={PageScreen} initialParams={{ title: 'Welcome to Page 6' }} />
          <Stack.Screen name="Page7" component={PageScreen} initialParams={{ title: 'Welcome to Settings page.' }} />
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

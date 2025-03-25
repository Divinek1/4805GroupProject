import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoginPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>PeayPark Login Page 🚗🚗🚗</Text>
            {/* Add custom content for Page here */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default LoginPage;
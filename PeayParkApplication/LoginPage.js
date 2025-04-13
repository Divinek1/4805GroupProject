//import React from 'react';
import React, {useState} from 'react';
import {supabase} from "./supabase";

import {Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

const LoginPage = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Missing Info", "Please enter both email and password.");
            return;
        }

        try {
            // Use signInWithPassword() for email/password authentication
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Login error:", error.message);
                Alert.alert("Login Failed", `Error: ${error.message}`);
            } else {
                console.log("Login success:", data.user);  // Check the user object
                Alert.alert("Login Success", `Welcome ${data.user.email}!`);
                navigation.navigate("MapPage");  // Redirect to MapPage after login
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            Alert.alert("Login Error", "Something went wrong.");
        }
    };


    return (

        <View style={styles.container}>
            {/* Logo */}
            <Text style={styles.logo}>🚗 PEAYPARK</Text>

            {/* Email input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {/* Password input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {/* Active Log In button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>


            {/* Forgot Password */}
            <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Create Account button */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("createAccountPage")}
            >
                <Text style={styles.createButtonText}>Create an Account</Text>
            </TouchableOpacity>


            {/* APSU Branding */}

            <Text style={styles.apsuText}>Austin Peay State University</Text>
            <Text style={styles.apsuSubText}>CLARKSVILLE • TENNESSEE</Text>
        </View>

    );
};

const styles = StyleSheet.create({


    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 40,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        marginVertical: 8,
        fontSize: 16,
    },
    loginButton: {
        width: '100%',
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotText: {
        marginTop: 10,
        color: '#555',
        fontSize: 14,
    },
    createButton: {
        marginTop: 30,
        backgroundColor: '#d32f2f',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 6,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    apsuText: {
        marginTop: 30,
        fontWeight: 'bold',
        fontSize: 14,
        color: '#000',
    },
    apsuSubText: {
        fontSize: 12,
        color: '#000',
    },
});

export default LoginPage;
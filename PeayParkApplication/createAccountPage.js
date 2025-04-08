import React, { useState } from 'react';
import { supabase } from './supabase'; // Import the Supabase client
import { Alert, TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CreateAccountPage = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');

    const handleSignup = async () => {
        if (!email || !password || !reenterPassword) {
            Alert.alert("Missing Info", "Please fill in all fields.");
            return;
        }

        if (password !== reenterPassword) {
            Alert.alert("Password Error", "Passwords do not match.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        try {
            // Sign up with Supabase Auth
            const { user, error } = await supabase.auth.signUp({
                email,
                password,
            });

            // Log both user and error to understand the response
            console.log("Signup Response: ", { user, error });

            if (error) {
                console.error("Signup error:", error.message);
                Alert.alert("Signup Failed", `Error: ${error.message}`);
                return;
            }

            // Check if the user object is returned successfully
            if (user) {
                console.log("User created successfully:", user);  // Log the user object
                Alert.alert("Signup Success", `A verification email has been sent to ${user.email}. Please verify your email.`);
                navigation.navigate("VerificationPage", { email: user.email });
            } else {
                console.error("User is undefined or not returned from Supabase.");
                Alert.alert("Signup Error", "There was an issue with the signup process.");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            Alert.alert("Signup Error", "Something went wrong.");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Create an Account</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Re-enter Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={reenterPassword}
                onChangeText={setReenterPassword}
            />

            <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("LoginPage")}>
                <Text style={styles.forgotText}>Already have an account? Log In</Text>
            </TouchableOpacity>

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
    signupButton: {
        width: '100%',
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    },
    signupButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotText: {
        marginTop: 10,
        color: '#555',
        fontSize: 14,
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

export default CreateAccountPage;

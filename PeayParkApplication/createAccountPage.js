//user will be able to create their own account  email ending in @my.apsu.edu will be student , @apsu.edu will be staff , everything else is guest.
//when users create their account they will also have to verify it by a 6 digit code sent to their email.
import React, { useState } from 'react';
import { supabase } from './supabase';
import { Alert, TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CreateAccountPage = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reenterPassword, setReenterPassword] = useState('');

    const handleSignup = async () => {
        if (!firstName || !lastName || !email || !password || !reenterPassword) {
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

        // Auto-detect user type from email
        let userType = 'Guest';
        if (email.endsWith('@my.apsu.edu')) {
            userType = 'Student';
        } else if (email.endsWith('@apsu.edu')) {
            userType = 'Faculty';
        }

        try {
            const { data, error } = await supabase.auth.signUp({ email, password });

            if (error) {
                console.error("Signup error:", error.message);
                Alert.alert("Signup Failed", `Error: ${error.message}`);
                return;
            }

            Alert.alert("Verification Sent", `Check your email (${email}) for a 6-digit code.`);

            navigation.navigate("VerificationPage", {
                email,
                firstName,
                lastName,
                userType
            });
        } catch (err) {
            console.error("Unexpected Signup Error:", err);
            Alert.alert("Unexpected Error", "Something went wrong during signup.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Create an Account</Text>

            <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#888"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#888"
                value={lastName}
                onChangeText={setLastName}
            />
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

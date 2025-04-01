// GOOD JOB MITCHELL
// I am re-arranging pages, so I am adding a bypass login button while you are working so we can keep testing our pages
// without messing with your stuff! -CD
/*
This is the login page that contains both the application user interface page and the functions necessary
for logging into the parking system as a guest, faculty member, student, or administrator.
 */
import React from 'react';
import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

const LoginPage = ({ navigation }) => {
    return (

        <View style={styles.container}>
            {/* Logo */}
            <Text style={styles.logo}>🚗 PEAYPARK</Text>

            {/* Email input */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#888"
            />

            {/* Password input */}
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
            />

            {/* Active Log In button */}
            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => navigation.navigate("Home")} // Change "Home" to whatever your main screen is
            >
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Create Account button */}
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("Signup")}
            >
                <Text style={styles.createButtonText}>Create an Account</Text>
            </TouchableOpacity>

            {/* APSU Branding */}
            <Text style={styles.apsuText}>Austin Peay State University</Text>
            <Text style={styles.apsuSubText}>CLARKSVILLE • TENNESSEE</Text>


            <Button // Special Button WILL REMOVE LATER
                title="Bypass Login"
                onPress={() => navigation.navigate("MapPage")} // Navigate to MapPage
                color="#FF0000"
            />
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
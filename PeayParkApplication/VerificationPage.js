import React, { useState } from 'react';
import { supabase } from './supabase'; // Import the Supabase client
import { Alert, TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const VerificationPage = ({ route, navigation }) => {
    const { email } = route.params; // Get email from the previous screen's params
    const [verificationCode, setVerificationCode] = useState('');

    const handleVerification = async () => {
        if (!verificationCode) {
            Alert.alert("Missing Code", "Please enter the verification code.");
            return;
        }

        try {
            // Call Supabase to verify the email (no direct code verification needed)
            const { user, error } = await supabase.auth.verifyOtp({
                email,
                token: verificationCode,
                type: 'signup',
            });

            if (error) {
                console.error("Verification error:", error.message);
                Alert.alert("Verification Failed", `Error: ${error.message}`);
            } else {
                console.log("Verification success:", user);
                Alert.alert("Email Verified", "Your email has been verified!");
                navigation.navigate("LoginPage"); // Redirect to LoginPage after verification
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            Alert.alert("Verification Error", "Something went wrong.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>PEAYPARK</Text>

            <Text style={styles.infoText}>Enter the verification code sent to: {email}</Text>

            <TextInput
                style={styles.input}
                placeholder="Verification Code"
                placeholderTextColor="#888"
                value={verificationCode}
                onChangeText={setVerificationCode}
            />

            <TouchableOpacity onPress={handleVerification} style={styles.verifyButton}>
                <Text style={styles.verifyButtonText}>Verify</Text>
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
    infoText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
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
    verifyButton: {
        width: '100%',
        backgroundColor: '#ccc',
        padding: 15,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    },
    verifyButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
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

export default VerificationPage;

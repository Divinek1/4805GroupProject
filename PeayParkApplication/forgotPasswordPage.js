//once the user click the forgotpassword button they will be prompted to enter thier email and then get sent to the verification2 page to enter a 6 digit code.
import React, { useState } from 'react';
import { supabase } from './supabase';
import {
    Alert,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

const forgotPasswordPage = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        if (!email) {
            Alert.alert("Missing Info", "Please enter your email.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email); // Sends a 6-digit OTP

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("Code Sent", "We've sent a 6-digit code to your email.");
            navigation.navigate('verificationPage2', { email }); // Send user to enter OTP
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.logo}>PEAYPARK</Text>

                <Text style={styles.infoText}>
                    Enter your email to receive a 6-digit code to reset your password.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TouchableOpacity onPress={handlePasswordReset} style={styles.button}>
                    <Text style={styles.buttonText}>Send Code</Text>
                </TouchableOpacity>

                <Text style={styles.apsuText}>Austin Peay State University</Text>
                <Text style={styles.apsuSubText}>CLARKSVILLE • TENNESSEE</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { fontSize: 28, fontWeight: 'bold', color: '#d32f2f', marginBottom: 20 },
    infoText: { fontSize: 16, color: '#333', marginBottom: 10, textAlign: 'center' },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#d32f2f',
        padding: 15,
        borderRadius: 6,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    apsuText: { marginTop: 40, fontWeight: 'bold', fontSize: 14, color: '#000' },
    apsuSubText: { fontSize: 12, color: '#000' },
});

export default forgotPasswordPage;

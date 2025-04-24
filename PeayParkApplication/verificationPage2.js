// user will have to enter the 6 digit code to make sure their account it verified again and they get sent to changepassword page.
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

const verificationPage2 = ({ route, navigation }) => {
    const { email } = route.params;
    const [verificationCode, setVerificationCode] = useState('');

    const handleVerify = async () => {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: verificationCode,
            type: 'recovery',
        });

        if (error || !data?.user) {
            Alert.alert("Verification Failed", "Invalid or expired code.");
        } else {
            Alert.alert("Verified", "You may now reset your password.");
            navigation.navigate('changePasswordPage');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.logo}>PEAYPARK</Text>
                <Text style={styles.infoText}>Enter the 6-digit code sent to {email}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="6-digit code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                />

                <TouchableOpacity onPress={handleVerify} style={styles.button}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { fontSize: 28, fontWeight: 'bold', color: '#d32f2f', marginBottom: 20 },
    infoText: { fontSize: 16, marginBottom: 10, textAlign: 'center', color: '#333' },
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
});

export default verificationPage2;

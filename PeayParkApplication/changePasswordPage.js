//users will be able to change their password then get sent back to the login screen
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

const changePasswordPage = ({ navigation }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            Alert.alert("Missing Info", "Please fill in both fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert("Mismatch", "Passwords do not match.");
            return;
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            Alert.alert("Error", error.message);
        } else {
            await supabase.auth.signOut();
            Alert.alert("Success", "Password updated. Please log in.");
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginPage' }],
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.logo}>Set New Password</Text>

                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />

                <TouchableOpacity onPress={handleChangePassword} style={styles.button}>
                    <Text style={styles.buttonText}>Update Password</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    logo: { fontSize: 28, fontWeight: 'bold', color: '#d32f2f', marginBottom: 20 },
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

export default changePasswordPage;

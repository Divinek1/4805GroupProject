import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from "./supabase";

import AdminPage from "./AdminPage";

const SettingsPage = () => {
    const navigation = useNavigation();
    const [isAdmin, setIsAdmin] = useState(false);

    // This determines whether or not a user possesses adminstrator priveleges. If so, admin button is visible.
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;

                if (user) {
                    // Check admin status in SupaBase Account Sample table
                    const { data, error } = await supabase
                        .from('SupaBase Account Sample')
                        .select('Administrator_Access')
                        .eq('UserID', user.id)
                        .maybeSingle();

                    if (error) throw error;

                    // Set admin status based on Administrator_Access value
                    setIsAdmin(data?.Administrator_Access === 'true');
                }
            } catch (error) {
                console.error('Error checking admin status:', error.message);
            }
        };

        checkAdminStatus();
    }, []);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Navigate to LoginPage after successful logout
            navigation.reset({
                index: 0,
                routes: [{ name: 'LoginPage' }],
            });
        } catch (error) {
            console.error('Error logging out:', error.message);
            Alert.alert('Error', 'Failed to log out. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <Button
                    title="Back"
                    onPress={() => navigation.goBack()}
                    color="#841584"
                />
            </View>
            {/* Only show Admin button if user is admin */}
            {isAdmin && (
                <View style={styles.adminButtonContainer}>
                    <Button
                        title="Admin"
                        onPress={() => navigation.navigate(AdminPage)}
                        color="#841584"
                    />
                </View>
            )}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Logout"
                        onPress={handleLogout}
                        color="#841584"
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButtonContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        zIndex: 1,
    },
    adminButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        zIndex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
    },
});

export default SettingsPage;

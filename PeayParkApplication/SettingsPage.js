/*
This is SettingsPage.js, where a user can log out of their account or if they are an administrator, they can access the
administrator settings that allow them to add, delete, and modify parking lots in the supabase table "Parking Lot Table".
 */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from "./supabase";
import AdminPage from "./AdminPage";

const SettingsPage = () => {
    const navigation = useNavigation();
    const [isAdmin, setIsAdmin] = useState(false);

    // This determines whether a user possesses administrator privileges. If so, admin button is visible.
    useEffect(() => {
        const checkAdminStatus = async () => {
            try {
                // Get current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;

                if (user) {
                    // Check admin status in SupaBase Account Sample table
                    const { data, error } = await supabase
                        .from('SupaBase Account Table')
                        .select('Administrator_Access')
                        .eq('UserID', user.id)
                        .maybeSingle();

                    if (error) throw error;

                    // Set admin status based on Administrator_Access value in supabase table.
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
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Settings</Text>
            </View>

            {/* Main Options Container */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.optionText}>Logout</Text>
                </TouchableOpacity>

                {/* Only show Admin button if user is admin */}
                {isAdmin && (
                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => navigation.navigate(AdminPage)}
                    >
                        <Text style={styles.optionText}>Admin</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 5,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 10,
        zIndex: 1,
    },
    backButtonText: {
        color: '#FF0000',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerText: {
        padding: 20,
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    optionsContainer: {
        borderColor: 'black',
        padding: 20,
    },
    optionButton: {
        backgroundColor: '#FF0000',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
    },
    optionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    }
});

export default SettingsPage;

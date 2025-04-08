import React from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

import AdminPage from "./AdminPage"; // Import functions

const SettingsPage = () => {
    const navigation = useNavigation(); // Get the navigation object

    return (
        <View style={styles.container}>
            <View style={styles.backButtonContainer}>
                <Button
                    title="Back"
                    onPress={() => navigation.goBack()} // Navigate back to the previous screen
                    color="#841584"
                />
            </View>
            <View style={styles.adminButtonContainer}>
                <Button
                    title="Admin"
                    onPress={() => navigation.navigate(AdminPage)} // Navigate to AdminPage
                    color="#841584"
                />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Dummy Setting (Use this to add stuff)"
                        // onPress={} Call the imported function. (Don't forget to import at top of screen)
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
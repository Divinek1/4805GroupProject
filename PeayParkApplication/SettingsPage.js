/*
This is the Settings Page. It will take care of changing map overlay settings as well as providing a way for
administrators to get access to the administrator screen.
 */
import React from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { updateData, takeParkingSpace, leaveParkingSpace } from './parkingFunctions'; // Import functions

const SettingsPage = () => {
    const navigation = useNavigation(); // Get the navigation object

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Button
                    title="Back"
                    onPress={() => navigation.goBack()} // Navigate back to the previous screen
                    color="#841584"
                />
                <Button
                    title="Set Map Overlay to Digital"
                    onPress={() => {/* Add your function here */}}
                    color="#841584"
                />
                <Button
                    title="Set Map Overlay to Satellite"
                    onPress={() => {/* Add your function here */}}
                    color="#841584"
                />
                <Button
                    title="Update Parking Lot Name TEST"
                    onPress={updateData} // Call the imported function
                    color="#841584"
                />
                <Button
                    title="Parking Lot Spaces -1 TEST"
                    onPress={() => takeParkingSpace('Foy_updated')} // Call the imported function
                    color="#841584"
                />
                <Button
                    title="Parking Lot Spaces +1 Test"
                    onPress={() => leaveParkingSpace('Foy_updated')} // Call the imported function
                    color="#841584"
                />
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
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        textAlign: 'center',
    },
});

export default SettingsPage;
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import { supabase } from './supabase';

const SettingsPage = () => {

    const QuitApplication = () => {
        // You can replace this with your actual quit logic
        Alert.alert("Quit Program", "Are you sure you want to quit?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "OK",
                onPress: () => {
                    process.exit(0);
                    console.log("Program has been quitted, but in a good way.");
                }
            }
        ]);
    };

    async function updateData() { // Testing updating tables YEEHAW
        const { data, error } = await supabase
            .from('Parking Lot Table') // from Parking Lot Table
            .update({ ParkingLotID: 'Foy_updated' }) // Set the new value for ParkingLotID
            .eq('ParkingLotID', 'Foy') // Filter to ensure we update only the desired row
            .select();

        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated successfully:', data);
        }
    }

    async function parkCar() {
        const { data, error } = await supabase
            .from('Parking Lot Table') // from Parking Lot Table
            .update({ ParkingLotID: '' }) // Set the new value for number of spaces available
            .eq('ParkingLotID', 'Foy_updated') // Filter to ensure we update only the desired row
            .select();

        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated successfully:', data);
        }
    }


















    // This needs to have onClicked for Changing Map overlay for 2 settings ***************
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity style={styles.settingOption}>
                    <Text style={styles.settingText}>Set Map Overlay to Digital</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingOption}>
                    <Text style={styles.settingText}>Set Map Overlay to Satellite</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingOption} onPress={updateData}>
                    <Text style={styles.settingText}>Send update to Supabase (Test Function)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingOption} onPress={QuitApplication}>
                    <Text style={styles.settingText}>Quit Program</Text>
                </TouchableOpacity>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    searchBar: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    scrollContainer: {
        flexGrow: 1, // Allows the ScrollView to grow and fill the available space
        justifyContent: 'flex-start', // Aligns items to the top
        textAlign: 'center',
    },
    settingOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    settingText: {
        fontSize: 18,
    },
});

export default SettingsPage;
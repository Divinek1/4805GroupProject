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

    async function updateData() { // Testing updating tables, I think this counts as a stored procedure?
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


    // How to call and test this function ->>>>>>>> onPress={takeParkingSpace('Foy_updated')}
    /*
    async function takeParkingSpace(parkingLotID) { // This keeps automatically getting called when settings opens.
        // Getting the current number of Available Parking Spots
        const { data: currentData, error: fetchError } = await supabase
            .from('Parking Lot Table')
            .select('AvailableSpaces')
            .eq('ParkingLotID', parkingLotID)
            .single(); // Retrieve only one row

        if (fetchError) {
            console.error('Error fetching current AvailableSpaces:', fetchError);
            return; // Exit the function if there's an error
        }

        if (currentData && currentData.AvailableSpaces > 0) {
        // Decrement AvailableSpaces if there are spaces available
            const newAvailableSpaces = currentData.AvailableSpaces - 1;

            const { data, error } = await supabase
                .from('Parking Lot Table')
                .update({ AvailableSpaces: newAvailableSpaces }) // Update with new value
                .eq('ParkingLotID', parkingLotID) // Filter to ensure we update only the desired row
                .select();

            if (error) {
                console.error('Error updating AvailableSpaces:', error);
            } else {
                console.log('Available spaces were decremented once!', data);
            }
        } else {
            console.log('You cannot park here, there are no spots available', parkingLotID);
        }
    }

*/


// Also this is where ive been testing functions. feel free to copy a button and add a call!
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
                    <Text style={styles.settingText}>Update Parking Lot Name TEST</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingOption}>
                    <Text style={styles.settingText}>Foy Available Spaces - 1 TEST</Text>
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
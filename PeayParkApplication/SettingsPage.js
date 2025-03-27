import React from 'react';
import {View, StyleSheet, ScrollView, Alert, Button} from 'react-native';
import { supabase } from './supabase';

const SettingsPage = () => {

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


    // How to call and test this function ->>>>>>>> onPress={() => takeParkingSpace('Foy_updated')}
    async function takeParkingSpace(parkingLotID) {
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

// How to call and test this function ->>>>>>>> onPress={() => leaveParkingSpace('Foy_updated')}
    async function leaveParkingSpace(parkingLotID) {
        // Getting the current number of Available Parking Spots and Total Spaces
        const { data: currentData, error: fetchError } = await supabase
            .from('Parking Lot Table')
            .select('AvailableSpaces, TotalSpaces') // Fetch both AvailableSpaces and TotalSpaces
            .eq('ParkingLotID', parkingLotID)
            .single(); // Retrieve only one row

        if (fetchError) {
            console.error('Error fetching current AvailableSpaces and TotalSpaces:', fetchError);
            return; // Exit the function if there's an error
        }

        if (currentData) {
            const { AvailableSpaces, TotalSpaces } = currentData;
            // Validate if we can increment AvailableSpaces
            if (AvailableSpaces < TotalSpaces) {
                // Increment AvailableSpaces
                const newAvailableSpaces = AvailableSpaces + 1;

                const { data, error } = await supabase
                    .from('Parking Lot Table')
                    .update({ AvailableSpaces: newAvailableSpaces }) // Update with new value
                    .eq('ParkingLotID', parkingLotID) // Filter to ensure we update only the desired row
                    .select();

                if (error) {
                    console.error('Error: Unable to update AvailableSpaces.', error);
                } else {
                    console.log('Available spaces were incremented once!', data);
                }
            } else {
                console.log('Error: There are already max spaces available', parkingLotID);
            }
        } else {
            console.log('This parkingLotID does not exist.', parkingLotID);
        }
    }


// Also this is where ive been testing functions. feel free to copy a button and add a call!
    // This needs to have onClicked for Changing Map overlay for 2 settings ***************
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Button
                    title="Set Map Overlay to Digital"
                    onPress={() => {/* Add your function here */}}
                    color="#841584" // You can customize the button color
                />
                <Button
                    title="Set Map Overlay to Satellite"
                    onPress={() => {/* Add your function here */}}
                    color="#841584" // You can customize the button color
                />
                <Button
                    title="Update Parking Lot Name TEST"
                    onPress={updateData}
                    color="#841584" // You can customize the button color
                />
                <Button
                    title="Parking Lot Spaces -1 TEST"
                    onPress={() => takeParkingSpace('Foy_updated')}
                    color="#841584" // You can customize the button color
                />
                <Button
                    title="Parking Lot Spaces +1 Test"
                    onPress={() => leaveParkingSpace('Foy_updated')}
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
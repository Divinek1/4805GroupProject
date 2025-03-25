// Main Application

import React from 'react';
import {View, StyleSheet, ScrollView, Button} from 'react-native';
import { updateData, takeParkingSpace, leaveParkingSpace } from './parkingFunctions'; // Import the functions


const SettingsPage = () => {

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
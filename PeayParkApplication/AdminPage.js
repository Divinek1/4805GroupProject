/*
This is the Administration Page. It includes a graphical user interface for the user (specifically those designated as
administrators). It also includes forms for administrators to change the SupaBase Parking Lot Table from within the app
without having to log in to SupaBase on their website.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';
import SettingsPage from "./SettingsPage"; // Make sure to import your Supabase configuration

const AdminPage = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        ParkingLotID: '',
        Latitude: '',
        Longitude: '',
        AvailableSpaces: '',
        TotalSpaces: '',
        OpenHours: '',
        CloseHours: '',
        LotType: '',
    });
    const [parkingLots, setParkingLots] = useState([]);
    const [selectedParkingLot, setSelectedParkingLot] = useState(null);

    useEffect(() => {
        fetchParkingLots();
    }, []);

    const fetchParkingLots = async () => {
        try {
            const { data, error } = await supabase
                .from('Parking Lot Table')
                .select('ParkingLotID');

            if (error) throw error;

            setParkingLots(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const validateForm = () => {
        // Validate required fields
        if (!formData.ParkingLotID || !formData.Latitude || !formData.Longitude ||
            !formData.AvailableSpaces || !formData.TotalSpaces ||
            !formData.OpenHours || !formData.CloseHours) {
            Alert.alert('Error', 'All fields are required');
            return false;
        }

        // Validate coordinates
        const latRegex = /^-?([1-8]?[1-9]|[1-9]0)\.\d{1,15}/;
        const lonRegex = /^-?((1[0-7]|[1-9])?[0-9]|180)\.\d{1,15}/;

        if (!latRegex.test(formData.Latitude)) {
            Alert.alert('Error', 'Invalid latitude format');
            return false;
        }
        if (!lonRegex.test(formData.Longitude)) {
            Alert.alert('Error', 'Invalid longitude format');
            return false;
        }

        // Validate time format (HH:MM:SS)
        const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
        if (!timeRegex.test(formData.OpenHours)) {
            Alert.alert('Error', 'Invalid open hours format. Use HH:MM:SS');
            return false;
        }
        if (!timeRegex.test(formData.CloseHours)) {
            Alert.alert('Error', 'Invalid close hours format. Use HH:MM:SS');
            return false;
        }

        // Validate spaces are numbers
        if (isNaN(formData.AvailableSpaces) || isNaN(formData.TotalSpaces)) {
            Alert.alert('Error', 'Spaces must be valid numbers');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('Parking Lot Table')
                .insert([formData]);

            if (error) {
                setIsLoading(false);
                throw error;
            }

            Alert.alert('Success', 'Parking lot added successfully!');
            setModalVisible(false);
            setFormData({
                ParkingLotID: '',
                Latitude: '',
                Longitude: '',
                AvailableSpaces: '',
                TotalSpaces: '',
                OpenHours: '',
                CloseHours: '',
                LotType: '',
            });
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedParkingLot) return;

        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('Parking Lot Table')
                .delete()
                .eq('ParkingLotID', selectedParkingLot);

            if (error) throw error;

            Alert.alert('Success', 'Parking lot deleted successfully!');
            setDeleteModalVisible(false);
            fetchParkingLots(); // Refresh the list
            setSelectedParkingLot(null);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate(SettingsPage)}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Administrator</Text>
            </View>

            {/* Main Administrator Options */}
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.optionText}>Add Parking Lot</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                        fetchParkingLots(); // Make sure to fetch the latest parking lots
                        setDeleteModalVisible(true);
                    }}
                >
                    <Text style={styles.optionText}>Delete Parking Lot</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionButton}>
                    <Text style={styles.optionText}>Modify Parking Lot</Text>
                </TouchableOpacity>
            </View>

            {/* Adding Parking Lot Modal. This form submits data to supabase. */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Parking Lot</Text>

                        <Text style={styles.label}>Parking Lot Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Parking Lot Name"
                            value={formData.ParkingLotID}
                            onChangeText={(text) => setFormData({ ...formData, ParkingLotID: text })}
                        />

                        <Text style={styles.label}>Latitude</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Latitude"
                            value={formData.Latitude}
                            onChangeText={(text) => setFormData({ ...formData, Latitude: text })}
                            keyboardType="default"
                        />

                        <Text style={styles.label}>Longitude</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Longitude"
                            value={formData.Longitude}
                            onChangeText={(text) => setFormData({ ...formData, Longitude: text })}
                            keyboardType="default"
                        />

                        <Text style={styles.label}>Available Spaces</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Available Spaces"
                            value={formData.AvailableSpaces}
                            onChangeText={(text) => setFormData({ ...formData, AvailableSpaces: text })}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Total Parking Spaces</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Total Spaces"
                            value={formData.TotalSpaces}
                            onChangeText={(text) => setFormData({ ...formData, TotalSpaces: text })}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Open Time (HH:MM:SS)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Open Hours (HH:MM:SS)"
                            value={formData.OpenHours}
                            onChangeText={(text) => setFormData({ ...formData, OpenHours: text })}
                        />

                        <Text style={styles.label}>Close Time (HH:MM:SS)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Close Hours (HH:MM:SS)"
                            value={formData.CloseHours}
                            onChangeText={(text) => setFormData({ ...formData, CloseHours: text })}
                        />

                        <Text style={styles.label}>Lot Type (Student, Faculty, Guest)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="LotType"
                            value={formData.LotType}
                            onChangeText={(text) => setFormData({ ...formData, LotType: text })}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            >
                                <Text style={styles.modalButtonText}>
                                    {isLoading ? 'Submitting...' : 'Submit'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Parking Lot Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Delete Parking Lot</Text>
                        <FlatList
                            data={parkingLots}
                            keyExtractor={(item) => item.ParkingLotID}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => setSelectedParkingLot(item.ParkingLotID)}
                                    style={{
                                        padding: 10,
                                        backgroundColor: selectedParkingLot === item.ParkingLotID ? '#FF3B30' : '#fff',
                                        marginBottom: 5,
                                        borderRadius: 5,
                                    }}
                                >
                                    <Text style={{ color: selectedParkingLot === item.ParkingLotID ? '#fff' : '#000' }}>
                                        {item.ParkingLotID}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleDelete}
                                disabled={isLoading || !selectedParkingLot}
                            >
                                <Text style={styles.modalButtonText}>
                                    {isLoading ? 'Deleting...' : 'Delete'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
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
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    optionsContainer: {
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '90%',
        zIndex: 2, // Ensure modal content is above other elements
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 15,
        borderRadius: 5,
        width: '45%',
    },
    submitButton: {
        backgroundColor: '#FF0000',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    modalButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default AdminPage;
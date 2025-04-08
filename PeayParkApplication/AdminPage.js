/*
This is the Administration Page. It includes a graphical user interface for the user (specifically those designated as
administrators). It also includes forms for administrators to change the SupaBase Parking Lot Table from within the app
without having to log in to SupaBase on their website.
 */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Alert, FlatList, Platform, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase'; // Make sure to import supabase config.
import DateTimePicker from '@react-native-community/datetimepicker';

const AdminPage = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modifyModalVisible, setModifyModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
    const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);
    const [formData, setFormData] = useState({
        ParkingLotID: '',
        Latitude: '',
        Longitude: '',
        AvailableSpaces: '',
        TotalSpaces: '',
        OpenHours: '00:00:00',
        CloseHours: '00:00:00',
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
                .select('*'); // Fetch all fields

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
            !formData.OpenHours || !formData.CloseHours || !formData.LotType) {
            Alert.alert('Error', 'All fields are required');
            return false;
        }

        // Validate coordinates
        const latRegex = /^-?([1-8]?[1-9]|[1-9]0)\.\d{1,15}/; // Regex for Latitude
        const lonRegex = /^-?((1[0-7]|[1-9])?[0-9]|180)\.\d{1,15}/; // Regex for Longitude

        if (!latRegex.test(formData.Latitude)) {
            Alert.alert('Error', 'Invalid latitude format');
            return false;
        }
        if (!lonRegex.test(formData.Longitude)) {
            Alert.alert('Error', 'Invalid longitude format');
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
            resetFormData();
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModifySubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('Parking Lot Table')
                .update(formData)
                .eq('ParkingLotID', selectedParkingLot);

            if (error) {
                setIsLoading(false);
                throw error;
            }

            Alert.alert('Success', 'Parking lot modified successfully!');
            setModifyModalVisible(false);
            resetFormData();
            await fetchParkingLots();
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
            await fetchParkingLots();
            setSelectedParkingLot(null);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetFormData = () => {
        setFormData({
            ParkingLotID: '',
            Latitude: '',
            Longitude: '',
            AvailableSpaces: '',
            TotalSpaces: '',
            OpenHours: '00:00:00',
            CloseHours: '00:00:00',
            LotType: '',
        });
    };

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}:00`;
    };

    const handleTimeChange = (event, selectedDate, timeType) => {
        const currentDate = selectedDate || new Date();

        // Close the time picker for both platforms
        if (timeType === 'OpenHours') {
            setShowOpenTimePicker(false);
        } else {
            setShowCloseTimePicker(false);
        }

        // Only update the time if a date was selected (user didn't cancel)
        if (selectedDate) {
            const formattedTime = formatTime(currentDate);
            setFormData({
                ...formData,
                [timeType]: formattedTime
            });
        }
    };

    const TimePickerField = ({ label, value, onPress, showPicker, onTimeChange }) => {
        const timeValue = new Date();
        const [hours, minutes] = value.split(':');
        timeValue.setHours(parseInt(hours));
        timeValue.setMinutes(parseInt(minutes));

        return (
            <>
                <Text style={styles.label}>{label}</Text>
                <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={onPress}
                >
                    <Text style={styles.timePickerButtonText}>{value}</Text>
                </TouchableOpacity>
                {showPicker && (
                    <DateTimePicker
                        value={timeValue}
                        mode="time"
                        is24Hour={true}
                        display="spinner"
                        onChange={onTimeChange}
                        themeVariant="light"
                        textColor="black"
                        style={{ backgroundColor: 'white' }}
                    />
                )}
            </>
        );
    };

    const LotTypeSelector = ({ value, onChange }) => (
        <View style={styles.lotTypeContainer}>
            <TouchableOpacity
                style={[
                    styles.lotTypeButton,
                    value === 'Student' && styles.lotTypeButtonSelected
                ]}
                onPress={() => onChange('Student')}
            >
                <Text style={[
                    styles.lotTypeButtonText,
                    value === 'Student' && styles.lotTypeButtonTextSelected
                ]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.lotTypeButton,
                    value === 'Faculty' && styles.lotTypeButtonSelected
                ]}
                onPress={() => onChange('Faculty')}
            >
                <Text style={[
                    styles.lotTypeButtonText,
                    value === 'Faculty' && styles.lotTypeButtonTextSelected
                ]}>Faculty</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    styles.lotTypeButton,
                    value === 'Guest' && styles.lotTypeButtonSelected
                ]}
                onPress={() => onChange('Guest')}
            >
                <Text style={[
                    styles.lotTypeButtonText,
                    value === 'Guest' && styles.lotTypeButtonTextSelected
                ]}>Guest</Text>
            </TouchableOpacity>
        </View>
    );

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
                        fetchParkingLots();
                        setDeleteModalVisible(true);
                    }}
                >
                    <Text style={styles.optionText}>Delete Parking Lot</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => {
                        fetchParkingLots();
                        setModifyModalVisible(true);
                    }}
                >
                    <Text style={styles.optionText}>Modify Parking Lot</Text>
                </TouchableOpacity>
            </View>

            {/* Adding Parking Lot Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Parking Lot</Text>
                        {/* Form Fields */}
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
                            value={formData.AvailableSpaces.toString()}
                            onChangeText={(text) => setFormData({ ...formData, AvailableSpaces: text })}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={styles.label}>Total Parking Spaces</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Total Spaces"
                            value={formData.TotalSpaces.toString()}
                            onChangeText={(text) => setFormData({ ...formData, TotalSpaces: text })}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <TimePickerField
                            label="Open Time"
                            value={formData.OpenHours}
                            onPress={() => setShowOpenTimePicker(true)}
                            showPicker={showOpenTimePicker}
                            onTimeChange={(event, selectedDate) => handleTimeChange(event, selectedDate, 'OpenHours')}
                        />

                        <TimePickerField
                            label="Close Time"
                            value={formData.CloseHours}
                            onPress={() => setShowCloseTimePicker(true)}
                            showPicker={showCloseTimePicker}
                            onTimeChange={(event, selectedDate) => handleTimeChange(event, selectedDate, 'CloseHours')}
                        />

                        <Text style={styles.label}>Lot Type</Text>
                        <LotTypeSelector
                            value={formData.LotType}
                            onChange={(value) => setFormData({ ...formData, LotType: value })}
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

            {/* Modify Parking Lot Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modifyModalVisible}
                onRequestClose={() => setModifyModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modify Parking Lot</Text>
                        <Text style={styles.label}>Select Parking Lot</Text>
                        <FlatList
                            data={parkingLots}
                            keyExtractor={(item) => item.ParkingLotID}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedParkingLot(item.ParkingLotID);
                                        setFormData({
                                            ParkingLotID: item.ParkingLotID,
                                            Latitude: item.Latitude,
                                            Longitude: item.Longitude,
                                            AvailableSpaces: item.AvailableSpaces.toString(),
                                            TotalSpaces: item.TotalSpaces.toString(),
                                            OpenHours: item.OpenHours,
                                            CloseHours: item.CloseHours,
                                            LotType: item.LotType,
                                        });
                                    }}
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

                        {/* Form Fields for Modification */}
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
                            value={formData.AvailableSpaces.toString()}
                            onChangeText={(text) => setFormData({ ...formData, AvailableSpaces: text })}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <Text style={styles.label}>Total Parking Spaces</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Total Spaces"
                            value={formData.TotalSpaces.toString()}
                            onChangeText={(text) => setFormData({ ...formData, TotalSpaces: text })}
                            keyboardType="numeric"
                            returnKeyType="done"
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />

                        <TimePickerField
                            label="Open Time"
                            value={formData.OpenHours}
                            onPress={() => setShowOpenTimePicker(true)}
                            showPicker={showOpenTimePicker}
                            onTimeChange={(event, selectedDate) => handleTimeChange(event, selectedDate, 'OpenHours')}
                        />

                        <TimePickerField
                            label="Close Time"
                            value={formData.CloseHours}
                            onPress={() => setShowCloseTimePicker(true)}
                            showPicker={showCloseTimePicker}
                            onTimeChange={(event, selectedDate) => handleTimeChange(event, selectedDate, 'CloseHours')}
                        />

                        <Text style={styles.label}>Lot Type</Text>
                        <LotTypeSelector
                            value={formData.LotType}
                            onChange={(value) => setFormData({ ...formData, LotType: value })}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModifyModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleModifySubmit}
                                disabled={isLoading}
                            >
                                <Text style={styles.modalButtonText}>Submit</Text>
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
        zIndex: 2,
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
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    lotTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    lotTypeButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 5,
        alignItems: 'center',
    },
    lotTypeButtonSelected: {
        backgroundColor: '#FF0000',
        borderColor: '#FF0000',
    },
    lotTypeButtonText: {
        color: '#000',
    },
    lotTypeButtonTextSelected: {
        color: '#fff',
    },
    timePickerButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    timePickerButtonText: {
        fontSize: 16,
        color: '#333',
    },
});

export default AdminPage;

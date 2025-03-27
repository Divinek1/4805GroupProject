import React, { useState } from 'react';
import {View, TextInput, Text, Button, FlatList, Modal, Alert, Image, ActivityIndicator, StyleSheet
} from 'react-native';
import { supabase } from './supabase';

const ReportingPage = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [reportDetails, setReportDetails] = useState('');
    const [parkingLot, setParkingLot] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [reports, setReports] = useState([
        'Report 1', 'Report 2', 'Report 3'
    ]);

    const generateReportId = () => {
        const randomId = Math.floor(Math.random() * 10000) + 1; // Generates a random number between 1 and 10,000
        return randomId.toString(); // Convert to string if needed
    };
    const handleSubmit = async () => {
        if (!reportDetails.trim() || !parkingLot.trim()) {
            Alert.alert("Error", "Please fill in all required fields.");
            return;
        }

        setIsLoading(true);

        try {
            const reportId = generateReportId();
            const { data, error } = await supabase
                .from('Reporting Table')
                .insert([
                    {
                        ReportID: reportId,
                        ReportTime: new Date().toISOString(),
                        ReportDescription: reportDetails.trim(),
                        ReportLot: parkingLot.trim()
                    }
                ]);

            if (error) throw error;

            Alert.alert("Success", "Report submitted successfully!");
            setReports([...reports, `Report ${reportId}`]);
            setReportDetails('');
            setParkingLot('');
            setModalVisible(false);
        } catch (error) {
            Alert.alert("Error", "Failed to submit report. Please try again.");
            console.error('Error submitting report:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://source.unsplash.com/random/800x200/?parking' }}
                style={styles.headerImage}
            />

            {/* Your Reports */}
            <Text style={styles.sectionTitle}>Your Reports</Text>
            <FlatList
                data={reports}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.reportItem}>
                        <Text style={styles.reportText}>{item}</Text>
                        <Button title=">" onPress={() => { /* Navigate to report */ }} />
                    </View>
                )}
                style={styles.reportList}
            />

            {/* Add Report Button */}
            <Button
                title="Add Report"
                onPress={() => setModalVisible(true)}
                color="#007AFF"
            />

            {/* Modal for New Report */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>New Report</Text>

                    {/* Report Type */}
                    <Text style={styles.inputLabel}>Parking Lot</Text>
                    <TextInput
                        placeholder="Enter Parking Lot"
                        value={parkingLot}
                        onChangeText={setParkingLot}
                        style={styles.input}
                    />

                    <Text style={styles.inputLabel}>Report Details</Text>
                    <TextInput
                        multiline
                        numberOfLines={4}
                        value={reportDetails}
                        onChangeText={setReportDetails}
                        placeholder="Enter details about your report"
                        style={styles.textArea}
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            title="Attach photos if needed"
                            onPress={() => { /* Attach photo logic */ }}
                            color="#007AFF"
                        />

                        {isLoading ? (
                            <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
                        ) : (
                            <Button
                                title="Submit"
                                onPress={handleSubmit}
                                color="#007AFF"
                            />
                        )}

                        <Button
                            title="Close"
                            onPress={() => setModalVisible(false)}
                            color="#FF3B30"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9'
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10
    },
    reportItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2
    },
    reportText: {
        fontSize: 16
    },
    reportList: {
        marginBottom: 20
    },
    modalContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333'
    },
    input: {
        height: 40,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: 'white'
    },
    textArea: {
        height: 100,
        borderColor: '#E0E0E0',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingTop: 10,
        backgroundColor: 'white',
        textAlignVertical: 'top'
    },
    buttonContainer: {
        gap: 10
    },
    loader: {
        marginVertical: 10
    }
});

export default ReportingPage;
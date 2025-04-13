import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as MailComposer from 'expo-mail-composer';

const ReportingPage = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [details, setDetails] = useState('');

    // Function to handle taking a picture
    const takePicture = async () => {
        try {
            // Request camera permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0].uri) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take picture');
        }
    };

    // Function to handle report submission
    const submitReport = async () => {
        try {
            // Check if email application is available on iphone or android.
            const isAvailable = await MailComposer.isAvailableAsync();
            if (!isAvailable) {
                Alert.alert('Error', 'Email is not available on this device');
                return;
            }

            // Validate inputs
            if (!image) {
                Alert.alert('Error', 'Please take a picture first');
                return;
            }

            // Send email
            const result = await MailComposer.composeAsync({
                recipients: ['fadedflowerfarms@gmail.com'], // Replace with actual email
                subject: 'Parking Violation Report',
                body: details || 'No additional details provided.',
                attachments: [image]
            });

            if (result.status === 'sent') {
                Alert.alert('Success', 'Report submitted successfully');
                // Reset form
                setImage(null);
                setDetails('');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to submit report');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>Submit a Report</Text>

                {/* Camera Button */}
                <TouchableOpacity
                    style={styles.cameraButton}
                    onPress={takePicture}
                >
                    <Text style={styles.buttonText}>Take Picture for Report</Text>
                </TouchableOpacity>

                {/* Display taken photo */}
                {image && (
                    <Image
                        source={{ uri: image }}
                        style={styles.previewImage}
                    />
                )}

                {/* Details Input */}
                <Text style={styles.label}>Add Details to Report</Text>
                <TextInput
                    style={styles.input}
                    multiline
                    numberOfLines={4}
                    placeholder="Enter report details here..."
                    value={details}
                    onChangeText={setDetails}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    onSubmitEditing={() => {
                        Keyboard.dismiss();
                    }}
                />

                {/* Submit Button */}
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={submitReport}
                >
                    <Text style={styles.buttonText}>Submit Report</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        position: 'absolute',
        top: 75,
        left: 10,
        zIndex: 1,
    },
    backButtonText: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    cameraButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    previewImage: {
        width: 300,
        height: 225,
        borderRadius: 10,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        width: '100%',
        height: 120,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#34C759',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
});

export default ReportingPage;

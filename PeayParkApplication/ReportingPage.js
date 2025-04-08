import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ReportingPage = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()} // Use goBack() to navigate to the previous screen
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <Text style={styles.text}>Welcome to the Reporting Page</Text>
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
        justifyContent: 'flex-start', // Align to the left
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        position: 'absolute',
        top: 50,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default ReportingPage;
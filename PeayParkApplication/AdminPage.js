/*
This is the Administration Page. It includes a graphical user interface for the user (specifically those designated as
administrators).
 */
import React from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet } from 'react-native';

const AdminPage = () => {
    // Sample data for the list
    const data = [
        { id: '1', title: 'Title 1' },
        { id: '2', title: 'Title 2' },
        { id: '3', title: 'Title 3' },
        { id: '4', title: 'Title 4' },
        { id: '5', title: 'Title 5' },
    ];

    return (
        <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Admin</Text>
            </View>

            {/* Search Input */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search for users, lots, etc"
                placeholderTextColor="#888"
            />

            {/* Image Section */}
            <Image
                source={{ uri: 'https://example.com/your-image-url.jpg' }} // Replace with actual image URL
                style={styles.mapImage}
            />

            {/* List Section */}
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemText}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 12,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        borderColor: 'lightgrey',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    mapImage: {
        height: 200,
        width: '100%',
        borderRadius: 8,
        marginBottom: 10,
    },
    item: {
        padding: 15,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    itemText: {
        fontSize: 18,
    },
});

export default AdminPage;

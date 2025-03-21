
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const MapPage = () => { // TADA! DEFAULT MAP
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 37.78825, // Example latitude
                    longitude: -122.4324, // Example longitude
                    latitudeDelta: 0.0922, // Zoom level
                    longitudeDelta: 0.0421, // Zoom level
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject, // This makes the map take up the whole screen
    },
});

export default MapPage;
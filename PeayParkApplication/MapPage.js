import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const MapPage = () => { // TADA! DEFAULT MAP
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 36.532771,
                    longitude: -87.349341,
                    latitudeDelta: 0.1, // Zoom level
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
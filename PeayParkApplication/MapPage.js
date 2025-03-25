import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const MapPage = () => {
    const [region, setRegion] = useState({
        latitude: 36.532771,
        longitude: -87.349341,
        latitudeDelta: 0.1,
        longitudeDelta: 0.0421,
    });
    const [userLocation, setUser_Location] = useState(null); // Corrected here

    useEffect(() => {
        const requestLocationPermission = async () => {
            const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (result === RESULTS.GRANTED) {
                getUser_Location(); // Corrected here
            } else {
                Alert.alert('Location permission denied');
            }
        };

        requestLocationPermission();
    }, []);

    const getUser_Location = () => { // Corrected here
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUser_Location({ latitude, longitude }); // Corrected here
                setRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.0421,
                });
            },
            (error) => {
                Alert.alert('Error', error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                region={region}
            >
                {userLocation && (
                    <Marker
                        coordinate={userLocation}
                        title="You are here"
                        pinColor="blue" // Set the marker color to blue
                    />
                )}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MapPage;
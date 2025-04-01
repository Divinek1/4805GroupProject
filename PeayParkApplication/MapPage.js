/*
This is the MapPage, which is the center of the application. It includes a map interface that is used to show users
parking lots available and/or full near the user's location (calculated by longitude and latitude).
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

const MapPage = ({ navigation }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [parkingLots, setParkingLots] = useState([]);
    const [initialRegionSet, setInitialRegionSet] = useState(false);

    useEffect(() => {
        const getLocation = async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    console.log("Permission to access location was denied");
                    return;
                }

                await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        distanceInterval: 1,
                        timeInterval: 2000,
                    },
                    (location) => {
                        setCurrentLocation(location.coords);
                        // Only center the map on initial load
                        if (mapRef && !initialRegionSet) {
                            mapRef.animateToRegion({
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }, 1000);
                            setInitialRegionSet(true);
                        }
                    }
                );
            } catch (error) {
                console.error("Error getting location: ", error);
            }
        };
        getLocation();
    }, [mapRef]);

    useEffect(() => {
        const fetchParkingLots = async () => {
            const { data, error } = await supabase
                .from('Parking Lot Table')
                .select('*');

            if (error) {
                console.error("Error fetching parking lots: ", error);
            } else {
                setParkingLots(data);
            }
        };
        fetchParkingLots();
    }, []);

    const handleRecenter = () => {
        if (mapRef && currentLocation) {
            mapRef.animateToRegion({
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }, 1000);
        }
    };

    return (
        <View style={styles.container}>
            {currentLocation && (
                <MapView
                    style={styles.map}
                    ref={(ref) => setMapRef(ref)}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude,
                        }}
                        title="Your Current Location"
                    />
                    {parkingLots.map((lot) => (
                        <Marker
                            key={lot.ParkingLotID}
                            coordinate={{
                                latitude: parseFloat(lot.Latitude),
                                longitude: parseFloat(lot.Longitude),
                            }}
                            title={lot.ParkingLotID}
                            description={`Available Spaces: ${lot.AvailableSpaces}`}
                        />
                    ))}
                </MapView>
            )}
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("SettingsPage")}>
                <Ionicons name="settings" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                <Ionicons name="locate" size={24} color="blue" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    map: {
        width: "100%",
        height: "100%",
    },
    settingsButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        elevation: 5,
    },
    recenterButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
});

export default MapPage;
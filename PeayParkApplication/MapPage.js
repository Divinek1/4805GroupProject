import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import {supabase} from './supabase';

const MapPage = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [parkingLots, setParkingLots] = useState([]);

    useEffect(() => {
        const getLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                console.log("Permission to access location was denied");
                return;
            }

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    distanceInterval: 1,
                    timeInterval: 2000,
                },
                (location) => {
                    setCurrentLocation(location.coords);
                    if (mapRef) {
                        mapRef.animateToRegion({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }, 1000);
                    }
                }
            );
        };
        getLocation();
    }, [mapRef]);

    useEffect(() => {
        const fetchParkingLots = async () => {
            const { data, error } = await supabase
                .from('Parking Lot Table') // Assuming your table is named 'parking_lots'
                .select('*');

            if (error) {
                console.error("Error fetching parking lots: ", error);
            } else {
                setParkingLots(data);
            }
        };
        fetchParkingLots();
    }, []);

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
});

export default MapPage;
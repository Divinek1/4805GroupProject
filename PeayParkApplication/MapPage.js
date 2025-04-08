/*
This is the MapPage, which is the center of the application. It includes a map interface that is used to show users
parking lots available and/or full near the user's location (calculated by longitude and latitude).
 */
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from "expo-location";
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';
import { takeParkingSpace, leaveParkingSpace } from './parkingFunctions';

const MapPage = ({ navigation }) => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [parkingLots, setParkingLots] = useState([]);
    const [initialRegionSet, setInitialRegionSet] = useState(false);
    const [nearbyParkingLot, setNearbyParkingLot] = useState(null);
    const [showParkButton, setShowParkButton] = useState(false);
    const [isParked, setIsParked] = useState(false);
    const [mapType, setMapType] = useState('standard'); // Add state for map type
    const [filters, setFilters] = useState({
        selectAll: true,
        faculty: true,
        student: true,
        guest: true
    });
    const [filteredParkingLots, setFilteredParkingLots] = useState([]);

    // Helper function to calculate distance between two coordinates in feet
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 20902231; // Earth's radius in feet
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Function to check if user is near any parking lot
    const checkNearbyParkingLots = (userLocation) => {
        for (const lot of parkingLots) {
            const distance = calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                parseFloat(lot.Latitude),
                parseFloat(lot.Longitude)
            );

            if (distance <= 100) { // Within 100 feet
                if (!nearbyParkingLot) {
                    setNearbyParkingLot(lot);
                    setShowParkButton(true);
                }
                return;
            }
        }
        // If we get here, user is not near any lot
        if (nearbyParkingLot) {
            setNearbyParkingLot(null);
            setShowParkButton(false);
        }
    };
    // This handles the case of whether a user is "in" or "out" of a parking space. (Added another confirmation box)
    const handlePark = () => {
        if (nearbyParkingLot) {
            if (!isParked) {
                Alert.alert(
                    'Confirm Parking',
                    `Looks like you are currently parked in ${nearbyParkingLot.ParkingLotID}. Is that correct?`,
                    [
                        {
                            text: 'No',
                            style: 'cancel'
                        },
                        {
                            text: 'Yes',
                            onPress: () => {
                                takeParkingSpace(nearbyParkingLot.ParkingLotID);
                                setIsParked(true);
                            }
                        }
                    ]
                );
            } else {
                leaveParkingSpace(nearbyParkingLot.ParkingLotID);
                setIsParked(false);
            }
        }
    };

    // Helps with Main Map Functions and refreshes the users location every 2 seconds
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
                        checkNearbyParkingLots(location.coords);
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
    }, [mapRef, parkingLots]);

    // This helps to manage the filter
    const handleFilterChange = (filterName) => {
        let newFilters = { ...filters };

        if (filterName === 'selectAll') {
            const newValue = !filters.selectAll;
            newFilters = {
                selectAll: newValue,
                faculty: newValue,
                student: newValue,
                guest: newValue
            };
        } else {
            newFilters[filterName] = !filters[filterName];
            newFilters.selectAll = newFilters.faculty && newFilters.student && newFilters.guest;
        }

        setFilters(newFilters);
    };

    // Function to toggle map type
    const toggleMapType = () => {
        setMapType(prevType => prevType === 'standard' ? 'satellite' : 'standard');
    };

    // This will trigger an error if the SupaBase table is missing or if the device simply can't make a connection. (Probably Expo Error)
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

    useEffect(() => {
        const filtered = parkingLots.filter(lot => {
            if (lot.LotType === 'Faculty' && filters.faculty) return true;
            if (lot.LotType === 'Student' && filters.student) return true;
            return lot.LotType === 'Guest' && filters.guest;

        });
        setFilteredParkingLots(filtered);
    }, [filters, parkingLots]);

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
                    mapType={mapType}
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
                    {filteredParkingLots.map((lot) => (
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
            <TouchableOpacity style={styles.mapTypeButton} onPress={toggleMapType}>
                <Ionicons
                    name={mapType === 'standard' ? 'map' : 'map-outline'}
                    size={24}
                    color="blue"
                />
            </TouchableOpacity>
            {showParkButton && (
                <TouchableOpacity
                    style={[
                        styles.parkButton,
                        isParked && styles.unparkButton
                    ]}
                    onPress={handlePark}
                >
                    <Text style={styles.parkButtonText}>
                        {isParked ? 'UNPARK' : 'PARK'}
                    </Text>
                </TouchableOpacity>
            )}
            <View style={styles.filterContainer}>
                <ScrollView style={styles.filterBox}>
                    <TouchableOpacity
                        style={styles.filterOption}
                        onPress={() => handleFilterChange('selectAll')}
                    >
                        <View style={[styles.checkbox, filters.selectAll && styles.checked]}>
                            {filters.selectAll && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.filterText}>Select All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterOption}
                        onPress={() => handleFilterChange('faculty')}
                    >
                        <View style={[styles.checkbox, filters.faculty && styles.checked]}>
                            {filters.faculty && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.filterText}>Faculty</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterOption}
                        onPress={() => handleFilterChange('student')}
                    >
                        <View style={[styles.checkbox, filters.student && styles.checked]}>
                            {filters.student && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.filterText}>Student</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.filterOption}
                        onPress={() => handleFilterChange('guest')}
                    >
                        <View style={[styles.checkbox, filters.guest && styles.checked]}>
                            {filters.guest && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.filterText}>Guest</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};


// The styling takes so long. >:( -CD
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
    },
    mapTypeButton: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    parkButton: {
        position: 'absolute',
        right: 20,
        top: 40,
        backgroundColor: 'red',
        borderRadius: 10,
        padding: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    unparkButton: {
        backgroundColor: 'blue',
    },
    parkButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    filterContainer: {
        position: 'absolute',
        right: 20,
        top: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    filterBox: {
        maxHeight: 200,
    },
    filterOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#666',
        borderRadius: 4,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checked: {
        backgroundColor: '#666',
    },
    checkmark: {
        color: 'white',
        fontSize: 14,
    },
    filterText: {
        fontSize: 16,
        color: '#333',
    }
});

export default MapPage;

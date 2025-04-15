import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from "expo-location";
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';
import { takeParkingSpace, leaveParkingSpace } from './parkingFunctions';
import { useAuth } from './AuthContext';

const MapPage = ({ navigation }) => {
    const { user } = useAuth();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapRef, setMapRef] = useState(null);
    const [parkingLots, setParkingLots] = useState([]);
    const [initialRegionSet, setInitialRegionSet] = useState(false);
    const [nearbyParkingLot, setNearbyParkingLot] = useState(null);
    const [showParkButton, setShowParkButton] = useState(false);
    const [isParked, setIsParked] = useState(false);
    const [mapType, setMapType] = useState('standard');
    const [currentUser, setCurrentUser] = useState(null);
    const [filters, setFilters] = useState({
        selectAll: true,
        faculty: true,
        student: true,
        guest: true
    });
    const [filteredParkingLots, setFilteredParkingLots] = useState([]);

    // Check authentication on component mount
    useEffect(() => {
        if (!user) {
            navigation.replace('LoginPage');
        } else {
            setCurrentUser(user);
        }
    }, [user]);

    // Fetch current user and their parking status on component mount
    useEffect(() => {
        const fetchUserAndParkingStatus = async () => {
            try {
                if (!user) return;

                // Fetch user's parking status from SupaBase Account Sample table
                const { data, error } = await supabase
                    .from('SupaBase Account Sample')
                    .select('ParkedLocation')
                    .eq('UserID', user.id)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching user data:", error.message);
                    return;
                }

                // If user has a ParkedLocation, update the UI
                if (data && data.ParkedLocation) {
                    setIsParked(true);
                    const parkedLot = parkingLots.find(lot => lot.ParkingLotID === data.ParkedLocation);
                    if (parkedLot) {
                        setNearbyParkingLot(parkedLot);
                        setShowParkButton(true);
                    }
                }
            } catch (error) {
                console.error("Error in fetchUserAndParkingStatus:", error.message);
            }
        };
        fetchUserAndParkingStatus();
    }, [parkingLots, user]);

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

            if (distance <= 300) { // Within 300 feet
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

    // Enhanced handlePark function with Supabase integration
    const handlePark = async () => {
        if (!user) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

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
                            onPress: async () => {
                                try {
                                    // Update SupaBase Account Sample table
                                    const { error } = await supabase
                                        .from('SupaBase Account Sample')
                                        .update({ ParkedLocation: nearbyParkingLot.ParkingLotID })
                                        .eq('UserID', user.id);

                                    if (error) throw error;

                                    await takeParkingSpace(nearbyParkingLot.ParkingLotID);
                                    setIsParked(true);
                                } catch (error) {
                                    console.error("Error updating parking status:", error.message);
                                    Alert.alert("Error", "Failed to update parking status");
                                }
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'Confirm Unparking',
                    'Are you sure you want to unpark?',
                    [
                        {
                            text: 'No',
                            style: 'cancel'
                        },
                        {
                            text: 'Yes',
                            onPress: async () => {
                                try {
                                    // Update SupaBase Account Sample table
                                    const { error } = await supabase
                                        .from('SupaBase Account Sample')
                                        .update({ ParkedLocation: null })
                                        .eq('UserID', user.id);

                                    if (error) throw error;

                                    await leaveParkingSpace(nearbyParkingLot.ParkingLotID);
                                    setIsParked(false);
                                } catch (error) {
                                    console.error("Error updating unparking status:", error.message);
                                    Alert.alert("Error", "Failed to update unparking status");
                                }
                            }
                        }
                    ]
                );
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

    // Enhanced parking lots fetch with error handling and logging
    useEffect(() => {
        const fetchParkingLots = async () => {
            try {
                const { data, error } = await supabase
                    .from('Parking Lot Table')
                    .select('*');

                if (error) throw error;

                if (data) {
                    console.log(`Fetched ${data.length} parking lots`);
                    setParkingLots(data);
                } else {
                    console.log('No parking lots data received');
                }
            } catch (error) {
                console.error("Error fetching parking lots: ", error);
                Alert.alert("Error", "Failed to fetch parking lots data");
            }
        };
        fetchParkingLots();
    }, []);

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

    // Parking Lot Classification Filter (Faculty, Guest, Student)
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
                    >
                        <View style={styles.markerContainer}>
                            <Ionicons name="car" size={30} color="red" />
                        </View>
                    </Marker>
                    {filteredParkingLots.map((lot) => (
                        <Marker
                            key={lot.ParkingLotID}
                            coordinate={{
                                latitude: parseFloat(lot.Latitude),
                                longitude: parseFloat(lot.Longitude),
                            }}
                        >
                            <View style={styles.markerContainer}>
                                <Ionicons name="location" size={30} color="black" />
                            </View>
                            <Callout>
                                <View style={styles.calloutContainer}>
                                    <Text style={styles.calloutTitle}>{lot.ParkingLotID}</Text>
                                    <Text style={styles.calloutText}>{lot.LotType} Parking</Text>
                                    <Text style={styles.calloutText}>Available Spaces: {lot.AvailableSpaces}</Text>
                                    <Text style={styles.calloutText}>Hours of Operation: {lot.OpenHours} - {lot.CloseHours}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
            )}
            <TouchableOpacity style={styles.reportingButton} onPress={() => navigation.navigate("ReportingPage")}>
                <Ionicons name="warning" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("SettingsPage")}>
                <Ionicons name="settings" size={30} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
                <Ionicons name="locate" size={24} color="#FF0000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapTypeButton} onPress={toggleMapType}>
                <Ionicons
                    name={mapType === 'standard' ? 'map' : 'map-outline'}
                    size={24}
                    color="#FF0000"
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
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    reportingButton: {
        position: 'absolute',
        top: 40,
        left: 70,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 10,
        elevation: 5,
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
    logoutButton: {
        position: 'absolute',
        top: 40,
        left: 120,
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
        color: '#FF0000',
        fontSize: 14,
    },
    filterText: {
        fontSize: 16,
        color: '#333',
    },
    calloutContainer: {
        minWidth: 200,
        padding: 10,
    },
    calloutTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    calloutText: {
        fontSize: 14,
        marginBottom: 3,
    }
});

export default MapPage;

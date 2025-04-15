// This is parkingFunction.js where we will store methods methods for SupaBase for cleanliness.
import {supabase} from './supabase';

// How to call and test this function ->>>>>>>> onPress={() => takeParkingSpace('Foy_updated')}
// This functions works with SupaBase to decrement the parking space of the chosen parking lot from the table in SupaBase.
export async function takeParkingSpace(parkingLotID) {
    // Getting the current number of Available Parking Spots
    const {data: currentData, error: fetchError} = await supabase
        .from('Parking Lot Table')
        .select('AvailableSpaces')
        .eq('ParkingLotID', parkingLotID)
        .single(); // Retrieve only one row

    if (fetchError) {
        console.error('Error fetching current AvailableSpaces:', fetchError);
        return; // Exit the function if there's an error
    }

    if (currentData && currentData.AvailableSpaces > 0) {
        // Decrement AvailableSpaces if there are spaces available
        const newAvailableSpaces = currentData.AvailableSpaces - 1;

        const {data, error} = await supabase
            .from('Parking Lot Table')
            .update({AvailableSpaces: newAvailableSpaces}) // Update with new value
            .eq('ParkingLotID', parkingLotID) // Filter to ensure we update only the desired row
            .select();

        if (error) {
            console.error('Error updating AvailableSpaces:', error);
        } else {
            console.log('Available spaces were decremented once!', data);
        }
    } else {
        console.log('You cannot park here, there are no spots available', parkingLotID);
    }
}

/*
This is a function that works with SupaBase to increment the number of parking spaces in a specific parking lot, given
the parkingLotID. It communicates with SupaBase to update the table.
*/
export async function leaveParkingSpace(parkingLotID) {
    // Getting the current number of Available Parking Spots and Total Spaces
    const {data: currentData, error: fetchError} = await supabase
        .from('Parking Lot Table')
        .select('AvailableSpaces, TotalSpaces') // Fetch both AvailableSpaces and TotalSpaces
        .eq('ParkingLotID', parkingLotID)
        .single(); // Retrieve only one row

    if (fetchError) {
        console.error('Error fetching current AvailableSpaces and TotalSpaces:', fetchError);
        return; // Exit the function if there's an error
    }

    if (currentData) {
        const {AvailableSpaces, TotalSpaces} = currentData;
        // Validate if we can increment AvailableSpaces
        if (AvailableSpaces < TotalSpaces) {
            // Increment AvailableSpaces
            const newAvailableSpaces = AvailableSpaces + 1;

            const {data, error} = await supabase
                .from('Parking Lot Table')
                .update({AvailableSpaces: newAvailableSpaces}) // Update with new value
                .eq('ParkingLotID', parkingLotID) // Filter to ensure we update only the desired row
                .select();

            if (error) {
                console.error('Error: Unable to update AvailableSpaces.', error);
            } else {
                console.log('Available spaces were incremented once!', data);
            }
        } else {
            console.log('Error: There are already max spaces available', parkingLotID);
        }
    } else {
        console.log('This parkingLotID does not exist.', parkingLotID);
    }
}
const Pet = require('../model/pet');

async function getAllPetBasedOnLoc(petId) {
    try {
        const pet = await Pet.findById(petId);
        if (!pet) {
            let errObj = {
                code: 404,
                message: "Pet not found"
            };
            return [errObj, null];
        }

        // Get the location of the specified pet
        const loc = pet.location.coordinates; 

        // Find all pets within a certain distance (e.g., 5000 meters) from the specified pet's location
        const nearbyPets = await Pet.find({
            location: {
                $near: {//sorts the documents based on location from a specified location given in $geometry
                    $geometry: {
                        type: "Point",
                        coordinates: loc 
                    },
                    $maxDistance: 5000 // Specify the maximum distance in meters
                }
            }
        });

        return [null, nearbyPets]; // Return the found pets

    } catch (err) {
        console.log(err);
        let errObj = {
            code: 500,
            message: "Internal server error"
        };
        return [errObj, null];
    }
}

module.exports = { getAllPetBasedOnLoc };
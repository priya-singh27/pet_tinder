const {
    successResponse,
    serverErrorResponse,
    badRequestResponse,
    notFoundResponse,
    handle304
} = require('../utils/response');
const Pet = require('../model/pet');
const joi_schema = require('../joi/pet/index');
const { findUserById } = require('../repository/user.repository');
const { getAllPetBasedOnLoc } = require('../repository/pet.repository');

const getPetBasedOnLoc = async (req, res) => {
    try {
        const ownerId = req.user._id;
        const petId = req.params.petId;

        const [err, pets] = await getAllPetBasedOnLoc(petId);

        if (err) {
            if (err.code === 404){
                return notFoundResponse(res, "No pet found");
            }
            if (err.code === 500) {
                return serverErrorResponse(res, "Internal server error.");
            }
        }

        return successResponse(res,pets,'All nearby pets are being displayed')

    } catch (err) {
        console.log(err);
        return serverErrorResponse(res,"Internal server error.");
    }
}

const registerPet = async (req,res) => {
    try {
        const ownerId = req.user._id;
        const [err, owner] = await findUserById(ownerId);
        
        if (err) {
            if (err.code === 404){
                return notFoundResponse(res, "Owner not found");
            }
            if (err.code === 500) {
                return serverErrorResponse(res, "Internal server error.");
            }
        }

        const { error } = joi_schema.registerPet.validate(req.body);

        if (error) {
            return badRequestResponse(res,"Invalid data entered");
        }
        
        let pet = new Pet({
            ownerId: ownerId,
            petName: req.body.petName,
            petType: req.body.petType,
            profilePicture: req.body.profilePicture,
            breed:req.body.breed,
            age: req.body.age,
            location: req.body.location,
            gender: req.body.gender
        });
        
        await pet.save();

        //add the petId to the owner's pets array
        owner.pets.push(pet._id);
        await owner.save();

        return successResponse(res, pet, 'Pet added successfully');
    } catch (err) {
        console.log(err);
        return serverErrorResponse(res,"Internal server error.");
    }
}

module.exports = {
    registerPet,
    getPetBasedOnLoc
}
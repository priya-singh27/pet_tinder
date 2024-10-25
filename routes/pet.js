const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { registerPet, getPetBasedOnLoc } = require('../controller/pet.controller');


router.get('/feed/:petId', authMiddleware, getPetBasedOnLoc);
router.post('/register-pet', authMiddleware,registerPet);



module.exports = router;
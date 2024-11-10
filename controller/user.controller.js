const {
    successResponse,
    serverErrorResponse,
    badRequestResponse,
    notFoundResponse,
    handle304
} = require('../utils/response');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const joi_schema = require('../joi/user/index');
const { findUserByEmail, findUserById } = require('../repository/user.repository');
const { generateOtp, sendEmail, verifyOTP } = require('../utils/email');

const resetPassword = async (req, res) => {//If user wants to change password
    try {
        const { error } = joi_schema.changePassword.validate(req.body);
        if (error) {
            return badRequestResponse(res, 'Invalid password entered');
        }

        const userId = req.user._id;

        //Find user by id
        const [err, user] = await findUserById(userId);
        if (err) {
            return notFoundResponse(res, 'User not found');
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        
        // Save the updated user object
        await user.save();

        return successResponse(res,'Password reset successfully');

    } catch (err) {
        console.log(err);
        return serverErrorResponse(res, 'Something went wrong');
    }
};

const login = async (req, res) => {//You enter email and password and it finds user with the given email if not exist you'll get badRequest as a response, if its correct entered password will be matched with stored password and if it is correct congrats! you are logged in otherwise you will get badRequest as a response
    try { 
        
        const { error } = joi_schema.login.validate(req.body);
        if (error) {
            return badRequestResponse(res,"Invalid data entered");
        }
    
        let [err, user] = await findUserByEmail(req.body.email);

        if (err) {
            if (err.code == 404) {
                return notFoundResponse(res, "User not found");
            }
                
            if (err.code == 500) {
                return serverErrorResponse(res, "Internal server error.");
            }
        }

        if (!user.isOtpVerified) return badRequestResponse(res, "Email not verified");
    
        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            return badRequestResponse(res, 'Invalid Email or Password');
        }
    
        const token = user.generateAuthToken();
        await user.save();
        res.setHeader('x-auth-token', token);
        return successResponse(res, null, "Successfully logged in");
        
    } catch (err) {
        console.log(err);
        return serverErrorResponse(res, "Something went wrong");
    }
    
}

const verifyOtp = async (req, res) => {//Verifies the otp entered with otp sent 
    try {
        const { error } = joi_schema.verifyOtp.validate(req.body);//only otp
        if (error) {
            return badRequestResponse(res,"Invalid otp entered");
        }
        
        const [err, user] = await findUserByEmail(req.body.email);

        if (err) {
            if (err.code === 404){
                return notFoundResponse(res, "User not found");
            }
            if (err.code === 500) {
                return serverErrorResponse(res, "Internal server error.");
            }
        }
        
        const isVerified = await verifyOTP(user.otp, req.body.otp);
        if (isVerified === true) {
            user.isOtpVerified = true;
            await user.save();
            return successResponse(res,null,"Otp verified successfully");
        } else if(isVerified === false) {
            return badRequestResponse(res,"Either email or otp entered is incorrect");
        }
        
    } catch (err) {
        console.log(err);
        return serverErrorResponse(res,"Internal server error.");
    }
}

const signup = async (req, res) => {//sends otp on given emailId and saves user's data in DB
 
    try {
        //search for user in DB
        const [err,user] = await findUserByEmail(req.body.email);
        
        if (err) {//If no user
            if (err.code == 404) {//If user not found then create a user
                try {
                    const {error} = joi_schema.signup.validate(req.body);

                    if (error) {
                        return badRequestResponse(res,"Invalid data entered");
                    }
                    const otp = await generateOtp();
                    await sendEmail(req.body.email, otp);

                    let user = new User({
                        username: req.body.firstName,
                        email: req.body.email,
                        password: req.body.password,
                        otp:otp
                    });
                    const salt = await bcrypt.genSalt(12);
                    user.password = await bcrypt.hash(user.password, salt);
                    user = await user.save();
                    return successResponse(res,user,"User saved in database");
                } catch (err) {//If there is some error while creating the user do this 
                    console.log(err);
                    return serverErrorResponse(res,"Internal server error");
                }
            } else {//If error code is other than 404
                return serverErrorResponse(res,"Internal Server Error: unable to generate OTP");
            }
            
        } else {//If no error => user exist with the given data
            return badRequestResponse(res,"User already registered");
        }
    } catch (err) {
        console.log(err);
        return serverErrorResponse(res,"Internal server error.");
    }
}

module.exports = {
    signup,
    verifyOtp,
    login,
    resetPassword
}
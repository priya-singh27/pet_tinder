require('dotenv').config();
const User = require('../model/user');
const nodemailer = require('nodemailer');
const userEmail = process.env.USER;
const pass = process.env.PASS;


async function generateOtp() {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++){
        OTP = OTP + digits[Math.floor(Math.random() * 10)] ;
    }
    const existingUser = await User.findOne({ otp: OTP });
    if (existingUser) {
        return generateOtp();
    }

    return OTP;
}

async function sendEmail(email,otp) {
    try {
        // const otp = OTP;
        const transporter = nodemailer.createTransport({
            name:"nodemailer",
            service: 'gmail',
            auth: {
                user:userEmail,
                pass:pass
            },
            port: 3000,
            host:'smtp.gmail.com'
        });

        const mailOptions = {
            from: userEmail,
            to: email,
            subject: 'Your One-Time Passsword (OTP)',
            text:`Your OTP is: ${otp}`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!', info.response);
        
    }
    catch (err) {
        console.log('Error sending email', err);
        throw err;
    }
    
};

const verifyOTP = async (generatedOtp,enteredOtp) => {
    try {
         
        // Check if the email and OTP are provided
        if (!generatedOtp || !enteredOtp) {
            return false;
        }

        if (enteredOtp === generatedOtp) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
}


module.exports = {
    generateOtp,
    sendEmail,
    verifyOTP
}

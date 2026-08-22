import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.ADMIN_PASSWORD
    }
})
const sendOtp = async(email,otp)=>{
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to:email,
        subject:'OTP CODE',
        text:`Your otp code for registering to notes app is ${otp}. Do not share it with anyone`
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log("Otp send successfully")
    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
}

export {sendOtp};
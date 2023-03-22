const nodemailer = require('nodemailer')
const sendEmail = async(mailData)=>{
    const {subject,receiverMail} = mailData
    // console.log(process.env.ADMIN1_EMAIL,
    //     process.env.ADMIN1_PASS )
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 25,
        secure: false,
        // requireTLS: true,
        auth: {
          user: process.env.ADMIN1_EMAIL,
          pass: process.env.APP_PASS,
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    
    var mailOptions;
    if(mailData.html){
        mailOptions = {
            from:process.env.ADMIN1_EMAIL,
            to:receiverMail,
            subject:subject,
            html:mailData.html
        }
    }else{
        mailOptions = {
            from:process.env.ADMIN1_EMAIL,
            to:receiverMail,
            subject:subject,
            text:mailData.body
        }
    }
    

    
    try{
        await transporter.sendMail(mailOptions);
        console.log('Mail sent')
    }catch(err){
        console.log(err)
    }
}
module.exports = sendEmail
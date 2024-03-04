const nodemailer = require("nodemailer")
const asyncHandler = require("express-async-handler")

const sendEmail = asyncHandler(async(data,req,res)=>{
   
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_HOST_USER,
          pass: process.env.EMAIL_HOST_PASSWORD,
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Fred Foo 👻" <christabelericson31@gmail.com.com>',
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
    }

})

module.exports ={sendEmail}
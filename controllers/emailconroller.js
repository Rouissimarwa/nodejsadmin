const nodemailer = require("nodemailer");
const asyncHandler=require("express-async-handler");
const sendEmail=asyncHandler(async(data,req,res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        auth: {
          user: "testtest@gmail.com",
          pass: "11448148",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Maddison Foo Koch 👻" <abc@gmail.com.com>', // sender address
          to: "bar@example.com, baz@example.com", // list of receivers
          subject: "data.subject", // Subject line
          text: "data.text", // plain text body
          html: "data.htm", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
      }
      
      main().catch(console.error);
});
module.exports = sendEmail;

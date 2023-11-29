"use strict";
const nodemailer = require("nodemailer");

const supportMailerAuth = nodemailer.createTransport({
    host: "mail.hosting.reg.ru",
    port: 465,
    secure: true,
    auth: {
        user: "support@unijs.ru",
        pass: "E5wGuq8mV3kq9MSY",
    },
});

module.exports = this.supportMailer = new class {
    SendMail = async (to, subject, content, html, callback) => {
        try{
            const info = await supportMailerAuth.sendMail({
                from: '"UniJS users support" <support@unijs.ru>', // sender address
                to: `${to}`, // list of receivers
                subject: `${subject}`, // Subject line
                text: `${content}`, // plain text body
                html: `${html}`, // html body
            });
            console.log("Message sent: %s", info.messageId);
            callback(true)
        }catch (e) {
            console.log(e)
            callback(false)
        }
    }
}
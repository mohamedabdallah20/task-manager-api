const sgMail = require('@sendgrid/mail')
const apiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(apiKey)

// sgMail.send({
//     to:'mohammed.a.elsaied@gmail.com',
//     from:"mohammed.a.elsaied@gmail.com",
//     subject:"shala7 game",
//     text:"hello hammo , i hope this mail finds you well , let's play shala7",
// })


const sendWelcomeEmail = (email, name) => {

    sgMail.send({
        to: email,
        from: "mohammed.a.elsaied@gmail.com",
        subject: 'thanks to sign up',
        text: `welcome ${name} to the app`,
    })

}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "mohammed.a.elsaied@gmail.com",
        subject: 'cancelation confirmed',
        text: `hello ${name}, let we know why you delete your account`,
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
}

const nodemailer = require('nodemailer');

async function createTestAccount() {
    try {
        let testAccount = await nodemailer.createTestAccount();
        console.log('User:', testAccount.user);
        console.log('Pass:', testAccount.pass);
    } catch (err) {
        console.error(err);
    }
}

createTestAccount();

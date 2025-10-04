// mailer neutralized. The password-reset feature was removed; if you need emailing
// re-enable a mailer with nodemailer or configure real SMTP.
module.exports = {
  sendResetEmail: async () => { throw new Error('mailer disabled in this branch'); }
};

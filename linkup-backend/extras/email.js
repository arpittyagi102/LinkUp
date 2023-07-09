const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SG_API_KEY_SECRET);  // Your sendgrid api secret key

const forget_password_email = (to_email, user_id) =>{
    const url = `http://localhost/3000/auth/change_password/${user_id}` // Change this localhost to your actual route while deploying
    const msg = {
        to : to_email,
        from : 'utkarsh@onepercentstartups.com', // Email used in your sendgrid
        subject : `You have forget your password`,
        html : `<strong> Click on this to change your password</strong> <a href="${url}">this</a>`,

    }
    sgMail
    .send(msg)
    .then(() => {
        return 
    }, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      });

    const message = "Check your email"
    return message;
}

module.exports = {forget_password_email}
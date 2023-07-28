const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
require("dotenv").config();

const signup = async (req, res, db) => {
  const { fname, lname, email, password } = req.body;
  if (!fname || !lname || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name: fname + " " + lname,
      email: email,
      email_verified: false,
      hashedPassword: hashedPassword,
      picture: null,
      friends: [],
    };

    const allusers = db.collection("users");
    const user = await allusers.findOne({ email: newUser.email });

    if (user && user.email && user.hashedPassword) {
      res
        .status(409)
        .json({ message: "User with the provided email already exists" });
      return;
    }

    if (user && user.email && !user.hashedPassword) {
      await allusers.updateOne(
        { email: newUser.email },
        { $set: { hashedPassword: hashedPassword } }
      );
      return res
        .status(200)
        .json({ message: "User successfully created", ...newUser });
    }

    await allusers.insertOne(newUser);
    res.status(200).json({ message: "User successfully created", ...newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to insert user into the database" });
  }
};

const googleLogin = async (req, res, db) => {
  try {
    const allusers = db.collection("users");
    const user = await allusers.findOne({ email: req.body.email });
    if (user && user.email) {
      await allusers.updateOne(
        { email: req.body.email },
        {
          $set: {
            picture: req.body.picture,
            email_verified: req.body.email_verified,
          },
        }
      );
      res
        .status(200)
        .json({ message: "User successfully created", ...req.body });
      return;
    }
    await allusers.insertOne(req.body);
    res.status(200).json({ message: "User successfully created", ...req.body });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to insert user into the database", ...err });
  }
};

const login = async (req, res, db) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ message: "Data is not found", data: req.body });
    return;
  }

  const allusers = db.collection("users");
  const user = await allusers.findOne({ email: email });

  if (!user) {
    res.status(404).json({ message: "Could not find a user with this email" });
    return;
  } else {
    try {
      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (isPasswordValid) {
        const payload = {
          name: user.name,
          email: user.email,
          picture: user.picture,
          friends: user.friends,
        };
        res.status(200).json({ message: "Successfully logged in", payload });
      } else {
        res.status(401).json({ message: "Wrong password" });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
    }
  }
};

const sendResetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.LINKUP_EMAIL,
        pass: process.env.LINKUP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.LINKUP_EMAIL,
      to: email,
      subject: "Reset Linkup Password",
      html:
        "<p> Hello " +
        name +
        ', <a href="http://localhost:3001/auth/reset-password?token=' + //Add related URL here
        token +
        '">Reset your password </a> here',
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent: ", info.response);
      }
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
};

const forgotPassword = async (req, res, db) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email field is required" });
  }
  try {
    const allusers = db.collection("users");
    const user = await allusers.findOne({ email: email });
    if (user) {
      const token = randomstring.generate();
      const data = allusers.updateOne(
        { email: email },
        { $set: { passwordToken: token } }
      );
      sendResetPasswordMail(user.name, email, token);
      res.status(200).send({ message: "Please check your email inbox." });
    } else {
      res
        .status(404)
        .json({ message: "User with this email id doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
};

const resetPassword = async (req, res, db) => {
  const { password, confirmPassword, email } = req.body;
  if (!password || !confirmPassword || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and Confirm Password must be same" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const allusers = db.collection("users");
    const user = await allusers.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        message: "Could not find a user with this email",
      });
    }
    await allusers.updateOne(
      { email: email },
      { $set: { hashedPassword: hashedPassword } }
    );
    res.status(200).send({
      message: "Password has been reseted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while processing the request" });
  }
};

module.exports = (db) => ({
  signup: (req, res) => signup(req, res, db),
  googleLogin: (req, res) => googleLogin(req, res, db),
  login: (req, res) => login(req, res, db),
  forgotPassword: (req, res) => forgotPassword(req, res, db),
  resetPassword: (req, res) => resetPassword(req, res, db),
});

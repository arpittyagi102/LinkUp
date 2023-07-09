const bcrypt = require('bcrypt');
const {forget_password_email} = require("../extras/email")
const signup = async (req, res, db) => {
    const { fname, lname, email, password } = req.body;
    if(!fname || !lname || !email || !password){
        res.status(400).json({message:"All fields are required"})
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { 
            name:fname+' '+lname, 
            email:email,
            email_verified:false,
            hashedPassword:hashedPassword,
            picture:null,
            friends:[]
        };

        const allusers = db.collection('users');
        const user = await allusers.findOne({ email: newUser.email });

        if (user && user.email && user.hashedPassword) {
            res.status(409).json({ message: "User with the provided email already exists" });
            return;
        }

        if (user && user.email && !user.hashedPassword){
            await allusers.updateOne(
                { email: newUser.email },
                { $set: { hashedPassword:hashedPassword } }
            )
            return res.status(200).json({ message: "User successfully created", ...newUser });
        }

        await allusers.insertOne(newUser);
        res.status(200).json({ message: "User successfully created", ...newUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to insert user into the database" });
    }
};

const googleLogin = async (req, res, db) => {
    try {
        const allusers = db.collection('users');
        const user = await allusers.findOne({ email: req.body.email });
        if (user && user.email) {
            await allusers.updateOne(
                { email: req.body.email },
                { $set: { picture:req.body.picture,
                        email_verified:req.body.email_verified } }
            )
            res.status(200).json({ message: "User successfully created", ...req.body });
            return;
        }
        await allusers.insertOne(req.body);
        res.status(200).json({ message: "User successfully created", ...req.body });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to insert user into the database",...err });
    }
};

const login = async (req, res, db) => {
    const { email, password } = req.body;
    if(!email){
        res.status(400).json({message:"Data is not found",data:req.body})
        return;
    }

    const allusers = db.collection('users');
    const user = await allusers.findOne({ email:email });

    if (!user) {
        res.status(404).json({ message: 'Could not find a user with this email' });
        return;
    } else {
        try {
            const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
            if (isPasswordValid) {
                const payload = {
                    name : user.name,
                    email : user.email,
                    picture : user.picture,
                    friends : user.friends,
                } 
                res.status(200).json({ message: 'Successfully logged in',payload });
            } else {
                res.status(401).json({ message: 'Wrong password' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while processing the request' });
        }
    }
};

const forget = async(req, res, db) => {
    const { email} = req.body;
    if(!email){
        res.status(404).json({message : "You haven't enter email"});
    }

    const allusers = db.collection('users');
    const user = await allusers.findOne({email : email});
    if(!user) {
        res.status(404).json({message : "Invalid email address"});
    }
    else {
        try {
            const message = forget_password_email(email, user._id);
            res.status(200).json({message : message});
        }
        catch(error){
            console.error(error);
            res.status(500).json({ message: 'An error occurred while processing the request' });
        }
    }
}

const change_password = async (req, res, db) => {
    const {password} = req.body;
    const hashedPassword = await bcrypt.hash(password,10);

    const user_id = req.params.id;
    const allusers = db.collection('users');
    try {
        const update_user = await allusers.updateOne(
            { _id: user_id },
            { $set: { hashedPassword:hashedPassword } }
        );
        res.status(200).json({message : "Password Changed!", data : update_user})
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing the request' });
    }

}

module.exports = (db) => ({
    signup: (req, res) => signup(req, res, db),
    googleLogin: (req, res) => googleLogin(req, res, db),
    login: (req, res) => login(req, res, db),
    forget : (req, res) => forget(req, res, db),
    change_password : (req, res) => change_password(req, res, db)

});

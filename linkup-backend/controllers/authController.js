const bcrypt = require('bcrypt');

const signup = async (req, res, db) => {
    const { fname, lname, email, password } = req.body;
    if(!fname || !lname || !email || !password){
        res.status(400).json({message:"All fields are required"})
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { fname, lname, email, hashedPassword };

        const allusers = db.collection('users');
        const user = await allusers.findOne({ email: newUser.email });

        if (user && user.email) {
            res.status(409).json({ message: "User with the provided email already exists" });
            return;
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
        //const allusers = db.collection('users');
        //await allusers.insertOne(req.body);
        res.status(200).json({ message: "User successfully created", ...req.body });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to insert user into the database" });
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
                res.status(200).json({ message: 'Successfully logged in' });
            } else {
                res.status(401).json({ message: 'Wrong password' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while processing the request' });
        }
    }
};

module.exports = (db) => ({
    signup: (req, res) => signup(req, res, db),
    googleLogin: (req, res) => googleLogin(req, res, db),
    login: (req, res) => login(req, res, db),
});

const getuser = async (req, res, db) => {
    const email = req.params.email;
    try {
      const allusers = db.collection('users');
      const userdata = await allusers.findOne({ email: email });
      if (!userdata)
        return res.status(404).json({ message: "Could not find a user with this email" });
      else
        return res.status(200).json({ ...userdata });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve user details', error });
    }
  };
  
  const getallusers = async (req, res, db) => {
    try {
      const allusers = db.collection('users');
      const allUsers = await allusers.find().toArray();
      return res.status(200).json(allUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve users data', error });
    }
  };
  
  module.exports = (db) => ({
    getuser: (req, res) => getuser(req, res, db),
    getallusers: (req, res) => getallusers(req, res, db),
  });
  
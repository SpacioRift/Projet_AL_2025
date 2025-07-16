const User = require("./../model/user.model.js");

exports.getAll = async (req, res) => {
    try {
        let usersList = await User.findAll();
        res.status(200).json(usersList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users", error });
    }
}

const User = require('../model/user.model');

exports.create = async (req, res, next) => {
    try {
        const { password, ...rest } = req.body;

        // le hash * 10
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            ...rest,
            password: hashedPassword
        });

        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};
exports.update = async (req, res, next) => {
    let user = await User.update({
        ...req.body.user
    }, { where: { id: req.params.id } });
    res.status(201).json(user);
}

exports.delete = async (req, res, next) => {
    await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Utilisateur supprimé" });
}

exports.getById = async (req, res, next) => {
    let user = await User.findOne({ where: { id: req.params.id } });
    res.status(200).json(user);
}

exports.getAll = async (req, res, next) => {
    let userList = await User.findAll();
    res.status(200).json(userList);
}

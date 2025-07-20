const User = require('../model/user.model');

exports.create = async (req, res, next) => {
    let user = await User.create(req.body.user);
    res.status(201).json(user);
}

exports.update = async (req, res, next) => {
    let user = await User.update({
        ...req.body.user
    }, { where: { id_u: req.params.id } });
    res.status(201).json(user);
}

exports.delete = async (req, res, next) => {
    await User.destroy({ where: { id_u: req.params.id } });
    res.status(200).json({ message: "Utilisateur supprimé" });
}

exports.getById = async (req, res, next) => {
    let user = await User.findOne({ where: { id_u: req.params.id } });
    res.status(200).json(user);
}

exports.getAll = async (req, res, next) => {
    let userList = await User.findAll();
    res.status(200).json(userList);
}

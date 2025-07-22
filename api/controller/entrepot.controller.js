const Entrepot = require('../model/entrepot.model');

exports.create = async (req, res, next) => {
    let entrepot = await Entrepot.create(req.body.entrepot);
    res.status(201).json(entrepot);
}

exports.update = async (req, res, next) => {
    let entrepot = await Entrepot.update({
        ...req.body.entrepot
    }, { where: { id: req.params.id } });
    res.status(201).json(entrepot);
}

exports.delete = async (req, res, next) => {
    await Entrepot.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "Entrepôt supprimé" });
}

exports.getById = async (req, res, next) => {
    let entrepot = await Entrepot.findOne({ where: { id: req.params.id } });
    res.status(200).json(entrepot);
}

exports.getAll = async (req, res, next) => {
    let entrepotList = await Entrepot.findAll();
    res.status(200).json(entrepotList);
}
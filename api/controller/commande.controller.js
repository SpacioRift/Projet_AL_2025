const Commande = require('../model/commande.model');

exports.create = async (req, res, next) => {
    let commande = await Commande.create(req.body.commande);
    res.status(201).json(commande);
}

exports.update = async (req, res, next) => {
    let commande = await Commande.update({
        ...req.body.commande
    }, { where: { id_c: req.params.id } });
    res.status(201).json(commande);
}

exports.delete = async (req, res, next) => {
    await Commande.destroy({ where: { id_c: req.params.id } });
    res.status(200).json({ message: "Commande supprimée" });
}

exports.getById = async (req, res, next) => {
    let commande = await Commande.findOne({ where: { id_c: req.params.id } });
    res.status(200).json(commande);
}

exports.getAll = async (req, res, next) => {
    let commandeList = await Commande.findAll();
    res.status(200).json(commandeList);
}
const Fournisseur = require('../model/fournisseur.model');

exports.create = async (req, res, next) => {
    let fournisseur = await Fournisseur.create(req.body.fournisseur);
    res.status(201).json(fournisseur);
}

exports.update = async (req, res, next) => {
    let fournisseur = await Fournisseur.update({
        ...req.body.fournisseur
    }, { where: { id_f: req.params.id } });
    res.status(201).json(fournisseur);
}

exports.delete = async (req, res, next) => {
    await Fournisseur.destroy({ where: { id_f: req.params.id } });
    res.status(200).json({ message: "Fournisseur supprimé" });
}

exports.getById = async (req, res, next) => {
    let fournisseur = await Fournisseur.findOne({ where: { id_f: req.params.id } });
    res.status(200).json(fournisseur);
}

exports.getAll = async (req, res, next) => {
    let fournisseurList = await Fournisseur.findAll();
    res.status(200).json(fournisseurList);
}
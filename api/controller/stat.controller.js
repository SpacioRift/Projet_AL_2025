const Stat = require('../model/stat.model');

exports.create = async (req, res, next) => {
    let stat = await Stat.create(req.body.stat);
    res.status(201).json(stat);
}

exports.update = async (req, res, next) => {
    let stat = await Stat.update({
        ...req.body.stat
    }, { where: { id_st: req.params.id } });
    res.status(201).json(stat);
}

exports.delete = async (req, res, next) => {
    await Stat.destroy({ where: { id_st: req.params.id } });
    res.status(200).json({ message: "Statistique supprimée" });
}

exports.getById = async (req, res, next) => {
    let stat = await Stat.findOne({ where: { id_st: req.params.id } });
    res.status(200).json(stat);
}

exports.getAll = async (req, res, next) => {
    let statList = await Stat.findAll();
    res.status(200).json(statList);
}
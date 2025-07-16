const Product = require('../model/product.model');

exports.create = async (req, res, next) => {
    let product = await Product.create(req.body.product);
    res.status(201).json(product);
}

exports.update = async (req, res, next) => {
    let product = await Product.update({
        ...req.body.product
    }, { where: { id_p: req.params.id } });
    res.status(201).json(product);
}

exports.delete = async (req, res, next) => {
    await Product.destroy({ where: { id_p: req.params.id } });
    res.status(200).json({ message: "Produit supprimé" });
}

exports.getById = async (req, res, next) => {
    let product = await Product.findOne({ where: { id_p: req.params.id } });
    res.status(200).json(product);
}

exports.getAll = async (req, res, next) => {
    let productList = await Product.findAll();
    res.status(200).json(productList);
}
const Stock = require('../model/stock.model');

exports.create = async (req, res, next) => {
    let stock = await Stock.create(req.body.stock);
    res.status(201).json(stock);
}

exports.update = async (req, res, next) => {
    let stock = await Stock.update({
        ...req.body.stock
    }, { where: { id_s: req.params.id } });
    res.status(201).json(stock);
}

exports.delete = async (req, res, next) => {
    await Stock.destroy({ where: { id_s: req.params.id } });
    res.status(200).json({ message: "Stock supprimé" });
}

exports.getById = async (req, res, next) => {
    let stock = await Stock.findOne({ where: { id_s: req.params.id } });
    res.status(200).json(stock);
}

exports.getAll = async (req, res, next) => {
    let stockList = await Stock.findAll();
    res.status(200).json(stockList);
}

exports.getCriticalStocks = async (req, res, next) => {
    let criticalStocks = await Stock.findAll({
        where: {
            quantity: {
                [Op.lt]: 10 // Assuming critical stock is defined as having less than 10 items
            }
        }
    });
    res.status(200).json(criticalStocks);
}
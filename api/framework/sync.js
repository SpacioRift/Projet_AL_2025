const { bdd } = require('./connexion.js');
const User = require("./../model/user.model.js");

const Product = require('../model/product.model');
const Commande = require('../model/commande.model');
const Stat = require('../model/stat.model');
const Stock = require('../model/stock.model');
const entrepot = require('../model/entrepot.model');
const fournisseur = require('../model/fournisseur.model');

const sync = async () => {
    await bdd.sync();
}

module.exports = sync;


const bcrypt = require('bcrypt');
const User = require("../model/user.model.js");
const Product = require("../model/product.model.js");
const Stock = require("../model/stock.model.js");
const Entrepot = require("../model/entrepot.model.js");
const Commande = require("../model/commande.model.js");
const Stat = require("../model/stat.model.js");
const Fournisseur = require("../model/fournisseur.model.js");

const dataset = async () => {
    await User.create({
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@mail.com",
        password: bcrypt.hashSync('test123', 10),
        privilege: "admin"
    });
    await User.create({
        nom: "Martin",
        prenom: "Sophie",
        email: "sophie.martin@mail.com",
        password: bcrypt.hashSync('test456', 10),
        privilege: "user"
    });

    await Product.create({
        nom_p: "Clavier",
        provenance_p: "France",
        prix_p: 25.99,
        reference_p: "CLAV123"
    });
    await Product.create({
        nom_p: "Souris",
        provenance_p: "Chine",
        prix_p: 15.50,
        reference_p: "SOUR456"
    });

    await Entrepot.create({
        nom_e: "Central",
        adresse_e: "1 rue du Stock",
        ville_e: "Paris",
        capacite_e: 1000
    });

    await Stock.create({
        produit_s: "Clavier",
        quantite_s: 10,
        emplacement_s: "A1",
        entrepot_s: "Central"
    });
    await Stock.create({
        produit_s: "Souris",
        quantite_s: 3,
        emplacement_s: "A2",
        entrepot_s: "Central"
    });

    await Commande.create({
        produit_c: "Clavier",
        quantite_c: 2,
        date_c: new Date()
    });

    await Stat.create({
        quantite_st: 2,
        date_st: new Date(),
        commande_st: "CMD001"
    });

    await Fournisseur.create({
        nom_f: "TechDistrib",
        adresse_f: "5 rue Fournisseur",
        ville_f: "Paris",
        telephone_f: "0102030405",
        produit_f: "Clavier"
    });
};

module.exports = dataset;
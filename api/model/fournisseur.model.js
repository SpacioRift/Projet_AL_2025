const {bdd} = require('../framework/connection');
const {DataTypes} = require('sequelize');

const Fournisseur = bdd.define(
    'fournisseur',
    {
        id_f: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom_f: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        adresse_f: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ville_f: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        telephone_f: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        produit_f: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }
);

module.exports = Fournisseur;
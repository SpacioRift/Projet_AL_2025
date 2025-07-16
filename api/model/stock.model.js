const {bdd} = require('../framework/connection');
const {DataTypes} = require('sequelize');

const Stock = bdd.define(
    'stock',
    {
        id_s: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        produit_s: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        quantite_s: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        emplacement_s: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        entrepot_s: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }
);

module.exports = Stock;
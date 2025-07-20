const {bdd} = require('../framework/connexion');
const {DataTypes} = require('sequelize');

const Stock = bdd.define(
    'stock',
    {
        
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
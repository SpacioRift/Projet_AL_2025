const {bdd} = require('../framework/connexion');
const {DataTypes} = require('sequelize');

const Product = bdd.define(
    'produit',
    {
        
        nom_p: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        provenance_p: {
            type: DataTypes.STRING(255)
        },
        prix_p: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false
        },
        reference_p: {
            type: DataTypes.STRING(255)
        }
    }
);

module.exports = Product;
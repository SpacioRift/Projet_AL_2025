const {bdd} = require('../framework/connexion');
const {DataTypes} = require('sequelize');

const Commande = bdd.define(
    'commande',
    {
        id_c: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        produit_c: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        quantite_c: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date_c: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }
);

module.exports = Commande;
const {bdd} = require('../framework/connection');
const {DataTypes} = require('sequelize');

const Entrepot = bdd.define(
    'entrepot',
    {
        id_e: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nom_e: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        adresse_e: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        ville_e: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        capacite_e: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
);

module.exports = Entrepot;
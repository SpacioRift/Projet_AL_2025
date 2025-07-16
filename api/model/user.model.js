const {bdd} = require('./connexion.js');
const {dataTypes} = require('sequelize');

const User = bdd.define('user', {
    nom: {
        type: dataTypes.STRING,
        allowNull: false
    },
    prenom: {
        type: dataTypes.STRING,
        allowNull: false
    },
    email: {
        type: dataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: dataTypes.STRING,
        allowNull: false
    },
    privilege: {
        type: dataTypes.STRING,
    }
})

module.exports = User;
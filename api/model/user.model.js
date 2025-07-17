const { bdd } = require("../framework/connexion.js")
const { DataTypes } = require("sequelize")

const User = bdd.define("user", {
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  privilege: {
    type: DataTypes.STRING,
  },
})

module.exports = User

const { bdd } = require("../framework/connexion")
const { DataTypes } = require("sequelize")

const Stat = bdd.define("stat", {
  quantite_st: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date_st: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  commande_st: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
})

module.exports = Stat

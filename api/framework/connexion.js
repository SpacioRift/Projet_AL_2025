const { Sequelize } = require("sequelize")
require("dotenv").config()

const bdd = new Sequelize(process.env.BDD_NAME, process.env.BDD_USER, process.env.BDD_PASSWORD, {
  dialect: "mysql",
  host: process.env.BDD_HOST,
})

const connect = async () => {
  try {
    await bdd.authenticate()
    console.log("Connection has been established successfully")
  } catch (error) {
    console.error("Unable to connect to the database", error)
  }
}
module.exports = { connect, bdd }

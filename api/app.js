const express = require("express")
const cors = require("cors")
const authRoute = require("./route/auth.route")
const userRoute = require("./route/user.route")
const productRoute = require("./route/product.route")
const commandeRoute = require("./route/commande.route")
const statRoute = require("./route/stat.route")
const stockRoute = require("./route/stock.route")
const entrepotRoute = require("./route/entrepot.route")
const fournisseurRoute = require("./route/fournisseur.route")
const { connect } = require("./framework/connexion")
const sync = require("./framework/sync")
const dataset = require("./framework/dataset")

const app = express()

const database = async () => {
  await connect()
  await sync()
  await dataset()
}
database()

// Middleware CORS simple
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")

  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Configuration CORS existante (gardée pour compatibilité)
app.use(
  cors({
    origin: ["http://localhost:9000", "http://localhost:8080"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

app.use(express.json())

app.use("/auth", authRoute)
app.use("/user", userRoute)
app.use("/product", productRoute)
app.use("/commande", commandeRoute)
app.use("/stat", statRoute)
app.use("/stock", stockRoute)
app.use("/entrepot", entrepotRoute)
app.use("/fournisseur", fournisseurRoute)

module.exports = app

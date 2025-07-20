const express = require('express');
const authRoute = require('./route/auth.route');
const userRoute = require('./route/user.route');
const productRoute = require('./route/product.route');
const commandeRoute = require('./route/commande.route');
const statRoute = require('./route/stat.route');
const stockRoute = require('./route/stock.route');
const entrepotRoute = require('./route/entrepot.route');
const fournisseurRoute = require('./route/fournisseur.route');
const { connect } = require('./framework/connexion');
const sync = require('./framework/sync');

const app = express();

const database = async () => {
    await connect();
    await sync();
}
database();

app.use(express.json());

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/product', productRoute);
app.use('/commande', commandeRoute);
app.use('/stat', statRoute);
app.use('/stock', stockRoute);
app.use('/entrepot', entrepotRoute);
app.use('/fournisseur', fournisseurRoute);



module.exports = app;
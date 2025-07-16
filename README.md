# Projet_AL_2025
Développement d'une application de gestion des stocks en Node.JS et Vue.JS.

# Initialisation du projet Symfony et installation des logiciels.

Utilisation d'une base de donée MySQL et de DBeaver pour l'aspect gestion de la base.
Utilisation de Wamp PHP 8.2

Installation de node js : 

npm init (créer le projet)
npm install express
création du server
creation du app
creation des routes
npm i express
npm i mysql2
npm i sequelize
npm i jsonwebtoken
npm i bcrypt 
npm i multer
npm  install check-password-complexity

"node server" pour lancer le server

Ne pas oublier de set le fichier .env avec les variables suivantes : 
SERVER_PORT | BDD_NAME | BDD_USER | BDD_PASSWORD | BDD_HOST | JWT_SECRET

# Initialisation du client QUASAR

à la racine du projet installer quasar CLI te créer le dossier client pendant pendant l'installation: 

npm i -g @quasar/cli
npm init quasar@latest

Se placer sur le chemin client "\Projet_Al_2025\client" et effectuer "npm run dev" pour lancer l'application 
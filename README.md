# Projet_AL_2025
Développement d'une application de gestion des stocks en Symfony et Vue.SJ.

# Initialisation du projet Symfony et installation des logiciels.

Utilisation d'une base de donée MySQL et de DBeaver pour l'aspect gestion de la base.
Utilisation de Wamp et de Composer avec PHP 8.2

Lors de l'installation de composer si vous avez une erreur de type "OpenSSL failed with a 'certificate verify failed' error."
Ouvrez le lien suivant : http://curl.haxx.se/ca/cacert.pem 
Une fois le Cacert.pem téléchargé : il faut le placer dans Wamp et vérifier le fichier php.ini situé "Wamp64\bin\php\php8.2.13\"
Dans le fichier php.ini ajouter les lignes suivantes, si celle-ci n'existent pas (Modifier le chemin d'accès vers votre cacert): 

openssl.cafile=/etc/ssl/certs/cacert.pem
curl.cainfo=/etc/ssl/certs/cacert.pem

Installer Symfony via la commande Scoop sduivante : "scoop install symfony-cli"

# Initialisation du client QUASAR

à la racine du projet installer quasar CLI te créer le dossier client pendant pendant l'installation: 

npm i -g @quasar/cli
npm init quasar@latest

Se placer sur le chemin client "\Projet_Al_2025\client" et effectuer "npm run dev" pour lancer l'application
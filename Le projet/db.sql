DROP TABLE `user`;
CREATE TABLE IF NOT EXISTS `user`(
    `id_u` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `nom_u` varchar (30) NOT NULL,
    `prenom_u` varchar(30) NOT NULL,
    `email_u` varchar(30) NOT NULL,
    `password_u` varchar(255) NOT NULL,
    `privilege_u` varchar(30) NOT NULL
);

DROP TABLE `produit`;
CREATE TABLE IF NOT EXISTS `produit`(
    `id_p` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `nom_p` varchar (30) NOT NULL,
    `provenance_p` varchar(30) NOT NULL,
    `prix_p` DECIMAL NOT NULL,
    `reference_p` varchar(30),
);

DROP TABLE `stock`;
CREATE TABLE IF NOT EXISTS `produit`(
    `id_s` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `produit_s` varchar (30) NOT NULL,
    `quantite_s` int NOT NULL,
);

DROP TABLE `entrpot`;
CREATE TABLE IF NOT EXISTS `entrepot`(
    `id_e` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `nom_e` varchar (30) NOT NULL,
    `adresse_e` varchar(30) NOT NULL,
    `ville_e` varchar(30) NOT NULL,
    `capacite_e` int NOT NULL,
);

DROP TABLE `commande`;
CREATE TABLE IF NOT EXISTS `commande`(
    `id_c` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `produit_c` varchar (30) NOT NULL,
    `quantite_c` int NOT NULL,
    `date_c` date NOT NULL,
);

DROP TABLE `stat`;
CREATE TABLE IF NOT EXISTS `stat`(
    `id_st` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `produit_st` varchar (30) NOT NULL,
    `quantite_st` int NOT NULL,
    `date_st` date NOT NULL,
);




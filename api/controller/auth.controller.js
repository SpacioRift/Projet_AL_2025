const bcrypt = require('bcrypt');
const User = require("./../model/user.model.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.signin = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, privilege } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      privilege,
      password: hash
    });

    res.status(201).json({ message: "Administrateur créé", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Identifiant ou mot de passe incorrect" });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.privilege },
      process.env.JWT_TOKEN,
      { expiresIn: "1h" }
    );
    
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

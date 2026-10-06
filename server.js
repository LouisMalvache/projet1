const express = require('express');
const app = express();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'projet',
  password: 'roots',
  database: 'projet1'
});


db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});

app.use(express.static('front/html'));
app.use(express.json());

app.get('/login', (req, res) => {
  res.send('<h1>Bienvenue sur la page de login</h1>'); F
});

// Liste des utilisateurs (sans les mots de passe)
app.get('/Users', (req, res) => {
  db.query('SELECT id, login FROM user', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// Inscription
app.post('/register', async (req, res) => {
  const login = req.body.inputValue;
  const password = req.body.inputValue2;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login et mot de passe requis' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO user (login, password) VALUES (?, ?)',
      [login, hash],
      (err, results) => {
        if (err) {
          console.error("Erreur lors de l'insertion :", err);
          return res.status(500).json({ message: 'Erreur serveur' });
        }
        console.log('Insertion réussie, ID utilisateur :', results.insertId);
        res.json({ message: 'Inscription réussie !', userId: results.insertId });
      }
    );
  } catch (e) {
    console.error('Erreur de hachage :', e);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
app.post('/connexion', (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ message: 'Login et mot de passe requis' });
  }

  db.query('SELECT * FROM user WHERE login = ?', [login], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des identifiants :', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const user = results[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    delete user.password; // on ne renvoie jamais le mot de passe
    res.json({ message: 'Connexion réussie !', user });
  });
});

// Démarrage du serveur
app.listen(3000, () => {
  const monIp = require('ip').address();
  console.log(`Server running on http://${monIp}:3000`);
});

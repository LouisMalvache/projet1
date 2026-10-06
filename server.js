const express = require('express');
const app = express();
const mysql = require('mysql2');

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
  res.send('<h1>Bienvenue sur la page de login  </h1>');
});

app.get('/Users', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }
    res.json(results);
  });
});



app.post('/register', (req, res) => {

  db.query(
    'INSERT INTO inscription (login, password) VALUES (?, ?)',
    [req.body.inputValue, req.body.inputValue2],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la base de données :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }
      console.log('Insertion réussie, ID utilisateur :', results.insertId);
      res.json({ message: 'Inscription réussie !', userId: results.insertId });

    }
  );
})




app.post('/connexion', (req, res) => {  
  console.log(req.body);
  //on récupère le login et le password
  const { login, password } = req.body;
  connection.query('SELECT * FROM Users WHERE login = ? AND password = ?', [login, password], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification des identifiants :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }
      if (results.length === 0) {
        res.status(401).json({ message: 'Identifiants invalides' });
        return;
      }
      // Identifiants valides 
      //renvoi les informations du user
      res.json({ message: 'Connexion réussie !', user: results[0] });
    });
});

// Démarrage du serveur
app.listen(3000, () => {
  let monIp = require("ip").address();
  console.log(`Server running on http://${monIp}:3000`);
});                                                            
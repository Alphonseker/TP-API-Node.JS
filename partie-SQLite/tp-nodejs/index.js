const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');

dotenv.config();

const db = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('🚀 API Node.js fonctionne !');
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

const fs = require('fs');
const raw = JSON.parse(fs.readFileSync('./SuperHerosComplet.json', 'utf-8'));
const data = raw.heroes;
const insert = db.prepare(`INSERT INTO heroes (name, publisher, gender, race, power,
alignment, height_cm, weight_kg, createdAt)
VALUES (@name, @publisher, @gender, @race, @power, @alignment, @height_cm, @weight_kg,
@createdAt)`);


const count = db.prepare('SELECT COUNT(*) as total FROM heroes').get();
if (count.total === 0) {
  const now = new Date().toISOString();
  for (const hero of data) {
  insert.run({
    name: hero.name,
    publisher: hero.biography?.publisher || null,
    gender: hero.appearance?.gender || null,
    race: hero.appearance?.race || null,
    power: hero.powerstats?.power || null,
    alignment: hero.biography?.alignment || null,
    height_cm: parseInt(hero.appearance?.height?.[1]) || null,
    weight_kg: parseInt(hero.appearance?.weight?.[1]) || null,
    createdAt: now
  });
}
  console.log('Données initiales importées.');
}

app.delete('/reset-db', (req, res) => {
  try {
    db.prepare('DELETE FROM heroes').run();
    db.prepare('DELETE FROM sqlite_sequence WHERE name = "heroes"').run();
    res.json({ message: 'Base de données réinitialisée.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation de la DB.' });
  }
});

//app.get('/heroes', (req, res) => {
//  const heroes = db.prepare('SELECT * FROM heroes').all();
//  res.json(heroes);
//});

app.get('/heroes', (req, res) => {
  const { publisher } = req.query;

  try {
    if (publisher) {
      const heroes = db.prepare('SELECT * FROM heroes WHERE publisher = ?').all(publisher);
      res.json(heroes);
    } else {
      const heroes = db.prepare('SELECT * FROM heroes').all();
      res.json(heroes);
    }
  } catch (error) {
    console.error('Erreur dans GET /heroes :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des héros.' });
  }
});

app.get('/heroes/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  if (!query) {
    return res.status(400).json({ error: 'Requête de recherche vide' });
  }

  try {
    const heroes = db.prepare('SELECT * FROM heroes WHERE LOWER(name) LIKE ?')
      .all(`%${query}%`);

    res.json(heroes);
  } catch (error) {
    console.error('Erreur dans GET /heroes/search :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la recherche de héros.' });
  }
}
);

app.get('/heroes/sorted', (req, res) => {
  const { by } = req.query;

  // Liste blanche des champs autorisés pour le tri
  const allowedFields = ['height_cm', 'weight_kg', 'name', 'power', 'publisher'];

  if (!by || !allowedFields.includes(by)) {
    return res.status(400).json({ error: 'Champ de tri invalide ou manquant. Champs autorisés : ' + allowedFields.join(', ') });
  }

  try {
    const query = `SELECT * FROM heroes ORDER BY ${by} ASC`; // ou DESC si tu veux inverser
    const heroes = db.prepare(query).all();
    res.json(heroes);
  } catch (error) {
    console.error('Erreur dans GET /heroes/sorted :', error);
    res.status(500).json({ error: 'Erreur serveur lors du tri.' });
  }
});


app.get('/heroes/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  const hero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id);

  if (hero) {
    res.json(hero);
  } else {
    res.status(404).json({ error: 'Héros non trouvé' });
  }
});

app.post('/heroes', (req, res) => {
  const { name, publisher, gender, race, power, alignment, height_cm, weight_kg } = req.body;

  // Vérifiez que toutes les données nécessaires sont présentes
  if (!name || !publisher) {
    return res.status(400).json({ error: 'Les champs "name" et "publisher" sont requis.' });
  }

  try {
    const now = new Date().toISOString();
    const insert = db.prepare(`INSERT INTO heroes (name, publisher, gender, race, power, alignment, height_cm, weight_kg, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const result = insert.run(name, publisher, gender || null, race || null, power || null, alignment || null, height_cm || null, weight_kg || null, now);

    // Récupérer l'ID du nouvel enregistrement
    const newHero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(newHero);
  } catch (error) {
    console.error('Erreur lors de l\'ajout du héros :', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'ajout du héros.' });
  }
});

app.delete('/heroes/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Vérifiez que l'ID est un nombre valide
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    // Vérifiez d'abord si le héros existe
    const hero = db.prepare('SELECT * FROM heroes WHERE id = ?').get(id);

    if (!hero) {
      return res.status(404).json({ error: 'Héros non trouvé' });
    }

    // Supprimez le héros de la base de données
    const deleteStmt = db.prepare('DELETE FROM heroes WHERE id = ?');
    deleteStmt.run(id);

    res.status(200).json({ message: 'Héros supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du héros :', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression du héros.' });
  }
});


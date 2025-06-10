const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');

dotenv.config();

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

// lecture du json
const fs = require('fs/promises');

let heroes = [];

async function loadHeroes() {
  const data = await fs.readFile('./SuperHerosComplet.json', 'utf-8');
  const json = JSON.parse(data);
  heroes = json.superheros;
}
loadHeroes();

//app.get('/heroes', (req, res) => {
//  res.json(heroes);
//});

app.get('/heroes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hero = heroes.find(h => h.id === id);

  if (hero) {
    res.json(hero);
  } else {
    res.status(404).json({ error: 'Héros non trouvé' });
  }
});

app.get('/heroes', (req, res) => {
  const { publisher } = req.query;

  if (publisher) {
    const filtered = heroes.filter(hero =>
      hero.biography.publisher?.toLowerCase() === publisher.toLowerCase()
    );
    res.json(filtered);
  } else {
    res.json(heroes);
  }
});

app.get('/heroes/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const results = heroes.filter(h => h.name.toLowerCase().includes(query));
  res.json(results);
});

app.post('/heroes', (req, res) => {
  const newHero = req.body;

  if (!newHero.name || !newHero.biography || !newHero.biography.publisher) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  const maxId = Math.max(...heroes.map(h => h.id));
  newHero.id = maxId + 1;

  heroes.push(newHero);
  res.status(201).json(newHero);
});

app.delete('/heroes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = heroes.findIndex(h => h.id === id);

  if (index !== -1) {
    heroes.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Héros non trouvé' });
  }
});



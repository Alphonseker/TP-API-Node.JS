# TP-API-Node.JS

---------- Version 1 avec le JSON ----------

La première étape est de démarrer le serveur, pour cela il faut entrer dans l'invite de commande (cmd de Windows):
1. npm init -y
2. npm install express
3. npm run dev

Dans cette version vous pouvez tester les URLs suivants:
- http://localhost:4000/heroes : pour afficher tous les héros
- http://localhost:4000/heroes/id : pour rechercher un n° d'id d'un héros
- http://localhost:4000/heroes?publisher="nom de éditeur" : pour rechercher tous les héros d'un éditeur particulier
- http://localhost:4000/heroes/search?q="mot(s) recherché(s)" : pour rechercher tous les héros dont les informations contiennent la chaine de caractères recherchée
- POST http://localhost:4000/heroes : pour enregistrer un nouvel héros dans le JSON
- DELETE http://localhost:4000/heroes/id : pour supprimer un héros en renseignant son id.

---------- Version 2 avec SQLite ----------

La première étape est de démarrer le serveur, pour cela il faut entrer dans l'invite de commande (cmd de Windows):
1. npm init -y
2. npm install express
3. npm install express better-sqlite3
4. npm run dev

Dans cette version vous pouvez tester les URLs suivants:
- http://localhost:4000/heroes : pour afficher tous les héros
- http://localhost:4000/heroes/id : pour rechercher un n° d'id d'un héros
- http://localhost:4000/heroes?publisher="nom de éditeur" : pour rechercher tous les héros d'un éditeur particulier
- http://localhost:4000/heroes/search?q="mot(s) recherché(s)" : pour rechercher tous les héros dont les informations contiennent la chaine de caractères recherchée
- POST http://localhost:4000/heroes : pour enregistrer un nouvel héros dans le JSON
- DELETE http://localhost:4000/heroes/id : pour supprimer un héros en renseignant son id.

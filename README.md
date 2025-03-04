# Journal de MesServicesCyber

Ce dépôt Git représente le journal des événements métiers 
survenus dans [MesServicesCyber](https://github.com/betagouv/anssi-portail).

Ces événements métiers ont vocation à être utilisés par la 
partie _reporting_ de MesServicesCyber.

C'est [Metabase](https://www.metabase.com/), qui a été choisi 
comme outil de _reporting_.

## Philosophie

Les événements métiers MesServicesCyber sont stockés dans une table `journal_msc.evenements`.  
Cette table est utilisée comme source de données de Metabase. 

Autrement dit : 
 1. Une action métier a lieu sur [MesServicesCyber](https://messervices.cyber.gouv.fr)…
 2. …donnant lieu à l'émission d'un événement…
 3. …qui est consigné dans `journal_msc.evenements`…
 4. …rendant ainsi accessible l'information via Metabase.

## Configuration de l'environnement de développement

Il est nécessaire en prérequis d'avoir installé [Git](https://git-scm.com/),
[Docker Engine](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/).

Commencer par récupérer les sources du projet et aller dans le répertoire créé.

```sh
$ git clone https://github.com/betagouv/mes-services-cyber-journal.git && cd mes-services-cyber-journal
```

Créer la base de données `msc-journal` et un utilisateur `metabase` 
qui sera utilisé par Metabase.

```sh
$ docker compose up msc-journal-db
$ docker compose exec msc-journal-db createdb -U postgres msc-journal
$ docker compose exec msc-journal-db createuser -U postgres metabase
```

Vérifier la présence du `network` Docker `msc-network`.

```sh
$ docker network ls | grep msc-network
```

Cette commande devrait montrer le réseau `msc-network`. Si ce n'est pas le cas, se référer au `README` de
[MesServicesCyber](https://github.com/betagouv/mon-service-securise) pour la création de celui-ci.

Créer un fichier `.env` en copiant fichier `.env.template` puis valoriser chaque variable du `.env`.

Mettre à niveau le schéma de la base de données, via [`knex.js`](https://knexjs.org/) qui s'exécute dans le conteneur `node`.

```sh
$ docker compose up node
```

Donner les droits en lecture sur les éléments créés à l'utilisateur `metabase`.

```sh
$ docker compose exec msc-journal-db psql -U postgres -d msc-journal -c 'GRANT USAGE ON SCHEMA journal_msc TO metabase;'
$ docker compose exec msc-journal-db psql -U postgres -d msc-journal -c 'GRANT SELECT ON ALL TABLES IN SCHEMA journal_msc TO metabase;'
```


Démarrer Metabase.

```sh
$ ./scripts/start.sh
```

Accéder à Metabase en visitant http://localhost:3000/setup.  

Paramétrer Metabase en suivant les instructions à l'écran :
 - Base de données : PostgreSQL
 - Host : `msc-journal-db` (qui apparaît dans [./docker-compose.yml](./docker-compose.yml))
 - Port : `5432` (qui apparaît dans [./docker-compose.yml](./docker-compose.yml))
 - Database name : `msc-journal`
 - Username : `metabase`
 - Password : laisser vide
 - Schemas : `Only these…` > `journal_msc` (Attention ! C'est un `_`  et non un `-`)

Vous êtes à présent prêt à [poser des questions Metabase](https://www.metabase.com/docs/latest/questions/start) sur les 
données de MesServicesCyber.

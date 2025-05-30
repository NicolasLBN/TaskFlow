# 📋 TaskFlow – Application Web de Gestion de Tâches Collaborative

TaskFlow est une application web full-stack construite avec **React (TypeScript)** en front-end, **FastAPI** en back-end, et **DuckDB** pour la base de données. L’architecture est pensée pour le développement agile, modulaire, et dockerisée de bout en bout.

---

## 🚀 Fonctionnalités principales

- ✅ Authentification des utilisateurs (à venir)
- ✅ Création, consultation et suppression de tâches
- ✅ API REST avec FastAPI
- ✅ Base de données DuckDB (léger & rapide)
- ✅ Front-end responsive avec React + Tailwind CSS
- ✅ Tests automatisés avec Pytest
- ✅ Analyse de code avec SonarQube
- ✅ Dockerisation complète & CI GitLab

---

## 🧱 Stack technique

| Domaine        | Outils / Technologies |
|----------------|------------------------|
| Langages       | Python, TypeScript, SQL |
| Back-End       | FastAPI, DuckDB         |
| Front-End      | React, Tailwind CSS     |
| Tests          | PyTest, Postman         |
| Qualité        | SonarQube               |
| CI / DevOps    | Docker, GitLab CI/CD    |

---

## 🛠️ Installation & Lancement

### 🔁 Prérequis

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js](https://nodejs.org/)
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop)

---

### 🧪 Configuration de l’environnement de dev

#### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/taskflow.git
cd taskflow
```

#### 2. Installer les dépendances

```bash
cd backend
pip install -r requirements.txt
cd ../frontend
npm i
```

#### 3. Lancer le backend

```bash
uvicorn main:app --reload
```

#### 3. Lancer le frontend

```bash
npm start
```

```bash
npm install tailwindcss@3
```

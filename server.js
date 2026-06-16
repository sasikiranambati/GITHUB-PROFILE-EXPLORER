import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/github-profile-explorer';

const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {})
  }
});

githubApi.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    if (error.response?.status === 401 && config && !config._retry) {
      config._retry = true;
      if (config.headers) {
        delete config.headers.Authorization;
        delete config.headers.authorization;
      }
      return githubApi(config);
    }
    return Promise.reject(error);
  }
);

// Resilient MongoDB Client & Collection getters
let dbClient = null;
let db = null;
let usersCollection = null;
let reposCollection = null;
let isDbConnecting = false;

async function getDb() {
  if (db) return db;
  if (isDbConnecting) {
    return null;
  }
  isDbConnecting = true;
  try {
    dbClient = new MongoClient(MONGODB_URI);
    await dbClient.connect();
    db = dbClient.db();
    usersCollection = db.collection('users');
    reposCollection = db.collection('repos');
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (err) {
    console.warn('MongoDB connection failed. Running without database caching:', err.message);
    dbClient = null;
    db = null;
    usersCollection = null;
    reposCollection = null;
    return null;
  } finally {
    isDbConnecting = false;
  }
}

// Try connecting once on startup (non-blocking)
getDb().catch(() => {});

app.get('/api/users/:username', async (req, res) => {
  try {
    const response = await githubApi.get(`/users/${encodeURIComponent(req.params.username)}`);
    const user = response.data;

    // Optional cache saving
    try {
      const activeDb = await getDb();
      if (activeDb && usersCollection) {
        await usersCollection.updateOne(
          { login: user.login },
          { $set: user },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn('Failed to cache user to MongoDB:', dbErr.message);
    }

    res.json(user);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(500).json({ message: 'GitHub service error' });
    }
  }
});

app.get('/api/users/:username/repos', async (req, res) => {
  try {
    const response = await githubApi.get(`/users/${encodeURIComponent(req.params.username)}/repos`, {
      params: {
        per_page: 100,
        sort: 'updated'
      }
    });

    const repos = response.data;

    // Optional cache saving
    try {
      const activeDb = await getDb();
      if (activeDb && reposCollection) {
        await reposCollection.updateOne(
          { ownerLogin: req.params.username.toLowerCase() },
          { $set: { ownerLogin: req.params.username.toLowerCase(), repos, updatedAt: new Date() } },
          { upsert: true }
        );
      }
    } catch (dbErr) {
      console.warn('Failed to cache repos to MongoDB:', dbErr.message);
    }

    res.json(repos);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(error);
      res.status(500).json({ message: 'GitHub service error' });
    }
  }
});

app.get('/api/saved/users/:username/repos', async (req, res) => {
  try {
    const activeDb = await getDb();
    if (activeDb && reposCollection) {
      const saved = await reposCollection.findOne({ ownerLogin: req.params.username.toLowerCase() });
      res.json(saved?.repos || []);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Saved repos lookup failed:', error);
    res.status(500).json({ message: 'Saved repos lookup failed' });
  }
});

// Conditionally listen if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
  });
}

export default app;

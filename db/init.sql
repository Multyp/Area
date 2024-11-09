DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_database WHERE datname = 'mydb'
  ) THEN
    CREATE DATABASE mydb;
  END IF;
END $$;

\c mydb;

-- Table des providers (fournisseurs OAuth)
CREATE TABLE IF NOT EXISTS providers (
  id SERIAL PRIMARY KEY,
  account_id TEXT UNIQUE NOT NULL, -- ID unique de l'utilisateur dans ce provider
  account_name TEXT NOT NULL, -- Nom du fournisseur (Google, Discord, etc.)
  account_email TEXT UNIQUE NULL, -- Email fourni seulement si applicable.
  account_token TEXT NOT NULL -- Token OAuth (vous pouvez le rendre NULLABLE si besoin)
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NULL, -- Email peut être NULL (pour les utilisateurs OAuth)
  password TEXT NULL, -- Password est obligatoire pour les utilisateurs non-OAuth
  provider_id INTEGER NULL REFERENCES providers(id) ON DELETE CASCADE
  -- provider_id est Obligatoire pour les OAuth,
  -- il spécifie le compe utilisé pour l'authentification
);

-- Table de jointure entre les utilisateurs et leurs providers
CREATE TABLE IF NOT EXISTS user_providers (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Clé étrangère vers la table users
  provider_id INTEGER REFERENCES providers(id) ON DELETE CASCADE, -- Clé étrangère vers la table providers
  PRIMARY KEY (user_id, provider_id) -- Clé primaire composite
);

-- Table des applets
CREATE TABLE IF NOT EXISTS applets (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Clé étrangère vers la table users
  name TEXT NOT NULL, -- Nom de l'applet
  config JSONB NULL, -- Configuration de l'applet: { webhook_url: ... }
  is_enabled BOOLEAN DEFAULT TRUE,

  CONSTRAINT unique_user_applet UNIQUE (user_id, name)
);

-- Table des action reactions
CREATE TABLE IF NOT EXISTS custom_applets (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL, -- Nom de l'applet
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Clé étrangère vers la table users
  is_enabled BOOLEAN DEFAULT TRUE, -- Indique si l'applet est activée ou non

  action_service_name TEXT NOT NULL, -- Nom du service de l'action
  action_name TEXT NOT NULL, -- Nom de l'action
  action_params JSONB NULL, -- Paramètres de l'action

  reaction_service_name TEXT NOT NULL, -- Nom du service de la reaction
  reaction_name TEXT NOT NULL, -- Nom de la reaction
  reaction_params JSONB NULL, -- Paramètres de la reaction: { message: 'You received a new email at {{receiver_email}} from {{sender_email}}: {{subject}} - {{body}}' }

  CONSTRAINT unique_user_custom_applet UNIQUE (user_id, name)
);

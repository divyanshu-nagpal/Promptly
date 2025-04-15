const { MeiliSearch } = require('meilisearch');
require('dotenv').config();

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});

module.exports = client;
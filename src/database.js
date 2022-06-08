const { MongoClient } = require('mongodb');
require("dotenv").config();

const URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.MONGODB_DATABASE;

async function insertMemeAudio(memeAudioList) {
  const client = new MongoClient(URI);

  try {
      await client.connect();

      const database = client.db(DATABASE_NAME);
      const memeAudios = database.collection('memeAudios');

      const result = await memeAudios.insertMany(memeAudioList);
  } 
  catch (e) {
      console.error(e);
  }
  finally {
      await client.close();
  }
}

module.exports = {insertMemeAudio};
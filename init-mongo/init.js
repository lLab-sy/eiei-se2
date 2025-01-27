db = db.getSiblingDB("eiei");

const testMedia = {
  'name': 'Movie'
}

const init = () => {
  db.createCollection("media_type");
  db["media_type"].insertOne(testMedia);
};
  
init();
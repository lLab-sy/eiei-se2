db = db.getSiblingDB("eiei");

const testMedia = {
  'name': 'Movie'
}

const init = () => {
  db.createCollection("mediaType");
  db["mediaType"].insertOne(testMedia);
};
  
init();
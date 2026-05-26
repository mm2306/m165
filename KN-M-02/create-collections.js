// KN-M-02: Collections anlegen (ohne JSON-Schema)
// Vorher in mongosh einzeln:  use BandProject;

db.createCollection("bands");
db.createCollection("musicians");
db.createCollection("songs");
db.createCollection("albums");
db.createCollection("gigs");

print("Collections in DB '" + db.getName() + "':");
db.getCollectionNames().forEach(function (name) {
  print("  - " + name);
});

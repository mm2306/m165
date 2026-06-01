// A-create-users.js

// Authentifizieren als Admin
db = db.getSiblingDB('admin');
db.auth("admin", "MyPassword.45");

// Benutzer 1: readUser
db = db.getSiblingDB('BandProject');
db.createUser({
  user: "readUser",
  pwd: "readUser123",
  roles: [ { role: "read", db: "BandProject" } ]
});
print("Benutzer 'readUser' erfolgreich in BandProject erstellt.");

// Benutzer 2: rwUser
db = db.getSiblingDB('admin');
db.createUser({
  user: "rwUser",
  pwd: "rwUser123",
  roles: [ { role: "readWrite", db: "BandProject" } ]
});
print("Benutzer 'rwUser' erfolgreich in admin erstellt.");

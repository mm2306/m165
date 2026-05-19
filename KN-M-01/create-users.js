// KN-M-01 Teil D — auf dem Server ausführen:
// sudo mongosh --authenticationDatabase admin -u admin -p 'DEIN_ADMIN_PASSWORT' < create-users.js
//
// Vorher anpassen: THEMEN_DB, Passwörter, Benutzernamen

const THEMEN_DB = "Mahadeva"; // DB aus Teil B (Nachname)

// Benutzer 1: nur lesen, Authentifizierung in der Themendatenbank
db = db.getSiblingDB(THEMEN_DB);
db.createUser({
  user: "reader1",
  pwd: "Reader1Kn01!",
  roles: [{ role: "read", db: THEMEN_DB }],
});

// Benutzer 2: lesen + schreiben, Authentifizierung in admin
db = db.getSiblingDB("admin");
db.createUser({
  user: "writer1",
  pwd: "Writer1Kn01!",
  roles: [{ role: "readWrite", db: THEMEN_DB }],
});

print("Benutzer reader1 und writer1 erstellt.");

// KN-M-03: Datenbank aufräumen / Collections löschen (Teil B - 1)
// Ausführen in mongosh: load("drop-collections.js")

// Datenbank wechseln
db = db.getSiblingDB("BandProject");

print("Lösche Collections...");
print("bands gelöscht: " + db.bands.drop());
print("musicians gelöscht: " + db.musicians.drop());
print("songs gelöscht: " + db.songs.drop());
print("albums gelöscht: " + db.albums.drop());
print("gigs gelöscht: " + db.gigs.drop());

print("\n--- Alle Collections erfolgreich gelöscht ---");

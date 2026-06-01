// KN-M-03: Daten teilweise löschen (Teil B - 2)
// Ausführen in mongosh: load("delete-data.js")

// Datenbank wechseln
db = db.getSiblingDB("BandProject");

print("--- 1. Einzelnes Dokument löschen mit deleteOne() ---");
// Gig in "Royal Albert Hall" suchen und über _id löschen
var gig = db.gigs.findOne({ venue: "Royal Albert Hall" });
if (gig) {
  print("Gefundener Gig ID: " + gig._id + " (Ort: " + gig.venue + ")");
  var resDeleteOne = db.gigs.deleteOne({ _id: gig._id });
  print("Ergebnis deleteOne (gelöscht): " + resDeleteOne.deletedCount);
} else {
  print("Kein passender Gig für deleteOne() gefunden (wurde er bereits gelöscht?)");
}

print("\n--- 2. Mehrere Dokumente löschen mit deleteMany() und ODER-Verknüpfung ---");
// Zwei Songs suchen ("Kashmir" und "Whole Lotta Love") und über $or Verknüpfung auf _id löschen
var song1 = db.songs.findOne({ title: "Kashmir" });
var song2 = db.songs.findOne({ title: "Whole Lotta Love" });

if (song1 && song2) {
  print("Gefundene Songs zum Löschen:");
  print(" - " + song1.title + " (ID: " + song1._id + ")");
  print(" - " + song2.title + " (ID: " + song2._id + ")");
  
  // deleteMany mit ODER-Verknüpfung auf _id
  var resDeleteMany = db.songs.deleteMany({
    $or: [
      { _id: song1._id },
      { _id: song2._id }
    ]
  });
  print("Ergebnis deleteMany (gelöscht): " + resDeleteMany.deletedCount);
} else {
  print("Konnte Songs für deleteMany() nicht finden (wurden sie bereits gelöscht?)");
}

print("\n--- Löschvorgänge abgeschlossen ---");

// KN-M-03: Daten verändern (Teil D)
// Ausführen in mongosh: load("update-data.js")

// Datenbank wechseln
db = db.getSiblingDB("BandProject");

print("===============================================================================");
print("KN-M-03: UPDATE OPERATIONS");
print("===============================================================================\n");

// 1. updateOne() mit _id Filterung auf Collection `musicians`
print("--- 1. updateOne() mit _id Filterung auf musicians ---");
var musician = db.musicians.findOne({ stageName: "Jimmy Page" });
if (musician) {
  print("Vorherige E-Mail von " + musician.stageName + ": " + musician.email);
  var resUpdateOne = db.musicians.updateOne(
    { _id: musician._id },
    { $set: { email: "jimmy.page.legend@ledzeppelin.com" } }
  );
  print("Ergebnis updateOne (modifiziert): " + resUpdateOne.modifiedCount);
  var updatedMusician = db.musicians.findOne({ _id: musician._id });
  print("Neue E-Mail: " + updatedMusician.email);
} else {
  print("Musiker 'Jimmy Page' nicht gefunden.");
}
print("\n-------------------------------------------------------------------------------\n");

// 2. updateMany() OHNE _id, mit ODER-Verknüpfung auf Collection `bands` (ändert mehrere)
print("--- 2. updateMany() ohne _id, mit ODER-Filter auf bands ---");
print("Bands vor dem Update:");
db.bands.find({}, { name: 1, genre: 1, status: 1 }).forEach(printjson);

var resUpdateMany = db.bands.updateMany(
  {
    $or: [
      { genre: "Rock" },
      { genre: "Hard Rock" }
    ]
  },
  { $set: { status: "Legendary" } }
);
print("\nErgebnis updateMany (modifiziert): " + resUpdateMany.modifiedCount);

print("\nBands nach dem Update:");
db.bands.find({}, { name: 1, genre: 1, status: 1 }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 3. replaceOne() auf Collection `gigs`
print("--- 3. replaceOne() auf gigs ---");
var gig = db.gigs.findOne({ venue: "Royal Albert Hall" });
if (gig) {
  print("Gig vor Ersetzung (Royal Albert Hall):");
  printjson(gig);
  
  var newGigDoc = {
    venue: "Royal Albert Hall (Reopened & Modernized)",
    date: new Date("1970-01-09"),
    ticketPrice: 6.50,
    bandId: gig.bandId,
    setlist: [
      { songId: gig.setlist[0].songId, position: 1, encore: false }
    ],
    status: "Archived",
    replaced: true
  };
  
  var resReplaceOne = db.gigs.replaceOne(
    { _id: gig._id },
    newGigDoc
  );
  print("\nErgebnis replaceOne (ersetzt): " + resReplaceOne.modifiedCount);
  
  var replacedGig = db.gigs.findOne({ _id: gig._id });
  print("\nGig nach Ersetzung:");
  printjson(replacedGig);
} else {
  print("Gig in 'Royal Albert Hall' nicht gefunden. Wurde er in Teil B gelöscht?");
  print("Hinweis: Für ein erfolgreiches Testen dieses Skripts empfiehlt es sich, vorher");
  print("drop-collections.js und danach insert-data.js auszuführen, um eine saubere Basis zu haben!");
}
print("\n-------------------------------------------------------------------------------\n");

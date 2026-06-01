// KN-M-03: Daten hinzufügen (Teil A)
// Ausführen in mongosh: load("insert-data.js")

// Datenbank wechseln
db = db.getSiblingDB("BandProject");

// 1. Variablen für ObjectIds deklarieren (Keine Hartcodierten Werte)
var m1 = ObjectId();
var m2 = ObjectId();
var m3 = ObjectId();
var m4 = ObjectId();
var m5 = ObjectId();

var b1 = ObjectId();
var b2 = ObjectId();
var b3 = ObjectId();

var s1 = ObjectId();
var s2 = ObjectId();
var s3 = ObjectId();
var s4 = ObjectId();
var s5 = ObjectId();
var s6 = ObjectId();

var a1 = ObjectId();
var a2 = ObjectId();
var a3 = ObjectId();
var a4 = ObjectId();

var g1 = ObjectId();
var g2 = ObjectId();
var g3 = ObjectId();

print("Füge Musiker hinzu (insertMany)...");
var resultMusicians = db.musicians.insertMany([
  {
    _id: m1,
    stageName: "Jimmy Page",
    mainInstrumentCode: "G",
    email: "jimmy.page@ledzeppelin.com"
  },
  {
    _id: m2,
    stageName: "Robert Plant",
    mainInstrumentCode: "V",
    email: "robert.plant@ledzeppelin.com"
  },
  {
    _id: m3,
    stageName: "John Paul Jones",
    mainInstrumentCode: "B",
    email: "jpj@ledzeppelin.com"
  },
  {
    _id: m4,
    stageName: "John Bonham",
    mainInstrumentCode: "D",
    email: "bonzo@ledzeppelin.com"
  },
  {
    _id: m5,
    stageName: "Freddie Mercury",
    mainInstrumentCode: "V",
    email: "freddie@queen.com"
  }
]);
print("Musiker eingefügt: " + resultMusicians.insertedIds.length);

print("Füge Bands hinzu (insertMany)...");
var resultBands = db.bands.insertMany([
  {
    _id: b1,
    name: "Led Zeppelin",
    formedDate: new Date("1968-09-01"),
    genre: "Hard Rock",
    members: [
      { musicianId: m1, role: "Guitarist", joinedDate: new Date("1968-09-01") },
      { musicianId: m2, role: "Vocalist", joinedDate: new Date("1968-09-01") },
      { musicianId: m3, role: "Bassist", joinedDate: new Date("1968-09-01") },
      { musicianId: m4, role: "Drummer", joinedDate: new Date("1968-09-01") }
    ]
  },
  {
    _id: b2,
    name: "Queen",
    formedDate: new Date("1970-06-01"),
    genre: "Rock",
    members: [
      { musicianId: m5, role: "Lead Vocalist", joinedDate: new Date("1970-06-01") }
    ]
  },
  {
    _id: b3,
    name: "The Who",
    formedDate: new Date("1964-01-01"),
    genre: "Rock",
    members: []
  }
]);
print("Bands eingefügt: " + resultBands.insertedIds.length);

print("Füge Songs hinzu (insertMany)...");
var resultSongs = db.songs.insertMany([
  {
    _id: s1,
    title: "Stairway to Heaven",
    durationMin: 8.02,
    bpm: 73,
    bandId: b1
  },
  {
    _id: s2,
    title: "Whole Lotta Love",
    durationMin: 5.34,
    bpm: 90,
    bandId: b1
  },
  {
    _id: s3,
    title: "Kashmir",
    durationMin: 8.28,
    bpm: 80,
    bandId: b1
  },
  {
    _id: s4,
    title: "Bohemian Rhapsody",
    durationMin: 5.55,
    bpm: 72,
    bandId: b2
  },
  {
    _id: s5,
    title: "Another One Bites the Dust",
    durationMin: 3.35,
    bpm: 110,
    bandId: b2
  },
  {
    _id: s6,
    title: "We Will Rock You",
    durationMin: 2.01,
    bpm: 81,
    bandId: b2
  }
]);
print("Songs eingefügt: " + resultSongs.insertedIds.length);

print("Füge Alben hinzu (insertMany)...");
var resultAlbums = db.albums.insertMany([
  {
    _id: a1,
    title: "Led Zeppelin IV",
    releaseDate: new Date("1971-11-08"),
    format: "LP",
    bandId: b1,
    tracks: [
      { songId: s1, trackNo: 4, isBonus: false }
    ]
  },
  {
    _id: a2,
    title: "Led Zeppelin II",
    releaseDate: new Date("1969-10-22"),
    format: "LP",
    bandId: b1,
    tracks: [
      { songId: s2, trackNo: 1, isBonus: false }
    ]
  },
  {
    _id: a3,
    title: "A Night at the Opera",
    releaseDate: new Date("1975-11-21"),
    format: "LP",
    bandId: b2,
    tracks: [
      { songId: s4, trackNo: 11, isBonus: false }
    ]
  },
  {
    _id: a4,
    title: "The Game",
    releaseDate: new Date("1980-06-30"),
    format: "LP",
    bandId: b2,
    tracks: [
      { songId: s5, trackNo: 3, isBonus: false }
    ]
  }
]);
print("Alben eingefügt: " + resultAlbums.insertedIds.length);

print("Füge Auftritte (Gigs) hinzu (insertOne)...");
var resultGig1 = db.gigs.insertOne({
  _id: g1,
  venue: "Madison Square Garden",
  date: new Date("1973-07-27"),
  ticketPrice: 7.50,
  bandId: b1,
  setlist: [
    { songId: s1, position: 1, encore: false },
    { songId: s2, position: 2, encore: true }
  ]
});
print("Gig 1 eingefügt (ID: " + resultGig1.insertedId + ")");

var resultGig2 = db.gigs.insertOne({
  _id: g2,
  venue: "Wembley Stadium",
  date: new Date("1986-07-12"),
  ticketPrice: 14.50,
  bandId: b2,
  setlist: [
    { songId: s4, position: 1, encore: false },
    { songId: s6, position: 2, encore: true }
  ]
});
print("Gig 2 eingefügt (ID: " + resultGig2.insertedId + ")");

var resultGig3 = db.gigs.insertOne({
  _id: g3,
  venue: "Royal Albert Hall",
  date: new Date("1970-01-09"),
  ticketPrice: 3.00,
  bandId: b1,
  setlist: [
    { songId: s3, position: 1, encore: false }
  ]
});
print("Gig 3 eingefügt (ID: " + resultGig3.insertedId + ")");

print("\n--- Daten-Einfügen erfolgreich abgeschlossen ---");

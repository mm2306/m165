// KN-M-03: Daten abfragen (Teil C)
// Ausführen in mongosh: load("find-data.js")

// Datenbank wechseln
db = db.getSiblingDB("BandProject");

print("===============================================================================");
print("KN-M-03: ABFRAGEN");
print("===============================================================================\n");

// 1. Abfrage auf `bands` mit DateTime-Filter
print("--- 1. Bands, die nach dem 01.01.1969 gegründet wurden (DateTime-Filter) ---");
db.bands.find({ formedDate: { $gt: new Date("1969-01-01") } }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 2. Abfrage auf `musicians` mit ODER-Verknüpfung (nicht auf _id)
print("--- 2. Musiker, die entweder Sänger (V) oder Gitarristen (G) sind (ODER-Filter) ---");
db.musicians.find({
  $or: [
    { mainInstrumentCode: "V" },
    { mainInstrumentCode: "G" }
  ]
}).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 3. Abfrage auf `gigs` mit UND-Verknüpfung (auf einer anderen Collection als ODER)
print("--- 3. Auftritte nach 1970 mit einem Ticketpreis > 5.0 (UND-Filter) ---");
db.gigs.find({
  $and: [
    { date: { $gt: new Date("1970-01-01") } },
    { ticketPrice: { $gt: 5.0 } }
  ]
}).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 4. Abfrage auf `songs` mit Regex (Teilstringsuche nach 'Love')
print("--- 4. Songs mit 'Love' im Titel (Regex-Filter) ---");
db.songs.find({ title: { $regex: /Love/i } }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 5. Abfrage auf `albums` mit Projektion, bei der _id ausgegeben wird
print("--- 5. Alben: Nur Titel und Band-Referenz ausgeben (Projektion MIT _id) ---");
db.albums.find({}, { title: 1, bandId: 1 }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 6. Abfrage auf `songs` mit Projektion, bei der _id ausgeschlossen wird
print("--- 6. Songs: Nur Titel und Dauer ausgeben (Projektion OHNE _id) ---");
db.songs.find({}, { title: 1, durationMin: 1, _id: 0 }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

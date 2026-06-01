// KN-M-04: Datenmanipulation und Abfragen II - A) Aggregationen
db = db.getSiblingDB("BandProject");

print("===============================================================================");
print("A) Aggregationen (50%)");
print("===============================================================================\n");

// 1. Aggregation mit $match (2 Filter nacheinander) statt find mit UND
print("--- 1. Gigs nach 1970 mit Ticketpreis > 5.0 ($match hintereinander) ---");
db.gigs.aggregate([
  { $match: { date: { $gt: new Date("1970-01-01") } } },
  { $match: { ticketPrice: { $gt: 5.0 } } }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 2. Abfrage mit $match, $project, $sort
print("--- 2. Songs länger als 3 Minuten ($match, $project, $sort) ---");
db.songs.aggregate([
  { $match: { durationMin: { $gt: 3.0 } } },
  { $project: { title: 1, durationMin: 1, _id: 0 } },
  { $sort: { durationMin: -1 } }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 3. Abfrage mit $sum
print("--- 3. Gesamtdauer der Songs pro Band ($sum) ---");
db.songs.aggregate([
  { $group: { _id: "$bandId", totalDurationMin: { $sum: "$durationMin" } } }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 4. Mindestens einmal $group (zusätzlich)
print("--- 4. Durchschnittliche Songdauer pro Band ($group) ---");
db.songs.aggregate([
  { $group: { _id: "$bandId", averageDurationMin: { $avg: "$durationMin" } } }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

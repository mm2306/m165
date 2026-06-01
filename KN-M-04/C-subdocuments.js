// KN-M-04: Datenmanipulation und Abfragen II - C) Unter-Dokumente / Arrays
db = db.getSiblingDB("BandProject");

print("===============================================================================");
print("C) Unter-Dokumente / Arrays (20%)");
print("===============================================================================\n");

// 1. Einfache Abfrage, die nur einzelne Felder der Unterdokumente ausgibt
print("--- 1. Nur einzelne Felder der Unterdokumente (Projektion auf Array) ---");
db.bands.find({}, { name: 1, "members.role": 1, _id: 0 }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 2. Eine Abfrage, die nach Feldern von Unterdokumenten filtert
print("--- 2. Bands, die einen Sänger (Vocalist) haben (Filterung auf Array) ---");
db.bands.find({ "members.role": "Vocalist" }).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 3. $unwind verwenden, um die Rückgabe zu verflachen
print("--- 3. Verflachen der Band-Mitglieder mit $unwind ---");
db.bands.aggregate([
  { $unwind: "$members" },
  { 
    $project: { 
      name: 1, 
      "members.role": 1, 
      "members.joinedDate": 1, 
      _id: 0 
    } 
  }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

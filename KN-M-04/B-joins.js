// KN-M-04: Datenmanipulation und Abfragen II - B) Join-Aggregation
db = db.getSiblingDB("BandProject");

print("===============================================================================");
print("B) Join-Aggregation (30%)");
print("===============================================================================\n");

// 1. Join mit $lookup
print("--- 1. Songs mit Band-Informationen (Join mit $lookup) ---");
db.songs.aggregate([
  {
    $lookup: {
      from: "bands",
      localField: "bandId",
      foreignField: "_id",
      as: "band_info"
    }
  }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

// 2. Eigene Abfrage mit $lookup, Filterung und anderen Aggregationen
print("--- 2. Alben von Led Zeppelin sortiert nach Veröffentlichungsdatum ---");
db.albums.aggregate([
  {
    $lookup: {
      from: "bands",
      localField: "bandId",
      foreignField: "_id",
      as: "band_info"
    }
  },
  { $unwind: "$band_info" },
  { $match: { "band_info.name": "Led Zeppelin" } },
  {
    $project: {
      title: 1,
      releaseDate: 1,
      "band_info.name": 1,
      _id: 0
    }
  },
  { $sort: { releaseDate: 1 } }
]).forEach(printjson);
print("\n-------------------------------------------------------------------------------\n");

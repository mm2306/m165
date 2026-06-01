#!/bin/bash

# KN-M-05 Backup and Restore Variant 2 (MongoDB Database Tools)

echo "=== 1. Backup erstellen mit mongodump ==="
mongodump --uri="mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=admin" --out=./backup
echo "Backup erfolgreich erstellt im Ordner ./backup"

echo "=== 2. Datenbank oder Collection löschen ==="
mongosh "mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=admin" --eval "db.songs.drop()"
echo "Collection 'songs' gelöscht."

echo "=== 3. Daten wiederherstellen mit mongorestore ==="
mongorestore --uri="mongodb://admin:MyPassword.45@3.212.243.189:27017/?authSource=admin" --dir=./backup
echo "Wiederherstellung erfolgreich abgeschlossen."

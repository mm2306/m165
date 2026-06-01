# KN-M-05: Administration von MongoDB

**Thema:** Music band · **Instanz:** `3.212.243.189` · **Datenbank:** `BandProject`

---

## A) Rechte und Rollen

### 1. Falsche Authentifizierungsquelle (`authSource`)

Wenn im Connection String eine falsche Datenbank als `authSource` angegeben wird (z. B. `authSource=test` anstelle von `admin`), schlägt die Authentifizierung fehl, da MongoDB die Benutzerdaten in der angegebenen Datenbank sucht und dort nicht findet.

**Beispielhafter Connection String mit Fehler:**
`mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=test`

![Fehler falsche Authentifizierungsquelle](screenshots/A1-auth-error.png)

### 2. Benutzer erstellen

Folgende Benutzer wurden gemäß den Vorgaben erstellt:
- **Benutzer 1 (`readUser`)**: Darf Daten nur lesen. Authentifizierungsdatenbank ist die Themendatenbank (`BandProject`). Rolle: `read`.
- **Benutzer 2 (`rwUser`)**: Darf Daten lesen und schreiben. Authentifizierungsdatenbank ist `admin`. Rolle: `readWrite`.

Das vollständige Skript zur Erstellung der Benutzer befindet sich in der Datei [`A-create-users.js`](./A-create-users.js).

**Benutzer 1 (readUser)**
![Benutzer 1 Login und Lesen erfolgreich](screenshots/A2-user1-read.png)
![Benutzer 1 Schreiben fehlgeschlagen](screenshots/A2-user1-write-error.png)

**Benutzer 2 (rwUser)**
![Benutzer 2 Login und Lesen erfolgreich](screenshots/A3-user2-read.png)
![Benutzer 2 Schreiben erfolgreich](screenshots/A3-user2-write.png)

---

## B) Backup und Restore

### Backup Variante 1 (AWS Snapshots)

1. **Snapshot erstellen:** Ein Snapshot des EBS-Volumens der EC2-Instanz wurde über die AWS Console erstellt.
2. **Daten löschen:** Die Collection `songs` wurde gelöscht.
3. **Restore:** Das Volumen wurde aus dem Snapshot wiederhergestellt und an die Instanz in derselben Availability Zone angehängt. Die Daten waren danach wieder verfügbar.

*(Screenshots zu Variante 1 befinden sich in `screenshots/B1-aws-*.png`)*

### Backup Variante 2 (`mongodump` & `mongorestore`)

1. **Backup erstellen:** 
   ```bash
   mongodump --uri="mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=admin" --out=/home/ubuntu/backup
   ```
2. **Datenbank löschen:**
   ```bash
   mongosh "mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=admin" --eval "db.dropDatabase()"
   ```
3. **Datenbank wiederherstellen:**
   ```bash
   mongorestore --uri="mongodb://admin:MyPassword.45@3.212.243.189:27017/?authSource=admin" --dir=/home/ubuntu/backup
   ```

**Status nach Backup (`mongodump`):**
![Backup erstellt](screenshots/B2-mongo-dump.png)

**Status nach Löschen:**
![Daten gelöscht](screenshots/B2-mongo-drop.png)

**Status nach Wiederherstellung (`mongorestore`):**
![Daten wiederhergestellt](screenshots/B2-mongo-restore.png)

---

## C) Skalierung

### Unterschied zwischen Replication und Partition (Shards)

**Replication (Replikation)**
Bei der Replikation werden die exakt gleichen Daten auf mehrere Server (ein sogenanntes Replica Set) kopiert. Es gibt in der Regel einen "Primary" (Hauptknoten), der Schreibvorgänge annimmt, und mehrere "Secondaries" (Neben-Knoten), die asynchron die Daten kopieren. 
*Ziel:* Hochverfügbarkeit (High Availability), Ausfallsicherheit (Fault Tolerance) und Skalierung von Lesezugriffen. Wenn ein Server ausfällt, übernimmt automatisch ein anderer Knoten, ohne dass Daten verloren gehen.

**Partitioning / Sharding**
Beim Sharding wird eine große Datenbank horizontal in mehrere Teile (Shards) aufgeteilt. Jeder Shard speichert nur eine Teilmenge der gesamten Daten, basierend auf einem sogenannten "Shard Key". 
*Ziel:* Skalierung der Speicherkapazität und des Schreib-Durchsatzes. Wenn die Datenmenge zu groß für einen einzelnen Server wird oder zu viele Schreiboperationen stattfinden, ermöglicht Sharding die Verteilung der Last auf viele Server.

### Empfehlung für die Firma

**Status Quo (Replica Set) vs. Sharding**

Basierend auf den aktuellen Anforderungen empfehle ich, als Architektur ein **Replica Set (Replikation)** beizubehalten (oder einzuführen, falls derzeit nur eine Single-Node-Instanz verwendet wird). 

*Begründung:*
Ein Replica Set mit mindestens drei Knoten (1 Primary, 2 Secondaries) bietet die notwendige Ausfallsicherheit, sodass bei einem Serverausfall die Applikation der Firma ohne spürbare Unterbrechung weiterläuft. Lese-intensive Abfragen können zudem auf die Secondaries umgeleitet werden, was die Performance verbessert.

Sharding sollte zum aktuellen Zeitpunkt **nicht** implementiert werden. Sharding bringt eine erhebliche infrastrukturelle und operative Komplexität mit sich (es werden Config-Server, Router und mehrere Shard-Knoten benötigt). Es lohnt sich erst dann, wenn unsere Datenmenge die Terabyte-Grenze überschreitet oder das Limit an vertikaler Skalierung (CPU, RAM, Festplatten-IO) für Schreiboperationen auf einem Server erreicht ist. Solange diese Limits nicht in Sicht sind, bietet die Replikation (ggf. kombiniert mit vertikaler Skalierung) die beste Balance aus Performance, Sicherheit und Wartbarkeit.

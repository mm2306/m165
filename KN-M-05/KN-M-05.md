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

### Backup Variante 1 (AWS Snapshots über AWS CLI)

Die folgenden Schritte wurden durchgeführt, um ein Backup und Restore der MongoDB-Datenbank über EBS-Snapshots mit dem AWS CLI zu simulieren:

1. **Ausgangslage prüfen (Collections & Datensätze):**
   Vor dem Backup wurde der Zustand der Datenbank überprüft. Es waren 4 Collections mit Daten vorhanden (`gigs`, `musicians`, `albums`, `bands`).
   
   ![Daten vor dem Backup](screenshots/B1-aws-01-data-before.png)

2. **Snapshot erstellen (Backup):**
   Über das AWS CLI wurde ein Snapshot des EBS-Volumens (`vol-08069f6daaed70624`) erstellt.
   
   ```bash
   aws ec2 create-snapshot --volume-id vol-08069f6daaed70624 --description "KN-M-05 MongoDB Backup Volume"
   ```
   
   ![Snapshot erstellen](screenshots/B1-aws-02-create-snapshot.png)

3. **Snapshot-Status prüfen:**
   Es wurde gewartet und überprüft, bis der Snapshot den Zustand `completed` (100% Fortschritt) erreicht hat.
   
   ```bash
   aws ec2 describe-snapshots --snapshot-ids snap-053a7735a5f7477d4
   ```
   
   ![Snapshot abgeschlossen](screenshots/B1-aws-03-snapshot-status.png)

4. **Daten löschen (Datenverlust simulieren):**
   In MongoDB wurde die Collection `gigs` gelöscht (dropped), um den Datenverlust zu simulieren.
   
   ```javascript
   db.gigs.drop()
   ```
   
   ![Collection gelöscht](screenshots/B1-aws-04-data-dropped.png)

5. **Wiederherstellung (Restore):**
   Um das Volumen aus dem Snapshot wiederherzustellen, wurde die EC2-Instanz gestoppt, das alte Volumen detached, ein neues Volumen aus dem Snapshot in derselben Availability Zone (`us-east-1b`) erstellt, an die Instanz angehängt und die Instanz wieder gestartet.

   * **Instanz stoppen:**
     ```bash
     aws ec2 stop-instances --instance-ids i-025ab126835c45f0d
     ```
     ![Instanz stoppen](screenshots/B1-aws-05-stop-instance.png)

   * **Altes Volumen detachen:**
     ```bash
     aws ec2 detach-volume --volume-id vol-08069f6daaed70624
     ```
     ![Volumen detachen](screenshots/B1-aws-06-detach-volume.png)

   * **Neues Volumen aus Snapshot erstellen:**
     ```bash
     aws ec2 create-volume --snapshot-id snap-053a7735a5f7477d4 --availability-zone us-east-1b --volume-type gp3
     ```
     ![Neues Volumen erstellen](screenshots/B1-aws-07-create-volume.png)

   * **Neues Volumen attachen (als /dev/sda1):**
     ```bash
     aws ec2 attach-volume --volume-id vol-0ed94feeabf5732d6 --instance-id i-025ab126835c45f0d --device /dev/sda1
     ```
     ![Neues Volumen attachen](screenshots/B1-aws-08-attach-volume.png)

   * **Instanz wieder starten:**
     ```bash
     aws ec2 start-instances --instance-ids i-025ab126835c45f0d
     ```
     ![Instanz starten](screenshots/B1-aws-09-start-instance.png)

6. **Daten wiederhergestellt:**
   Nach dem Neustart der Instanz wurde überprüft, ob die gelöschte Collection `gigs` wieder vorhanden ist und ihre Daten vollständig wiederhergestellt wurden.
   
   ![Daten erfolgreich wiederhergestellt](screenshots/B1-aws-10-data-restored.png)


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

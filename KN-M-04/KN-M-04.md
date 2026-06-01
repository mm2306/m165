# KN-M-04: Datenmanipulation und Abfragen II

**Thema:** Music band · **Instanz:** `3.212.243.189` · **Datenbank:** `BandProject`

**Abgabedateien:** [`A-aggregations.js`](./A-aggregations.js), [`B-joins.js`](./B-joins.js), [`C-subdocuments.js`](./C-subdocuments.js)

---

## Theoretische Fragen & Erklärungen

### 1. Connection String und `authSource=admin`
Um sich mit der MongoDB-Instanz zu verbinden, wird ein sogenannter Connection String verwendet, z. B.:
`mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=admin`

**Erklärung der Bestandteile:**
- `mongodb://`: Das Protokoll, das angibt, dass eine Verbindung zu einer MongoDB-Datenbank hergestellt wird.
- `admin:MyPassword.45`: Die Zugangsdaten (Benutzername und Passwort) zur Authentifizierung.
- `@3.212.243.189:27017`: Die IP-Adresse (oder der Hostname) des Servers und der Port (`27017` ist der Standard-Port für MongoDB).
- `/BandProject`: Die Zieldatenbank, die nach erfolgreicher Verbindung standardmäßig verwendet werden soll.
- `?authSource=admin`: Eine essenzielle Option, die MongoDB mitteilt, in welcher Datenbank die Anmeldeinformationen (Credentials) des Benutzers gespeichert sind. In diesem Fall ist der Benutzer `admin` in der Administrationsdatenbank (`admin`) angelegt, auch wenn die eigentlichen Abfragen auf der Datenbank `BandProject` ausgeführt werden. Ohne diese Angabe würde MongoDB standardmäßig versuchen, den Benutzer in der Zieldatenbank (`BandProject`) zu authentifizieren, was fehlschlagen würde.

---

## A) Aggregationen (50%)

Folgende Aggregationen wurden umgesetzt:
1. Sequenzielle Filterung mit zwei `$match`-Stages anstelle einer `$and`-Verknüpfung.
2. Abfrage mit `$match`, `$project` und `$sort` (Songs über 3 Minuten Länge).
3. Gruppierung mit `$sum`, um die Gesamtlänge der Songs pro Band zu berechnen.
4. Gruppierung mit `$avg`, um die durchschnittliche Songdauer pro Band zu ermitteln.

### Screenshot der Ausführung
![A - Aggregationen](screenshots/A-aggregations.png)
*Ausgabe des Skripts `A-aggregations.js`*

---

## B) Join-Aggregation (30%)

Folgende Join-Aggregationen wurden umgesetzt:
1. Ein einfacher `$lookup`, um die Songs mit den jeweiligen Band-Dokumenten anzureichern.
2. Ein `$lookup` auf die Alben mit anschließendem `$unwind` und `$match` zur Filterung auf "Led Zeppelin", inklusive einer aufgeräumten `$project`-Struktur und `$sort`.

### Screenshot der Ausführung
![B - Joins](screenshots/B-joins.png)
*Ausgabe des Skripts `B-joins.js`*

---

## C) Unter-Dokumente / Arrays (20%)

Folgende Abfragen auf Unterdokumente/Arrays wurden umgesetzt:
1. Eine Projektion, die gezielt nur einzelne Felder aus den eingebetteten `members`-Dokumenten zurückgibt (`members.role`).
2. Eine Filterung (`find()`), die prüft, ob im Array `members` ein Subdokument existiert, dessen Feld `role` den Wert "Vocalist" hat.
3. Die Verwendung von `$unwind`, um das `members`-Array aufzulösen (verflachen) und pro Mitglied ein eigenes resultierendes Dokument zurückzugeben.

### Screenshot der Ausführung
![C - Unterdokumente](screenshots/C-subdocuments.png)
*Ausgabe des Skripts `C-subdocuments.js`*

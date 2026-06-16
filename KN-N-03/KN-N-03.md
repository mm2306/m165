# KN-N-03: Programmierung mit Neo4j (Java Client)

## 1. Projektstruktur & Setup

Für das Projekt wurde ein strukturiertes Maven-Projekt in Java 21 erstellt.

### Dateibaum des Projekts:
```text
KN-N-03/
├── app/
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/
│               └── ch/
│                   └── tbz/
│                       └── kn03/
│                           └── Neo4jApp.java
└── screenshots/
    ├── 01_java_run.png
    └── 02_neo4j_verify.png
```

### Maven Konfiguration (`pom.xml`)
In der `pom.xml` ist die offizielle Neo4j Java Driver Dependency (`neo4j-java-driver`) eingebunden:

```xml
<dependency>
    <groupId>org.neo4j.driver</groupId>
    <artifactId>neo4j-java-driver</artifactId>
    <version>5.18.0</version>
</dependency>
```

---

## 2. Java-Implementierung (`Neo4jApp.java`)

Das Java-Programm verbindet sich über das `bolt`-Protokoll mit der Neo4j-Instanz auf Port `7688` (mit Benutzer `neo4j` und Passwort `testpassword`), löscht bestehende Daten und fügt ein zusammenhängendes Netzwerk von Musikern, Bands, Songs, Alben und Auftritten (Gigs) basierend auf dem Band-Projekt aus KN-N-01 / KN-M-03 ein. Danach listet es alle Songs von Led Zeppelin auf.

```java
package ch.tbz.kn03;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.neo4j.driver.Record;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;

public class Neo4jApp {

    private static final String URI = "bolt://localhost:7688";
    private static final String USER = "neo4j";
    private static final String PASSWORD = "testpassword";

    public static void main(String[] args) {
        System.out.println("Connecting to Neo4j database at " + URI + "...");
        
        try (Driver driver = GraphDatabase.driver(URI, AuthTokens.basic(USER, PASSWORD))) {
            
            // Verbindung verifizieren
            driver.verifyConnectivity();
            System.out.println("Connection successful!");

            try (Session session = driver.session()) {
                
                // 1. Bestehende Knoten und Beziehungen löschen (Clean State)
                System.out.println("Clearing existing database nodes and relationships...");
                session.executeWrite(tx -> {
                    tx.run("MATCH (n) DETACH DELETE n");
                    return null;
                });

                // 2. Testdaten einfügen (Band-Projekt)
                System.out.println("Inserting musician, band, song, album and gig nodes with relationships...");
                session.executeWrite(tx -> {
                    String createQuery = 
                        "CREATE " +
                        "  (m1:Musician {musicianId: 'm1', stageName: 'Jimmy Page', mainInstrumentCode: 'G', email: 'jimmy.page@ledzeppelin.com'}), " +
                        "  (m2:Musician {musicianId: 'm2', stageName: 'Robert Plant', mainInstrumentCode: 'V', email: 'robert.plant@ledzeppelin.com'}), " +
                        "  (m3:Musician {musicianId: 'm3', stageName: 'John Paul Jones', mainInstrumentCode: 'B', email: 'jpj@ledzeppelin.com'}), " +
                        "  (m4:Musician {musicianId: 'm4', stageName: 'John Bonham', mainInstrumentCode: 'D', email: 'bonzo@ledzeppelin.com'}), " +
                        "  (m5:Musician {musicianId: 'm5', stageName: 'Freddie Mercury', mainInstrumentCode: 'V', email: 'freddie@queen.com'}), " +
                        "   " +
                        "  (b1:Band {bandId: 'b1', name: 'Led Zeppelin', formedDate: date('1968-09-01'), genre: 'Hard Rock'}), " +
                        "  (b2:Band {bandId: 'b2', name: 'Queen', formedDate: date('1970-06-01'), genre: 'Rock'}), " +
                        "  (b3:Band {bandId: 'b3', name: 'The Who', formedDate: date('1964-01-01'), genre: 'Rock'}), " +
                        "   " +
                        "  (s1:Song {songId: 's1', title: 'Stairway to Heaven', durationMin: 8.02, bpm: 73}), " +
                        "  (s2:Song {songId: 's2', title: 'Whole Lotta Love', durationMin: 5.34, bpm: 90}), " +
                        "  (s3:Song {songId: 's3', title: 'Kashmir', durationMin: 8.28, bpm: 80}), " +
                        "  (s4:Song {songId: 's4', title: 'Bohemian Rhapsody', durationMin: 5.55, bpm: 72}), " +
                        "  (s5:Song {songId: 's5', title: 'Another One Bites the Dust', durationMin: 3.35, bpm: 110}), " +
                        "  (s6:Song {songId: 's6', title: 'We Will Rock You', durationMin: 2.01, bpm: 81}), " +
                        "   " +
                        "  (a1:Album {albumId: 'a1', title: 'Led Zeppelin IV', releaseDate: date('1971-11-08'), format: 'LP'}), " +
                        "  (a2:Album {albumId: 'a2', title: 'Led Zeppelin II', releaseDate: date('1969-10-22'), format: 'LP'}), " +
                        "  (a3:Album {albumId: 'a3', title: 'A Night at the Opera', releaseDate: date('1975-11-21'), format: 'LP'}), " +
                        "  (a4:Album {albumId: 'a4', title: 'The Game', releaseDate: date('1980-06-30'), format: 'LP'}), " +
                        "   " +
                        "  (g1:Gig {gigId: 'g1', venue: 'Madison Square Garden', date: date('1973-07-27'), ticketPrice: 7.50}), " +
                        "  (g2:Gig {gigId: 'g2', venue: 'Wembley Stadium', date: date('1986-07-12'), ticketPrice: 14.50}), " +
                        "  (g3:Gig {gigId: 'g3', venue: 'Royal Albert Hall', date: date('1970-01-09'), ticketPrice: 3.00}), " +
                        "   " +
                        "  (m1)-[:IS_MEMBER_OF {role: 'Guitarist', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m2)-[:IS_MEMBER_OF {role: 'Vocalist', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m3)-[:IS_MEMBER_OF {role: 'Bassist', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m4)-[:IS_MEMBER_OF {role: 'Drummer', joinedDate: date('1968-09-01')}]->(b1), " +
                        "  (m5)-[:IS_MEMBER_OF {role: 'Lead Vocalist', joinedDate: date('1970-06-01')}]->(b2), " +
                        "   " +
                        "  (s1)-[:PERFORMED_BY]->(b1), " +
                        "  (s2)-[:PERFORMED_BY]->(b1), " +
                        "  (s3)-[:PERFORMED_BY]->(b1), " +
                        "  (s4)-[:PERFORMED_BY]->(b2), " +
                        "  (s5)-[:PERFORMED_BY]->(b2), " +
                        "  (s6)-[:PERFORMED_BY]->(b2), " +
                        "   " +
                        "  (a1)-[:INCLUDES {trackNo: 4, isBonus: false}]->(s1), " +
                        "  (a2)-[:INCLUDES {trackNo: 1, isBonus: false}]->(s2), " +
                        "  (a3)-[:INCLUDES {trackNo: 11, isBonus: false}]->(s4), " +
                        "  (a4)-[:INCLUDES {trackNo: 3, isBonus: false}]->(s5), " +
                        "   " +
                        "  (b1)-[:PERFORMED_AT]->(g1), " +
                        "  (b1)-[:PERFORMED_AT]->(g3), " +
                        "  (b2)-[:PERFORMED_AT]->(g2)";
                    tx.run(createQuery);
                    return null;
                });
                System.out.println("Data successfully inserted!");

                // 3. Daten abfragen (Songs von Led Zeppelin)
                System.out.println("\nQuerying: Songs performed by Led Zeppelin...");
                session.executeRead(tx -> {
                    Result result = tx.run(
                        "MATCH (s:Song)-[:PERFORMED_BY]->(b:Band {name: 'Led Zeppelin'}) " +
                        "RETURN s.title AS title, s.durationMin AS duration " +
                        "ORDER BY s.title"
                    );
                    
                    while (result.hasNext()) {
                        Record record = result.next();
                        String title = record.get("title").asString();
                        double duration = record.get("duration").asDouble();
                        System.out.printf(" - %s (%.2f min)\n", title, duration);
                    }
                    return null;
                });
            }
            
        } catch (Exception e) {
            System.err.println("An error occurred during database operations:");
            e.printStackTrace();
        }
        
        System.out.println("\nExecution complete.");
    }
}
```

---

## 3. Ausführung & Validierung

### Projekt ausführen (Anleitung)
Um das Java-Neo4j-Projekt auszuführen, gehen Sie wie folgt vor:

1. **In das Verzeichnis `app` wechseln:**
   ```bash
   cd KN-N-03/app
   ```
2. **Kompilieren und Ausführen:**
   * **Option A: Mit der lokalen Maven-Installation aus KN-C-03:**
     ```bash
     ../../KN-C-03/maven/bin/mvn clean compile
     ../../KN-C-03/maven/bin/mvn exec:java
     ```
   * **Option B: Mit einer globalen Maven-Installation (falls vorhanden):**
     ```bash
     mvn clean compile
     mvn exec:java
     ```

### Screenshot 1: Ausführung des Java-Programms
Das Programm wurde über Maven ausgeführt:

![Java Run Output](./screenshots/01_java_run.png)

### Screenshot 2: Verifizierung in der Graphdatenbank
Nach Ausführung des Programms wurden die Knotenzahlen und Inhalte direkt über `cypher-shell` verifiziert:

![Neo4j Verify Output](./screenshots/02_neo4j_verify.png)

---

## 4. Theorie-Fragen (Connection Strings & Protokolle)

### Connection Strings allgemein
Ein **Connection String** (Verbindungszeichenfolge) ist eine standardisierte URI-Struktur (Uniform Resource Identifier), die Client-Bibliotheken alle notwendigen Konfigurationsparameter bereitstellt, um eine Netzwerkverbindung zu einem Datenbankserver aufzubauen. Er enthält mindestens:
- Das **Protokoll / Schema** (z. B. `mongodb://`, `bolt://`)
- Optionale **Authentifizierungsdaten** (Username & Passwort)
- Den **Hostnamen** bzw. die IP-Adresse und den **Port** des Servers
- Optionale Pfadangaben (z. B. die Standard-Datenbank) sowie weitere **Query-Parameter** (z. B. SSL/TLS-Optionen, Timeout-Einstellungen oder Authentifizierungsquellen).

---

### Was bewirkt `authSource=admin` im MongoDB-Kontext?
In MongoDB ist die Benutzerverwaltung dezentral organisiert. Benutzerkonten werden innerhalb bestimmter logischer Datenbanken angelegt. Wenn sich ein Client authentifiziert, muss MongoDB wissen, in welcher Datenbank die Benutzerdaten und Berechtigungsrollen dieses Benutzers gespeichert sind.

- Der Parameter `authSource=admin` legt fest, dass MongoDB den übergebenen Benutzernamen in der administrativen Datenbank **`admin`** suchen soll, um das Passwort und die Berechtigungen abzugleichen.
- Dies ist vor allem dann wichtig, wenn der Benutzer Administrationsrechte besitzt oder übergreifenden Zugriff auf mehrere Anwendungsdatenbanken benötigt (z. B. ein Superuser), aber Daten in einer anderen Datenbank liest/schreibt.
- Falls `authSource` nicht definiert ist, nimmt MongoDB standardmäßig die in der Verbindungs-URI angegebene Zieldatenbank als Authentifizierungsdatenbank an, was bei administrativen Benutzern zu Authentifizierungsfehlern führen kann.
- *Referenz:* Offizielle MongoDB-Dokumentation: [MongoDB Connection String Options - authSource](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.authSource)

---

### Die Neo4j Connection-URI (`bolt://localhost:7688`)
In unserem Projekt wird die URI `bolt://localhost:7688` zur Verbindung mit Neo4j verwendet. Die einzelnen Komponenten bedeuten:

1. **`bolt://`**: 
   - Das **Bolt-Protokoll** ist ein von Neo4j entwickeltes, binäres Protokoll, das speziell für Graphdatenbanksysteme entworfen wurde. Es ist hochperformant, verbindungsorientiert und serialisiert Graphdaten äusserst effizient über TCP.
   - Neben `bolt://` gibt es auch `neo4j://` (welches automatische Routing-Funktionalitäten in Clustern unterstützt).
2. **`localhost`**: 
   - Der Host-Name, der darauf hinweist, dass der Datenbankserver auf derselben Maschine läuft wie das Client-Programm (Loopback-Adresse `127.0.0.1`).
3. **`7688`**: 
   - Der spezifische TCP-Port, auf dem der Bolt-Server der containerisierten Neo4j-Instanz lauscht. Standardmässig lauscht Bolt auf Port `7687`, hier wurde er jedoch auf `7688` konfiguriert, um Konflikte mit dem lokalen Host-Daemon zu vermeiden.
- *Referenz:* Offizielle Neo4j-Dokumentation: [Neo4j Connection URIs & Protocols](https://neo4j.com/docs/operations-manual/current/configuration/connectors/)

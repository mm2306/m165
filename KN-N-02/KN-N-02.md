# KN-N-02: Datenabfrage und -Manipulation in Neo4j

## A) Daten hinzufügen

Für die initialen Daten wurde ein einzelnes, umfangreiches `CREATE`-Statement verwendet, welches mehrere Filme, Personen und deren Beziehungen zueinander erstellt.

### Cypher-Statement

```cypher
CREATE 
  (m1:Movie {title: 'The Matrix', released: 1999, tagline: 'Welcome to the Real World'}),
  (m2:Movie {title: 'Inception', released: 2010, tagline: 'Your mind is the scene of the crime'}),
  (m3:Movie {title: 'Interstellar', released: 2014, tagline: 'Mankind was born on Earth. It was never meant to die here.'}),
  (m4:Movie {title: 'The Dark Knight', released: 2008, tagline: 'Why So Serious?'}),
  
  (p1:Person {name: 'Keanu Reeves', born: 1964}),
  (p2:Person {name: 'Carrie-Anne Moss', born: 1967}),
  (p3:Person {name: 'Leonardo DiCaprio', born: 1974}),
  (p4:Person {name: 'Matthew McConaughey', born: 1969}),
  (p5:Person {name: 'Christopher Nolan', born: 1970}),
  (p6:Person {name: 'Christian Bale', born: 1974}),
  
  (p1)-[:ACTED_IN {roles: ['Neo']}]->(m1),
  (p2)-[:ACTED_IN {roles: ['Trinity']}]->(m1),
  (p3)-[:ACTED_IN {roles: ['Cobb']}]->(m2),
  (p5)-[:DIRECTED]->(m2),
  (p4)-[:ACTED_IN {roles: ['Cooper']}]->(m3),
  (p5)-[:DIRECTED]->(m3),
  (p6)-[:ACTED_IN {roles: ['Bruce Wayne']}]->(m4),
  (p5)-[:DIRECTED]->(m4);
```

### Ausführung (Screenshot)

![Daten hinzufügen - Ausführung](./screenshots/A_insert.png)

---

## B) Daten abfragen

### Theoretische Frage: `OPTIONAL MATCH`

**Die Fragestellung:** In der Theorie haben Sie ein Statement gesehen, um alle Knoten und Kanten zu lesen (`MATCH (n) OPTIONAL MATCH (n)-[r]->(m) RETURN n,r,m`). Erklären Sie das Statement im Detail, speziell auch die `OPTIONAL MATCH` Klausel.

**Erklärung:**
Das Statement zielt darauf ab, den vollständigen Inhalt der Datenbank abzurufen, unabhängig davon, ob Beziehungen existieren oder nicht.
- `MATCH (n)`: Sucht zunächst nach allen Knoten in der Datenbank und weist sie der Variablen `n` zu.
- `OPTIONAL MATCH (n)-[r]->(m)`: Dies ist das Äquivalent zu einem `LEFT OUTER JOIN` in SQL. Es sucht nach ausgehenden Beziehungen `r` von dem Knoten `n` zu einem Zielknoten `m`. Wenn für einen Knoten `n` keine solche Beziehung existiert, gibt Cypher nicht einfach ein leeres Ergebnis für `n` zurück. Stattdessen bleibt `n` erhalten, während `r` und `m` mit `null` (also "leer") gefüllt werden. 
- `RETURN n, r, m`: Gibt alle gefundenen Knoten, Beziehungen und Zielknoten zurück. Ohne `OPTIONAL MATCH` (also nur `MATCH (n)-[r]->(m)`) würden isolierte Knoten ohne jegliche Kanten im Ergebnis komplett fehlen.

### Szenarien zur Datenabfrage

**Szenario 1:** Wir möchten herausfinden, welche Filme von "Christopher Nolan" inszeniert wurden.
```cypher
MATCH (p:Person)-[:DIRECTED]->(m:Movie) 
WHERE p.name = 'Christopher Nolan' 
RETURN m.title;
```

**Szenario 2:** Wir suchen nach allen in der Datenbank erfassten Personen, die nach dem Jahr 1970 geboren wurden (Verwendung der `WHERE`-Klausel für Filterung).
```cypher
MATCH (p:Person) 
WHERE p.born > 1970 
RETURN p.name, p.born;
```

**Szenario 3:** Wir suchen nach der genauen Rolle (`roles` Array auf der Beziehung) und dem Filmtitel für alle Schauspieler, die in Filmen mitgewirkt haben, die nach dem Jahr 2000 veröffentlicht wurden (Filtern von Eigenschaften auf Zielknoten).
```cypher
MATCH (p:Person)-[r:ACTED_IN]->(m:Movie) 
WHERE m.released > 2000 
RETURN p.name, r.roles, m.title;
```

**Szenario 4:** Wir möchten alle Filme auflisten, deren Titel mit dem Artikel "The" beginnt.
```cypher
MATCH (m:Movie) 
WHERE m.title STARTS WITH 'The' 
RETURN m.title, m.released;
```

### Ausführung (Screenshot)

![Daten abfragen - Ausführung](./screenshots/B_queries.png)

---

## C) Daten löschen

Die Klausel `DETACH DELETE` löscht nicht nur den angegebenen Knoten, sondern **zwingend auch alle damit verbundenen Beziehungen (Kanten)**. Wird nur `DELETE` auf einem Knoten verwendet, der noch über Beziehungen verfügt, bricht die Datenbank die Transaktion mit einer Fehlermeldung ab, um inkonsistente Zustände (sogenannte "Dangling Edges") zu vermeiden.

### Vorbereitung (Testdaten)
Für diesen Test wurden zuvor zwei Dummy-Filme und zwei Dummy-Schauspieler inklusive Beziehungen erstellt.

### Test 1: Löschen OHNE `DETACH`

**Vorher (Ausgangslage):**
![Test 1 Vorher](./screenshots/C_vorher_1.png)

**Statement & Fehlgeschlagene Ausführung:**
Wir versuchen, den Knoten zu löschen, ohne die bestehenden Beziehungen zu entfernen. Dies löst einen Fehler aus.
```cypher
MATCH (m:Movie {title: 'Dummy Movie 1'}) DELETE m;
```
![Test 1 Delete (Ohne Detach)](./screenshots/C_delete_without_detach.png)

**Nachher:**
Wie erwartet, existiert der Knoten weiterhin, da die Datenbank die Löschung verweigert hat.
![Test 1 Nachher](./screenshots/C_nachher_1.png)

### Test 2: Löschen MIT `DETACH`

**Vorher (Ausgangslage):**
![Test 2 Vorher](./screenshots/C_vorher_2.png)

**Statement & Erfolgreiche Ausführung:**
Wir verwenden nun `DETACH DELETE`. Die Datenbank löscht zuerst die Beziehungen (z.B. `ACTED_IN`) und anschliessend den Knoten.
```cypher
MATCH (m:Movie {title: 'Dummy Movie 2'}) DETACH DELETE m;
```
![Test 2 Delete (Mit Detach)](./screenshots/C_delete_with_detach.png)

**Nachher:**
Der Knoten und die zugehörigen Beziehungen wurden erfolgreich und restlos aus der Datenbank entfernt.
![Test 2 Nachher](./screenshots/C_nachher_2.png)

---

## D) Daten verändern

Wir aktualisieren die bestehenden Datensätze anhand von drei spezifischen Anwendungsfällen.

**Szenario 1:** Dem Film "Inception" soll nachträglich ein neues Attribut `rating` hinzugefügt werden, um eine Bewertung darzustellen.
```cypher
MATCH (m:Movie {title: 'Inception'}) 
SET m.rating = 8.8 
RETURN m;
```

**Szenario 2:** Bei der Beziehung zwischen Christian Bale und "The Dark Knight" soll die Eigenschaft `roles` aktualisiert werden, um präzise auf "Batman" zu verweisen. Dies demonstriert das Verändern von Eigenschaften auf Kanten (Beziehungen).
```cypher
MATCH (p:Person {name: 'Christian Bale'})-[r:ACTED_IN]->(m:Movie {title: 'The Dark Knight'}) 
SET r.roles = ['Batman'] 
RETURN r;
```

**Szenario 3:** Der Titel des Originalfilms "The Matrix" soll zu "The Matrix 1" umbenannt werden.
```cypher
MATCH (m:Movie {title: 'The Matrix'}) 
SET m.title = 'The Matrix 1' 
RETURN m;
```

### Ausführung (Screenshot)

![Daten verändern - Ausführung](./screenshots/D_queries.png)

---

## E) Zusätzliche Klauseln

Wir beleuchten zwei weitere, leistungsstarke Cypher-Klauseln: `UNWIND` und `WITH` (inkl. der Aggregationsfunktion `count()`).

### 1. `UNWIND`
Die `UNWIND`-Klausel dekonstruiert eine Liste (Array) in einzelne Werte (Zeilen). Dies ist besonders nützlich, wenn man Arrays aus externen Quellen erhält und für jedes Element der Liste eine Operation (wie z.B. einen `CREATE`-Befehl) ausführen möchte.

**Szenario:** Wir möchten in einem einzigen Durchlauf drei neue Schauspieler hinzufügen, deren Namen uns als kompakte Liste vorliegen.
```cypher
UNWIND ['Tom Hardy', 'Cillian Murphy', 'Michael Caine'] AS actorName
CREATE (p:Person {name: actorName}) 
RETURN p;
```

### 2. `WITH` (inklusive Aggregation)
Die `WITH`-Klausel fungiert wie ein Pipe-Operator oder ein temporäres `RETURN` innerhalb einer laufenden Abfrage. Sie erlaubt es, Variablen an den nächsten Teil der Query weiterzugeben, Zwischenergebnisse zu berechnen, zu aggregieren (z.B. zu zählen) oder zu sortieren, bevor die eigentliche Filterung (`WHERE`) oder Rückgabe (`RETURN`) stattfindet. 

**Szenario:** Wir möchten alle Regisseure finden, die **mehr als einen** Film inszeniert haben. Wir zählen (`count(m)`) die inszenierten Filme pro Person und geben das Zwischenergebnis (`directedCount`) mit `WITH` weiter, um im Anschluss mit `WHERE directedCount > 1` danach filtern zu können.
```cypher
MATCH (p:Person)-[:DIRECTED]->(m:Movie) 
WITH p, count(m) AS directedCount 
WHERE directedCount > 1 
RETURN p.name, directedCount;
```

### Ausführung (Screenshot)

![Zusätzliche Klauseln - Ausführung](./screenshots/E_queries.png)



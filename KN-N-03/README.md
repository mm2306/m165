# KN-N-03: Programmierung mit Neo4j (Java)

Dieses Projekt demonstriert den programmatischen Zugriff auf eine Neo4j Graphdatenbank mit Java und dem offiziellen Neo4j Java-Treiber.

## Voraussetzungen
- **Java JDK 21+** installiert
- **Neo4j Container/Datenbank** läuft und ist erreichbar (z.B. unter `bolt://localhost:7687`)

## Projekt ausführen

Wechsle zuerst in das Unterverzeichnis `app/`:
```bash
cd KN-N-03/app
```

### Option A: Mit dem portablen Maven aus dem KN-C-03 Ordner
Da im workspace ein lokales Maven in `KN-C-03/maven` vorhanden ist, kannst du dieses relativ referenzieren:

```bash
# Projekt bereinigen und kompilieren
../../KN-C-03/maven/bin/mvn clean compile

# Java-Programm ausführen
../../KN-C-03/maven/bin/mvn exec:java
```

### Option B: Mit einer globalen Maven-Installation
Falls Maven auf deinem System global installiert ist (`mvn` im Pfad):

```bash
# Projekt bereinigen und kompilieren
mvn clean compile

# Java-Programm ausführen
mvn exec:java
```

## Programm-Funktionen
Beim Starten führt die Klasse `ch.tbz.kn03.Neo4jApp` Cypher-Queries aus, um Daten im Graphen abzufragen und zu manipulieren, und gibt die Resultate auf der Konsole aus.

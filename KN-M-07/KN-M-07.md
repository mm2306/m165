# KN-M-07: Programmierung mit MongoDB

## 1. Einführung und Zielsetzung
In diesem Kompetenznachweis (KN) greifen wir mithilfe einer Programmiersprache auf eine bestehende MongoDB-Datenbank zu. Als Programmiersprache wird **Python** in Kombination mit der offiziellen Bibliothek **`pymongo`** verwendet, um eine Verbindung herzustellen und einfache CRUD-Operationen (Create, Read, Delete) auszuführen.

## 2. Verbindung zur Datenbank (Connection String)

Um eine erfolgreiche Verbindung mit der Datenbank aufzubauen, verwenden wir in verteilten Umgebungen typischerweise einen Connection String dieses Formats:
`mongodb://admin:MyPassword.45@3.212.243.189:27017/BandProject?authSource=admin`
Für die lokale Ausführung im Rahmen dieser Abgabe wurde auf `mongodb://localhost:27017/` zurückgegriffen.

### Bedeutung von `authSource=admin`
Der Parameter `?authSource=admin` ist entscheidend, wenn die Anmeldeinformationen (Credentials) eines Benutzers nicht in der Datenbank gespeichert sind, auf die er operativ zugreifen möchte, sondern in einer zentralen Administrationsdatenbank. 

In MongoDB ist es gängige Praxis, administrative oder mandantenübergreifende Benutzer in der speziellen `admin` Datenbank anzulegen. Ohne die explizite Angabe von `authSource=admin` würde der MongoDB-Treiber standardmäßig versuchen, den Benutzer (z. B. `admin`) in der Zieldatenbank (hier `BandProject`) zu authentifizieren. Da der Benutzer dort nicht existiert, würde die Authentifizierung mit einem `Authentication failed` Fehler fehlschlagen.

> [!NOTE]
> Weitere Informationen zur Authentifizierungsquelle finden Sie in der offiziellen MongoDB-Dokumentation: [Authentication Database / authSource](https://www.mongodb.com/docs/manual/reference/connection-string/#mongodb-urioption-urioption.authSource).

## 3. Implementierung (Python mit PyMongo)

Das folgende Python-Skript (`mongo_test.py`) stellt die Verbindung her und führt die Operationen auf der `musicians` Collection aus. Da diese Collection (wie im vorherigen KN-M-06 konfiguriert) ein striktes JSON-Schema verwendet, müssen die eingefügten Dokumente den vorgegebenen Validierungsregeln entsprechen (`stageName`, `mainInstrumentCode` sowie ein korrektes E-Mail-Format in `email`).

```python
import pymongo

try:
    # Verbindung zur lokalen Instanz herstellen
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    client.admin.command('ping')
    print("Connected successfully to local MongoDB!")
    
    db = client["BandProject"]
    collection = db["musicians"]
    
    # 1. Create (Insert)
    result = collection.insert_one({
        "stageName": "Test Python", 
        "mainInstrumentCode": "P",
        "email": "python@mongo.local"
    })
    print(f"Inserted document with ID: {result.inserted_id}")
    
    # 2. Read (Find)
    doc = collection.find_one({"stageName": "Test Python"})
    print(f"Found document: {doc}")
    
    # 3. Delete (Cleanup)
    collection.delete_one({"_id": result.inserted_id})
    print("Cleaned up test document.")
    
except Exception as e:
    print(f"Connection failed: {e}")
```

## 4. Ausführung und Ergebnisse

### Projekt ausführen (Anleitung)
Um das Python-Skript auszuführen, gehen Sie wie folgt vor:

1. **In das Projektverzeichnis wechseln:**
   ```bash
   cd KN-M-07
   ```
2. **Erforderliche Abhängigkeiten installieren (falls nicht bereits vorhanden):**
   ```bash
   pip install pymongo
   ```
3. **Skript ausführen:**
   ```bash
   python mongo_test.py
   ```

### Screenshot: Erfolgreiche Ausführung
Das Skript wurde erfolgreich in der Terminalumgebung ausgeführt. Das Dokument konnte der Collection hinzugefügt, fehlerfrei ausgelesen und abschließend wieder gelöscht werden. Die Schema-Validierung der Datenbank wurde dabei erfolgreich respektiert.

![Python MongoDB Test Ausführung](./screenshots/01_python_mongodb_test.png)

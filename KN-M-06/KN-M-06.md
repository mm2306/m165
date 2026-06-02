# KN-M-06: JSON Schema und Collection Validierung - Abgabe

## A) JSON Schemas erstellen

Die JSON-Schemas und Beispiel-Inhalte wurden für jede der fünf geplanten Collections (`musicians`, `bands`, `songs`, `albums`, `gigs`) der `BandProject` Datenbank erstellt. 

## B) Validierung hinterlegen und testen

### Befehle zur Administration von Validierungen

**1. Neue Rolle für die Administration von Validierungen hinzufügen**
Um einem Benutzer die Berechtigung zu geben, Validierungen hinzuzufügen, wird das Privileg `collMod` (Collection Modify) benötigt. 

```javascript
db.createRole({
  role: "validationAdmin",
  privileges: [
    {
      resource: { db: "BandProject", collection: "" },
      actions: ["collMod"]
    }
  ],
  roles: []
});

db.grantRolesToUser("admin", ["validationAdmin"]);
```

**2. Validierungen hinzufügen**
Die Validierung kann mit dem `collMod` Befehl zu einer bestehenden Collection hinzugefügt werden:

```javascript
db.runCommand({
  collMod: "musicians",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["stageName", "mainInstrumentCode", "email"],
      properties: {
        stageName: { bsonType: "string" },
        mainInstrumentCode: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+$" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});
```

**3. Bestehende Validierungen auslesen**
Mit folgendem Befehl lassen sich die bestehenden Validierungsregeln einer Collection anzeigen:

```javascript
db.getCollectionInfos({ name: "musicians" });
```

### Theoretische Konzepte & Connection String Erläuterung

> **Connection String Parameter: `authSource=admin`**
> Bei der Verbindung mit MongoDB via `mongosh "mongodb://user:password@host:27017/BandProject?authSource=admin"` wird der Parameter `authSource` verwendet.
> 
> **Was bewirkt `authSource=admin`?**
> Dieser Parameter teilt MongoDB mit, in welcher Datenbank die Authentifizierungsdaten (Benutzername und Passwort) des Benutzers gespeichert sind. Standardmäßig sucht MongoDB in der Datenbank, mit der man sich verbinden möchte (im Beispiel `BandProject`).
> 
> **Warum ist dieser Parameter hier korrekt?**
> In MongoDB ist es eine "Best Practice", administrative Benutzer und zentrale Accounts in der speziellen `admin` Datenbank anzulegen. Auch wenn der Benutzer nur auf `BandProject` zugreifen soll, wurden seine Anmeldedaten zentral im `admin`-Katalog hinterlegt. Ohne `authSource=admin` würde MongoDB versuchen, den Benutzer in der `BandProject` Datenbank zu authentifizieren, was fehlschlagen würde.


### Screenshots zur Verifizierung

**1. Screenshot der erfolgreichen Validierungs-Zuweisung**
Dieser Screenshot zeigt, wie die Validierung via `collMod` hinzugefügt und über `getCollectionInfos` erfolgreich ausgelesen wird.

![Validierung hinzugefügt](../screenshots/01_validation_added.png)

**2. Screenshot der Validierungs-Tests (Gültig vs. Ungültig)**
Dieser Screenshot verifiziert, dass korrekte Dokumente akzeptiert werden, während ungültige Dokumente (z.B. falsches E-Mail Format) durch den Schema-Validator blockiert werden (`MongoServerError: Document failed validation`).

![Validierung Test](../screenshots/02_validation_test.png)

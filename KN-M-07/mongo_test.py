import pymongo

try:
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    # Test connection
    client.admin.command('ping')
    print("Connected successfully to local MongoDB!")
    
    # Use a database
    db = client["BandProject"]
    collection = db["musicians"]
    
    # Insert data
    result = collection.insert_one({
        "stageName": "Test Python", 
        "mainInstrumentCode": "P",
        "email": "python@mongo.local"
    })
    print(f"Inserted document with ID: {result.inserted_id}")
    
    # Find data
    doc = collection.find_one({"stageName": "Test Python"})
    print(f"Found document: {doc}")
    
    # Cleanup
    collection.delete_one({"_id": result.inserted_id})
    print("Cleaned up test document.")
except Exception as e:
    print(f"Connection failed: {e}")

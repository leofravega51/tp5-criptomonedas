from pymongo import MongoClient

def connectionDB(host, port, database):
    try:
        client = MongoClient(host, port)
        db = client.get_database(database)
        return db
    except:
        raise

mongodb_encripted = connectionDB('encripteddb', 27017, 'mongoencripteddb')
mongodb_decripted = connectionDB('decripteddb', 27017, 'mongodecripteddb')




from flask import Flask, jsonify
from mongo.connectionDB import mongodb_encripted, mongodb_decripted
from flask_cors import CORS
from agent.agent import getCriptoCoins, dataHashing, restartDatabase, searchCriptoCurrency, topCoins, deleteCriptoCurrency, searchByRank


app = Flask(__name__)
CORS(app)


@app.route('/cripto_coins', methods=["GET"])
def showGetCriptoCoins():
    """Obtenemos las cripto monedas y las retornamos en formato json"""
    
    criptocoins = getCriptoCoins() 
    
    return jsonify(criptocoins)

@app.before_first_request
def before_first_request():
    """Inicializamos la base de datos previamente a cualquier consulta"""

    response = restartDatabase()
    return response

@app.route('/cripto_coin/<ranking>', methods=["GET"])
def searchCriptoCoinByRank(ranking):

    query = searchByRank(ranking)
    return jsonify(query)

@app.route('/cripto_coins/searchCriptoCoin/<name>')
def searchCriptoCoin(name):

    query = searchCriptoCurrency(name)
    return jsonify(query)

@app.route('/cripto_coins/top5')
def top5():
    """Obtenemos el top 5 de criptomonedas"""
    top5 = topCoins(5)
    return jsonify(top5)

@app.route('/cripto_coins/top20')
def top20():
    """Obtenemos el top 20 de criptomonedas"""
    top20 = topCoins(20)
    return jsonify(top20)

@app.route('/cripto_coins/delete/<ranking>', methods=["GET"])
def deleteCriptoCoin(ranking):
    """Eliminamos una criptomoneda por su campo ranking"""
    response = deleteCriptoCurrency(ranking)
    return response

if __name__ == "__main__":
    app.run(host='backend', port='5000', debug=True)


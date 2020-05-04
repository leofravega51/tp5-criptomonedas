import requests
from flask import jsonify
from mongo.connectionDB import mongodb_decripted, mongodb_encripted
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import hashlib
import json

coinmarketcap_base_path = 'https://pro-api.coinmarketcap.com'
coinmarketcap_key = '135c9cb7-864a-4d01-a2d5-d45fbebe031b'
limit = 500


def getCriptoCoins():
    """Comparamos los datos de ambas bd para evaluar si fueron alterados y luego los retornamos"""
    try:
        decripted_criptocoins = list(mongodb_decripted.coin_decripted.find({}, {'_id': 0}))
        encripted_criptocoins = list(mongodb_encripted.coin_encripted.find({'ranking': decripted_criptocoins[0]['cmc_rank']}, {'_id': 0}))

        if(dataHashing(decripted_criptocoins[0]) == encripted_criptocoins[0]['data']):
            return decripted_criptocoins
        else:
            return False    #Datos invalidos o corruptos

    except (ConnectionError, Timeout, TooManyRedirects) as e:
        return e

def topCoins(top_number):
    """Devolvemos el top <top_number> de criptomonedas"""

    coins = list(mongodb_decripted.coin_decripted.find({}, {'_id': 0}).limit(top_number))
    # print(top20_coins, flush=True)
    return coins


def dataHashing(coin):
    """Encriptamos los datos obtenidos de la API de coinmarketcap"""
    coin_string = json.dumps(coin)
    encripted_coin = hashlib.sha512(coin_string.encode()).hexdigest()
    # print(encripted_coin, flush=True)

    return encripted_coin

def restartDatabase():
    """Obtenemos las cripto monedas de coinmarketcap y las guardamos en las bbdd"""
    try:   
        # Eliminamos todas las colecciones existentes en las bbdd antes de consumirlas de coinmarketcap
        mongodb_decripted.coin_decripted.drop()
        mongodb_encripted.coin_encripted.drop()

        # Obtenemos las criptomonedas de coinmarketcap
        response = requests.get(f'{coinmarketcap_base_path}/v1/cryptocurrency/listings/latest?limit={limit}&CMC_PRO_API_KEY={coinmarketcap_key}')
        decripted_criptocoins = response.json()['data']

        for dcc in decripted_criptocoins:
            dcc['circulating_supply'] = str(dcc['circulating_supply'])
            dcc['cmc_rank'] = str(dcc['cmc_rank'])
            dcc['id'] = str(dcc['id'])
            dcc['max_supply'] = str(dcc['max_supply'])
            dcc['num_market_pairs'] = str(dcc['num_market_pairs'])
            dcc['quote']['USD']['market_cap'] = str(dcc['quote']['USD']['market_cap'])
            dcc['quote']['USD']['percent_change_1h'] = str(dcc['quote']['USD']['percent_change_1h'])
            dcc['quote']['USD']['percent_change_24h'] = str(dcc['quote']['USD']['percent_change_24h'])
            dcc['quote']['USD']['percent_change_7d'] = str(dcc['quote']['USD']['percent_change_7d'])
            dcc['quote']['USD']['price'] = str(dcc['quote']['USD']['price'])
            dcc['quote']['USD']['volume_24h'] = str(dcc['quote']['USD']['volume_24h'])
            dcc['total_supply'] = str(dcc['total_supply'])


        # Guardamos los datos encriptados de cada criptomoneda con sha512
        mongodb_encripted.coin_encripted.insert_many([{'ranking':  dcc['cmc_rank'],'data' : dataHashing(dcc)} for dcc in decripted_criptocoins])

        # Insertamos todas las criptomonedas sin encriptar en su respectiva bbdd
        mongodb_decripted.coin_decripted.insert_many(decripted_criptocoins)
        return "Reinitialize OK"
    except:
        raise

def searchByRank(rank):
    """Buscamos una criptomoneda por su ranking"""
    try:
        """Parseamos el objeto tipo cursor que nos devuelve mongo y lo convertimos a lista para acceder a los atributos"""
        decripted_response = list(mongodb_decripted.coin_decripted.find({'cmc_rank' : rank}, {'_id': 0}))
        if(len(decripted_response)==0):
            return "Error, no existe una criptomoneda en dicho ranking"
        else:
            encripted_response = list(mongodb_encripted.coin_encripted.find({'ranking': decripted_response[0]['cmc_rank']}, {'_id': 0}))

            if(dataHashing(decripted_response[0]) == encripted_response[0]['data']):
                return decripted_response
            else:
                return False
    except:
        raise


def searchCriptoCurrency(name):
    """Realizamos la busqueda de una criptomoneda mediante su nombre"""
    try:
        """Parseamos el objeto tipo cursor que nos devuelve mongo y lo convertimos a lista para acceder a los atributos"""
        decripted_response = list(mongodb_decripted.coin_decripted.find({'name' : name}, {'_id': 0}))
        if(len(decripted_response)==0):
            return "Error, la criptomoneda no existe!"
        else:
            encripted_response = list(mongodb_encripted.coin_encripted.find({'ranking': decripted_response[0]['cmc_rank']}, {'_id': 0}))

            if(dataHashing(decripted_response[0]) == encripted_response[0]['data']):
                return decripted_response
            else:
                return False
    except:
        raise

def deleteCriptoCurrency(ranking):
    """Eliminamos una criptomoneda mediante su campo id"""
 
    if((int(ranking) >= 0) and (int(ranking) <= limit)):
        decripted_response = list(mongodb_decripted.coin_decripted.find({'cmc_rank': ranking}, {'_id': 0}))
        encripted_response = list(mongodb_encripted.coin_encripted.find({'ranking': ranking}, {'_id': 0}))

        if(dataHashing(decripted_response[0]) == encripted_response[0]['data']):
            """Eliminamos la criptomoneda con ranking=<rank> de ambas bases de datos"""
            mongodb_decripted.coin_decripted.delete_one({'cmc_rank': ranking})
            mongodb_encripted.coin_encripted.delete_one({'ranking': ranking})

            return "Delete OK"
    else:
        return "Error! Indice fuera de rango."

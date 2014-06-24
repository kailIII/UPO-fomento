from api import app
from flask import jsonify, request
import json
import collections
from model.IndicadorModel import IndicadorModel

@app.route('/indicador/<int:idIndicador>/', methods = ['GET'])
@app.route('/indicador/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicador(idIndicador, fecha=None):    
    ui = IndicadorModel()
    indicador = ui.getIndicador(idIndicador, fecha)
    indicador["datos"] = []
    datos = ui.getDato(indicador["sql_dato"])
    for dato in datos:
        indicador["datos"].append(collections.OrderedDict(dato)) 
 
    indicador.pop("sql_dato", None)
    return jsonify(indicador)

@app.route('/numIndicadores', methods = ['GET'])
def getNumIndicadores(fecha=None):    
    ui = IndicadorModel()
    return jsonify({"result":ui.getNumIndicadores()}) 



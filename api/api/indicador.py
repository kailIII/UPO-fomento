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
    return jsonify(indicador)

@app.route('/indicador_capas/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicadorLayers(idIndicador, fecha):    
    ui = IndicadorModel()
    indicador = ui.getIndicadorLayers(idIndicador, fecha)
    return jsonify(indicador)


@app.route('/indicador_data/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicadorData(idIndicador, fecha):    
   ui = IndicadorModel()
   indicador = ui.getIndicadorData(idIndicador, fecha)
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


@app.route('/centroid/<string:tabla>/<string:columnaId>', methods = ['GET'])
def getIndicadorDataCentroid(tabla,columnaId):  
    ui = IndicadorModel()
    centroid = ui.getCentroid(tabla,columnaId.split("@")[0],columnaId.split("@")[1])
    return jsonify(centroid)



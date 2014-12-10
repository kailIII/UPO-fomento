from api import app
from flask import jsonify, request
import json
import collections
from model.IndicadorModel import IndicadorModel
import re

@app.route('/indicador/<int:idIndicador>/', methods = ['GET'])
@app.route('/indicador/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicador(idIndicador, fecha=None):    
    ui = IndicadorModel()
    indicador = ui.getIndicador(idIndicador, fecha)
    # Si es un indicador de tipo flecha
    if(indicador["sql_centroid_flechas"]):
      # if(indicador["json_flechas"]):
        # indicador["row_centroids"] = eval(indicador["json_flechas"])
      # else:
      indicador["sql_centroid_flechas"] = indicador["sql_centroid_flechas"].replace("centroid_origen", "ST_Y(st_transform(centroid_origen,4326)) as lat_origen, ST_X(st_transform(centroid_origen,4326)) as lng_origen")
      indicador["sql_centroid_flechas"] = indicador["sql_centroid_flechas"].replace("centroid_destino", "ST_Y(st_transform(centroid_destino,4326)) as lat_destino, ST_X(st_transform(centroid_destino,4326)) as lng_destino")
      indicador["row_centroids"] = ui.getDato(indicador["sql_centroid_flechas"])
      datos = ui.getDato(indicador["sql_dato"])
      if len(datos) > 0:
        indicador["uni"] = re.sub(r'(###).*(###)', "", sorted(datos[0].keys())[-1])

      for position, dato in enumerate(datos):
        indicador["row_centroids"][position].update({"origin_value" : dato[sorted(dato.keys())[-1]], "destination" : dato[sorted(dato.keys())[-2]], "origin" : dato[sorted(dato.keys())[-3]]})

      # Construyo la topologia
      topologia = []
      for aux in indicador["row_centroids"]:
        save = True;
        for topo in topologia:
          if(topo["lat_origen"] == aux["lat_destino"] and topo["lng_origen"] == aux["lng_destino"] and topo["lat_destino"] == aux["lat_origen"] and topo["lng_destino"] == aux["lng_origen"]):
            topo["destination_value"] = aux["origin_value"]
            save = False
            break
        if save:
          topologia.append(aux)

      indicador["row_centroids"] = topologia
      # ui.updateRow(indicador["cod_indicador"],str(topologia))

      del indicador["sql_centroid_flechas"]
      # del indicador["json_flechas"]
      del indicador["sql_dato"]

    return jsonify(indicador)

@app.route('/indicador_capas/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicadorLayers(idIndicador, fecha):    
    ui = IndicadorModel()
    indicador = ui.getIndicadorLayers(idIndicador, fecha)
    return jsonify({"result":indicador})


@app.route('/indicador_data/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicadorData(idIndicador, fecha):
   result = {} 
   ui = IndicadorModel()
   indicadores = ui.getIndicadorData(idIndicador, fecha)
   sql = "";
   if len(indicadores) > 0:
      result = {"cod_indicador" : indicadores[0]["cod_indicador"], "leyendas" : "", 
                "name_familia" : indicadores[0]["name_familia"], "name_indicador" : indicadores[0]["name_indicador"], 
                "tabla_geom" : indicadores[0]["tabla_geom"], "width" : indicadores[0]["width"], "datos":[]}
      
      if len(indicadores) == 1:
        sql =  indicadores[0]["sql_dato"]
        result["leyendas"] = indicadores[0]["leyenda"]
      else:
        sql = "select * from("
        for indicador in indicadores:
          sql += "(" + indicador["sql_dato"] + ") as \"" + indicador["fecha"] + "\" NATURAL JOIN "
          if(indicador["leyenda"]):
            result["leyendas"] += indicador["leyenda"] + ","

        sql = sql[:-13]
        sql += ")"
        result["leyendas"] = result["leyendas"][:-1] 

      datos = ui.getDato(sql)
      for dato in datos:
        result["datos"].append(collections.OrderedDict(dato)) 
        
   return jsonify(result)

@app.route('/indicador_graphics/<int:idIndicador>/<string:fecha>', methods = ['GET'])
def getIndicadorGraphics(idIndicador, fecha):    
   ui = IndicadorModel()
   indicadores = ui.getIndicadorGraphics(idIndicador, fecha)
   result = {}
   for indicador in indicadores:
      result[indicador["gid"]] = {"properties": {"type": indicador["tipo"], "title": indicador["title"]}, "imagen": indicador["imagen"], "data":[]}
      if indicador["sql_dato"]:
        datos = ui.getDato(indicador["sql_dato"])
        for dato in datos:
          result[indicador["gid"]]["data"].append(collections.OrderedDict(dato)) 
 
   return jsonify(result)

@app.route('/numIndicadores', methods = ['GET'])
def getNumIndicadores(fecha=None):    
    ui = IndicadorModel()
    return jsonify({"result":ui.getNumIndicadores()}) 


@app.route('/centroid/<string:tabla>/<string:columnaId>', methods = ['GET'])
def getIndicadorDataCentroid(tabla,columnaId):  
    ui = IndicadorModel()
    centroid = ui.getCentroid(tabla,columnaId.split("@")[0],columnaId.split("@")[1])
    return jsonify(centroid)




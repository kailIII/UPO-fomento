from api import app
from flask import jsonify, request
import json
from model.IndicadorModel import IndicadorModel

@app.route('/indicadores', methods = ['GET'])

def getIndicadores():    
     ui = IndicadorModel()
#     incidencias = ui.getIncidencias(limit, offset, search)
#     
#     for incidencia in incidencias:
#         image = ui.getFirstImage(incidencia['id_incidencia'])
#         if(image):
#             incidencia["thumbnail"] = app.config["imageUrl"] + "/" + str(image["id_imagen"]) +"_thumbnail.jpg"
#         else:
#             incidencia["thumbnail"] = ""
          
#     return jsonify({"results": incidencias})
     return jsonify({"results": "true"})



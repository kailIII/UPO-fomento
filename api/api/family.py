from api import app
from flask import jsonify, request
import json
import collections
from model.FamilyModel import FamilyModel

@app.route('/families', methods = ['GET'])
def getFamilies():    
    ui = FamilyModel()
    
    return jsonify({"result": ui.getFamilyList()})


@app.route('/cartoTem', methods = ['GET'])
def getCartoTem():    
    ui = FamilyModel()
    
    return jsonify({"result": ui.getCartoTemListByFamyly()})


@app.route('/mapBase', methods = ['GET'])
def getMapBase():    
    ui = FamilyModel()
    
    return jsonify({"result": ui.mapBaseList()})



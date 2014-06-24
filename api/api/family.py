from api import app
from flask import jsonify, request
import json
import collections
from model.FamilyModel import FamilyModel

@app.route('/families', methods = ['GET'])
def getFamilies():    
    ui = FamilyModel()
    
    return jsonify({"result": ui.getFamilyList()})


@app.route('/familiesMap', methods = ['GET'])
def getFamiliesMap():    
    ui = FamilyModel()
    
    return jsonify({"result": ui.getFamilyMapList()})



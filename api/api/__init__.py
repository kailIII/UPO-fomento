from flask import Flask, jsonify

app = Flask(__name__)
app.config.update(
    DEBUG=True,
    SECRET_KEY='oN;2R@a-Y&opIY'
)



import home
import indicador
import family
import proxy

@app.route('/', methods = ['GET'])                                            
def alive():
    return jsonify( { "status" : "running"})

from flask import Flask, render_template, request, jsonify, send_from_directory,url_for,make_response
from chat import get_response
from getQr import makeQr 
import io
import pyqrcode 
app = Flask(__name__)

@app.get("/")
def index_get():
  return render_template("index.html")

@app.post("/predict")
def predict():
  text = request.get_json().get("message")
  reponse = get_response(text)
  message = {"answer": reponse}
  return jsonify(message)

@app.post("/getQr")
def getQr():
  text = request.get_json().get("message")
  print(text)
  url = pyqrcode.create(text)
  buffer = io.BytesIO()
  url.png(buffer, scale=5)
  buffer.seek(0)
  response = make_response(buffer.getvalue())
  response.headers.set('Content-Type', 'image/png')
  response.headers.set('Content-Disposition', 'inline', filename='qrcode.png')
  return response
if __name__ == "__main__":
  app.run(debug=True)
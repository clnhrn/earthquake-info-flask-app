from flask import Flask, render_template, jsonify
import requests
from datetime import date, timedelta

app = Flask(__name__)


default_start_date = (date.today() - timedelta(days=1)).strftime("%Y-%m-%d")
default_end_date = date.today().strftime("%Y-%m-%d")
URL = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={default_start_date}&endtime={default_end_date}"


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/earthquakes")
def earthquakes():
    response = requests.get(URL)
    return jsonify(response.json())


if __name__ == "__main__":
    app.run(debug=True)

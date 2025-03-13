from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def startseite():
    return render_template('startseite.html')

if __name__ == '__main__':
    app.run(debug = True)
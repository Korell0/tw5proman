from flask import Flask, render_template, url_for,session,request,make_response,redirect
from util import json_response

import data_handler

app = Flask(__name__)
app.secret_key = '12345'


@app.route('/set-cookie')
def cookie_insertion():
    redirect_to_index = redirect('/')
    response = make_response(redirect_to_index)
    response.set_cookie('cookie-name', value='values')
    return response


@app.route('/registration',methods=["GET","POST"])
def registration():
    if request.method == "POST":
        if " " not in request.form["username"] and " " not in request.form["password"] \
                and request.form["username"] is not "" and request.form["password"] is not "":
            if request.form["username"] in data_handler.get_usernames_from_database():
                error = "This username is already in use"
                return render_template("index.html", error=error)
            data_handler.registration(request.form["username"], request.form["password"])
            session["username"]=request.form["username"]
            username = session["username"]
            return render_template("index.html" , username=username)
        error = "Wrong characters..."
        return render_template("index.html", error=error)


@app.route('/login',methods=["GET","POST"])
def login():
    if request.method == "POST":
        if data_handler.get_hash_from_database(request.form["username"]) is not None:
            database_password = data_handler.get_hash_from_database(request.form["username"])
            verify_password = data_handler.verify_password(request.form["password"], database_password["hashed_password"])
            if verify_password:
                session["username"] = request.form["username"]
                print(session["username"])
                return render_template("index.html", username=session["username"])
        error = "Invalid username or password"
        return render_template("index.html", error=error)
    return render_template("index.html")


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    session["username"] = None
    username = session["username"]
    return render_template('index.html', username=username)


@app.route("/get-boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return data_handler.get_data_from_boards()


@app.route("/get-statuses")
@json_response
def get_statuses():
    return data_handler.get_data_from_status()


@app.route("/get-cards")
@json_response
def get_cards():
    return data_handler.get_data_from_cards();


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

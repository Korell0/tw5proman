from flask import Flask, render_template, url_for, session, request, make_response, redirect
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


def is_valid_registration():
    return " " not in request.form["username"] and\
           " " not in request.form["password"] and\
           request.form["username"] is not "" and\
           request.form["password"] is not ""


@app.route('/registration', methods=["POST"])
def registration():
    if is_valid_registration():
        if request.form["username"] in data_handler.get_usernames_from_database():
            error = "This username is already in use"
        data_handler.registration(request.form["username"], request.form["password"])
        session["username"] = request.form["username"]
    error = "Wrong characters..."
    return redirect("/")


@app.route('/new-board')
def new_board():
    data_handler.create_new_board()
    return redirect("/")


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == "POST":
        if data_handler.get_hash_from_database(request.form["username"]) is not None:
            database_password = data_handler.get_hash_from_database(request.form["username"])
            verify_password = data_handler.verify_password(request.form["password"],
                                                           database_password["hashed_password"])
            if verify_password:
                session["username"] = request.form["username"]
                print(session["username"])
                return redirect("/")
        error = "Invalid username or password"
        return render_template("index.html", error=error)
    return render_template("index.html")


@app.route('/logout')
def logout():
    session.clear()
    return redirect("/")


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    username = session.get("username")
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


"""
@app.route("/get-cards")
@json_response
def get_cards():
    return data_handler.get_data_from_cards()
"""


@app.route("/remove-card/<int:card_id>", methods=["POST"])
@json_response
def remove_card_by_id(card_id: int):
    data_handler.remove_card_by_id(card_id)
    return {}


@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return data_handler.get_cards_for_board(board_id)


@app.route("/add-card", methods=['POST'])
@json_response
def add_card():
    data = request.get_json()
    _id = data["id"]
    cardTitle = data["cardTitle"]
    boardId = data["boardId"]
    statusId = data["statusId"]
    order = data["order"]
    data_handler.add_new_card(_id, cardTitle, boardId, statusId, order)
    return {}


@app.route("/change_board_title", methods=['POST'])
def change_board_title():
    data = request.get_json()
    title = data["title"]
    id = data["id"]
    data_handler.change_board_title(id, title)
    return {}


@app.route("/remove-board", methods=["POST"])
def remove_board():
    board_id = request.get_json()
    data_handler.remove_board_by_id(board_id)
    return {}


@app.route("/get-biggest-cardid")
@json_response
def get_biggest_cardid():
    return data_handler.get_biggest_cardid()


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()

from flask import Flask, render_template, url_for
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    # data_handler.insert_board_data(1,"Board 1")
    # data_handler.insert_board_data(2, "Board 2")
    # data_handler.insert_card_data(1,1,"new card 1",0,0)
    # data_handler.insert_card_data(2,1,"new card 2",0,1)
    # data_handler.insert_card_data(3,1,"in progress card",1,0)
    # data_handler.insert_card_data(4,1,"planning",2,0)
    # data_handler.insert_card_data(5,1,"done card 1",3,0)
    # data_handler.insert_card_data(6,1,"done card 1",3,1)
    # data_handler.insert_card_data(7,2,"new card 1",0,0)
    # data_handler.insert_card_data(8,2,"new card 2",0,1)
    # data_handler.insert_card_data(9,2,"in progress card",1,0)
    # data_handler.insert_card_data(10,2,"planning",2,0)
    # data_handler.insert_card_data(11,2,"done card 1",3,0)
    # data_handler.insert_card_data(12,2,"done card 1",3,1)
    # data_handler.insert_status_data(0, "new")
    # data_handler.insert_status_data(1,"in progress")
    # data_handler.insert_status_data(2, "testing")
    # data_handler.insert_status_data(3,"done")
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


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

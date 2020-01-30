import persistence
import database_common
import bcrypt


@database_common.connection_handler
def insert_board_data(cursor,id,title):
    cursor.execute("""
                    INSERT INTO boards
                    VALUES ( %(id)s,%(title)s)                
            """,
                   {"id": id,
                    "title": title
                    }
                   )

@database_common.connection_handler
def insert_card_data(cursor,id,board_id,title,status_id,order):
    cursor.execute("""
                    INSERT INTO cards
                    VALUES ( %(id)s,%(board_id)s,%(title)s,%(status_id)s,%(order)s)                
            """,
                   {"id": id,
                    "board_id":board_id,
                    "title": title,
                    "status_id":status_id,
                    "order": order
                    }
                   )

@database_common.connection_handler
def insert_status_data(cursor,id,title):
    cursor.execute("""
                    INSERT INTO status
                    VALUES ( %(id)s,%(title)s)                
            """,
                   {"id": id,
                    "title": title
                    }
                   )


@database_common.connection_handler
def get_data_from_boards(cursor):
    cursor.execute("""
    SELECT * FROM boards; 
    """)
    data = cursor.fetchall()
    return data


@database_common.connection_handler
def get_data_from_status(cursor):
    cursor.execute("""
    SELECT * FROM status; 
    """)
    data = cursor.fetchall()
    return data


@database_common.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""
    SELECT * FROM cards WHERE board_id = %(board_id)s; 
    """, {"board_id": board_id})
    data = cursor.fetchall()
    return data

@database_common.connection_handler
def remove_card_by_id(cursor, card_id):
    cursor.execute("""
    DELETE FROM cards WHERE id = %(card_id)s; 
    """, {"card_id": card_id})

def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence.get_boards()


# FullBoardDisplay
# def get_cards_for_board(board_id):
#     persistence.clear_cache()
#     all_cards = persistence.get_cards()
#     matching_cards = []
#     for card in all_cards:
#         if card['board_id'] == str(board_id):
#             card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
#             matching_cards.append(card)
#     return matching_cards


def get_cards_for_board(board_id):
    persistence.clear_cache()
    all_cards = persistence.get_cards()
    matching_cards = []
    for card in all_cards:
        if card['board_id'] == str(board_id):
            card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
            matching_cards.append(card)
    return matching_cards


@database_common.connection_handler
def get_usernames_from_database(cursor):
    cursor.execute("""
                    SELECT user_name FROM users
                    """,)
    names = cursor.fetchall()
    return [item["user_name"] for item in names]


@database_common.connection_handler
def get_username_by_user_id(cursor,user_id):
    cursor.execute("""
                SELECT user_name FROM users
                WHERE id = %(user_id)s
    """,
                   {"user_id":user_id})
    username = cursor.fetchone()
    return username


@database_common.connection_handler
def get_hash_from_database(cursor,username):
    cursor.execute("""
                SELECT hashed_password FROM users
                WHERE user_name = %(username)s
    """,
                   {"username": username})
    hash = cursor.fetchone()
    return hash


def get_hash_from_password(password):
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    decoded_hash = hashed_password.decode('utf-8')
    return decoded_hash


def verify_password(password, hash):
    hashed_bytes_password = hash.encode('utf-8')
    return bcrypt.checkpw(password.encode('utf-8'), hashed_bytes_password)


@database_common.connection_handler
def registration(cursor,username,password):
    hashed_bytes = get_hash_from_password(password)
    cursor.execute("""
                    INSERT INTO users (user_name,hashed_password)
                    VALUES (%(username)s,%(hashed_bytes)s);
                   """,
                   {"username": username,
                    "hashed_bytes": hashed_bytes})


@database_common.connection_handler
def get_username_by_user_id(cursor,userid):
    cursor.execute("""
                SELECT user_name FROM users
                WHERE id = %(userid)s
    """,
                   {"userid": userid})


import persistance


def clear_cache():
    for k in list(_cache.keys()):
        _cache.pop(k)


def get_statuses():
    return persistance.get_data_from_status()


def get_boards():
    return persistance.get_data_from_boards()


def get_cards():
    return persistance.get_data_from_cards()


def delete_card(card_id):
    return persistance.remove_card_by_id(card_id)


def get_usernames_from_database():
    return persistance.get_usernames_from_database()


def registration(username,password):
    return persistance.registration(username,password)


def get_hash_from_database(username):
    return persistance.get_hash_from_database(username)


def verify_password(password,hashed_password):
    return persistance.verify_password(password, hashed_password)


def get_data_from_boards():
    return persistance.get_data_from_boards()


def get_data_from_status():
    return persistance.get_data_from_status()


def remove_card_by_id(card_id):
    return persistance.remove_card_by_id(card_id)


def get_cards_for_board(board_id):
    return persistance.get_cards_for_board(board_id)






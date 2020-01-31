import persistance
# STATUSES_FILE = './data/statuses.csv'
# BOARDS_FILE = './data/boards.csv'
# CARDS_FILE = './data/cards.csv'
#
# _cache = {}  # We store cached data in this dict to avoid multiple file readings
#
#
# def _read_csv(file_name):
#     """
#     Reads content of a .csv file
#     :param file_name: relative path to data file
#     :return: OrderedDict
#     """
#     with open(file_name) as boards:
#         rows = csv.DictReader(boards, delimiter=',', quotechar='"')
#         formatted_data = []
#         for row in rows:
#             formatted_data.append(dict(row))
#         return formatted_data


# def _get_data(data_type, file, force):
#     """
#     Reads defined type of data from file or cache
#     :param data_type: key where the data is stored in cache
#     :param file: relative path to data file
#     :param force: if set to True, cache will be ignored
#     :return: OrderedDict
#     """
#     if force or data_type not in _cache:
#         _cache[data_type] = _read_csv(file)
#     return _cache[data_type]


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



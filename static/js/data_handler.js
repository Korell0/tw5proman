// this object contains the functions which handle the data and its reading/writing
// feel free to extend and change to fit your needs

// (watch out: when you would like to use a property/function of an object from the
// object itself then you must use the 'this' keyword before. For example: 'this._data' below)
export let dataHandler = {
    _data: {}, // it contains the boards and their cards and statuses. It is not called from outside.
    _listOfBoardIds: [],
    _listOfCardIds: [],
    _api_get: function (url, callback) {
        // it is not called from outside
        // loads data from API, parses it and calls the callback with it

        fetch(url, {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())  // parse the response as JSON
        .then(json_response => callback(json_response));  // Call the `callback` with the returned object
    },
    _api_post: function (url, data, callback) {
        let cnt = 0;
            // it is not called from outside
            // sends the data to the API, and calls callback function
            console.log(cnt);
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())  // parse the response as JSON
            .then(json_response => {
                console.log(json_response);
                if (callback) {
                    callback(json_response)
                }
            });
            cnt += 1;  // Call the callback with the returned object
    },
    init: function () {
    },
    getBoards: function (callback) {
        // the boards are retrieved and then the callback function is called with the boards

        // Here we use an arrow function to keep the value of 'this' on dataHandler.
        //    if we would use function(){...} here, the value of 'this' would change.
        this._api_get('/get-boards', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getBoard: function (boardId, callback) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: function (callback) {
        // the statuses are retrieved and then the callback function is called with the statuses
        this._api_get('/get-statuses', (response) => {
            this._data = response;
            callback(response);
        });
    },
    getStatus: function (statusId, callback) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: function (board_id, callback) {
        this._api_get(`/get-cards/${board_id}`, (response) => {
            this._data = response;
            callback(response);
        });
    },
    getCard: function (cardId, callback) {
        // the card is retrieved and then the callback function is called with the card
    },
    createNewBoard: function (boardTitle, callback) {
        // creates new board, saves it and calls the callback function with its data
    },
    createNewCard: function (cardData, callback) {
        this._api_post(`/add-card`, cardData);
        callback();
    },
    removeCardById: function (cardId) {
        this._api_post(`/remove-card/${cardId}`,null,(response) => {
            this._data = response;
    })
    },
    changeBoardTitle: function (boardId, text) {
        this._api_post("/change_board_title", {"title": text, "id":boardId});
    },
    removeBoard: function (boardId, callback) {
        this._api_post("/remove-board", boardId);
        callback();
    },
    getBiggestCardId: function () {
        this._api_get("/get-biggest-cardid", response => {
            return response;
        });
    }
};

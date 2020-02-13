// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
            dom.loadStatuses(function () {
                    for (let board of boards) {
                        dom.loadCards(board.id, function () {
                            let removeButtons = document.querySelectorAll(".card-remove");
                            for (let button of removeButtons) {
                                button.addEventListener("click", function () {
                                    dataHandler.removeCardById(this.parentNode.dataset.cardid
                                    );
                                    this.parentNode.remove()
                                });
                            }
                        })
                    }
                }
            );
        });
    },

    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for (let board of boards) {
            boardList += `
                <section class="board" id="board${board.id}" data-boardId="${board.id}">
                
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button type="button" class="board-remove">X</button>
                        <button type="button" class="board-toggle" data-toggle="collapse" data-target="#columns${board.id}"><i>V</i></button>
                    </div>
                    <div class="collapse" id="columns${board.id}">
                        <div class="board-columns">
                        </div>
                    </div>
                </section>
            `;
            dataHandler._listOfBoardIds.push(board.id);
        }

        const outerHtml = `
            <ul class="board-container">
                ${boardList}
            </ul>
        `;

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.insertAdjacentHTML("beforeend", outerHtml);

        let addCardButtons = document.querySelectorAll(".board-add");
        for (let button of addCardButtons) {
            button.addEventListener("click", function () {
                let biggestId = Math.max(...dataHandler._listOfCardIds);
                if (Number.isInteger(biggestId) === false){
                    biggestId = dataHandler.getBiggestCardId().id;
                }
                let cardData = {
                    "id": biggestId+1,
                    "cardTitle": "New card",
                    "boardId": parseInt(button.parentNode.parentNode.dataset.boardid),
                    "statusId": 0,
                    "order": 0
                };
                dataHandler.createNewCard(cardData,
                    function () {
                        dom.addNewCard(cardData)
                    }
                )
            })
        }

        let removeBoardButtons = document.querySelectorAll(".board-remove");
        for (let button of removeBoardButtons) {
            button.addEventListener("click", function () {
                let boardId = button.parentNode.parentNode.dataset.boardid;
                dataHandler.removeBoard(boardId, function () {
                    document.getElementById(`${boardId}`).remove();
                });
            })
        }

        let editableTitle = document.querySelectorAll(".board-title");
        for (let title of editableTitle) {
            title.addEventListener("click", dom.eventHandler)
        }
    },
    loadStatuses: function (callback) {
        dataHandler.getStatuses(function (statuses) {
            dom.showStatuses(statuses);
            callback();
        });
    },
    showStatuses: function (statuses) {
        let newColumns = "";

        for (let status of statuses)
            newColumns += `
                        <div class="board-column">
                            <div class="board-column-title">${status.title}</div>
                                <div class="board-column-content" data-statusId="${status.id}">
                                </div>
                            </div>
                        </div>
            `;

        let boardColumns = document.querySelectorAll(".board-columns");
        for (let board of boardColumns) {
            board.insertAdjacentHTML("afterbegin", newColumns);
        }
    },
    loadCards: function (boardId, callback) {
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
            callback();
        })
    },
    showCards: function (cards) {
        console.log(cards);

        let cardDiv = "";
        let boards = document.querySelectorAll(".board");
        for (let card of cards) {
            cardDiv = `
            <div class="card" id="card${card.id}" data-cardId="${card.id}">
                <div class="card-remove">X</div>

                <div class="card-title">${card.title}</div>
            </div>
            `;

            dataHandler._listOfCardIds.push(card.id);
            console.log(dataHandler._listOfCardIds);

            for (let board of boards) {
                if (parseInt(board.dataset.boardid) === card.board_id) {
                    let containers = board.querySelectorAll(".board-column-content");
                    for (let container of containers) {
                        if (parseInt(container.dataset.statusid) === card.status_id) {
                            container.insertAdjacentHTML("beforeend", cardDiv);
                        }
                    }
                }
            }
        }
    },
    editDiv: function (div) {
        let text = div.innerText;
        let input = document.createElement("INPUT");
        input.value = text;

        div.innerHTML = "";
        div.append(input);
        input.focus();
        input.addEventListener("focusout", function (event) {
            text = div.querySelector("input").value;
            if (text === "") {
                text = "Click to edit name";
            }
            div.innerHTML = text;
            dataHandler.changeBoardTitle(div.parentNode.parentNode.dataset.boardid, text);
            div.addEventListener("click", dom.eventHandler)
        });

        div.removeEventListener("click", dom.eventHandler)
    },
    eventHandler: function (event) {
        event.preventDefault();
        dom.editDiv(this);
    },
    addNewCard: function (cardData) {
        dataHandler._listOfCardIds.push(cardData.id);
        let boardToPutIn = document.getElementById(`board${cardData.boardId}`);
        let cardDiv = `
            <div class="card" id="card${cardData.id}" data-cardId="${cardData.id}">
                <div class="card-remove">X</div>

                <div class="card-title">${cardData.cardTitle}</div>
            </div>
            `;
        let statuses = boardToPutIn.querySelectorAll(".board-column-content");
        for (let status of statuses) {
            if (parseInt(status.dataset.statusid) === cardData.statusId) {
                status.insertAdjacentHTML("beforeend", cardDiv);
            }
        }
        let newCard = document.getElementById(`card${cardData.id}`).querySelector(".card-remove").addEventListener("click", function () {
            dataHandler.removeCardById(cardData.id);
            this.parentNode.remove()
        });

    }
};
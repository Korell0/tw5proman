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
                        dom.loadCards(board.id)
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
                <section class="board" data-boardId="${board.id}">
                
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button type="button" class="board-toggle" data-toggle="collapse" data-target="#columns"><i>V</i></button>
                        <button type="button" class="board-delete"> X </button>
                    </div>
                    <div class="collapse" id="columns">
                        <div class="board-columns">
                        </div>
                    </div>
                </section>
            `;
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
            let cardData = {
                    "cardTitle": "New card",
                    "boardId": parseInt(button.parentNode.parentNode.dataset.boardid),
                    "statusId": 0,
                    "order": 0
            };
            button.addEventListener("click", function () {
                dataHandler.createNewCard(cardData,
                    function (){
                    let boards = document.querySelectorAll(".board");
                    for (let board of boards){
                        board.remove();
                    }
                    dom.loadBoards();
                    }
                    )
            })
        }
        let editableTitle = document.querySelectorAll(".board-title");
        for (let title of editableTitle){
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
    loadCards: function (boardId) {
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
        })
    },
    showCards: function (cards) {
        console.log(cards);

        let cardDiv = "";
        let boards = document.querySelectorAll(".board");
        for (let card of cards) {
            cardDiv = `
            <div class="card" id="cards" data-cardId="${card.id}">
                <div class="card-remove">X</div>

                <div class="card-title">${card.title}</div>
            </div>
            `;

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

        let removeButtons = document.querySelectorAll(".card-remove");
        for (let button of removeButtons) {
            button.addEventListener("click", function () {
                dataHandler.removeCardById(this.parentNode.dataset.cardid);
                this.parentNode.style.display = "none"
            })};

        let removeTableButtons = document.querySelectorAll(".board-delete");
        for (let button of removeTableButtons)
        {
            button.addEventListener("click", function () {
                dataHandler.removeBoardById(this.parentNode.parentNode.dataset.boardid);


            this.parentNode.parentElement.style.display = "none"
        })

    }},


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
                }
};

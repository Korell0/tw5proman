// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
            dom.loadStatuses();
            for (let board of boards){
                dom.loadCards(board.id)
            }
        });
        dom.addRemoveEvents();
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <section class="board" data-boardId="${board.id}">
                
                    <div class="board-header">
                        <span class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle"><i class="">V</i></button>
                    </div>
                    <div class="board-columns">
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
    },
    loadStatuses: function () {
      dataHandler.getStatuses(function(statuses){
          dom.showStatuses(statuses);
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

            <div class="card" draggable="true" ondragover="dragOver(event)" ondragstart="dragStart(event)">

            <div class="card" data-cardId="${card.id}">
                <div class="card-remove">X</div>

                <div class="card-title">${card.title}</div>
            </div>
            `;

            for (let board of boards) {
                if (parseInt(board.dataset.boardid) === card.board_id){
                    let containers = board.querySelectorAll(".board-column-content");
                    for (let container of containers){
                        if (parseInt(container.dataset.statusid) === card.status_id) {
                            container.insertAdjacentHTML("beforeend", cardDiv);
                        }
                    }
                }
            }
        }
    },
    addRemoveEvents: function () {
        let removeButtons = document.querySelectorAll(".card-remove");
        for (let button of removeButtons) {
            button.addEventListener("click", function(event){
                //button.remove();
                dataHandler.removeCardById(event.target.parentNode.dataset.cardid)
            })
        }
    }
};

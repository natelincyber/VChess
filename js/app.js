// Image files changed, so removed in chess board js

var game = new Chess(),
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function (source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};

var board = new ChessBoard('board', cfg);


var onDrop = function (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    // illegal move
    if (move === null) {
        return 'snapback';
    }
    updateStatus();
};

// update the board position after the piece snap 
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());
};

var updateStatus = function () {
    var status = '';

    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }

    // checkmate?
    if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check() === true) {
            status += ', ' + moveColor + ' is in check';
        }
    }

    statusEl.html(status);
    fenEl.html(game.fen());
    pgnEl.html(game.pgn());
};

var cfg = {
    snapbackSpeed: 550,
    appearSpeed: 1500,
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    pieceTheme: './img/chesspieces/{piece}.png',
    onSnapEnd: onSnapEnd
};

board = new ChessBoard('board', cfg);
$(window).resize(board.resize);

var alanBtnInstance = alanBtn({
    key: "266bbc84e61eaa9c3887f88bd09defb22e956eca572e1d8b807a3e2338fdd0dc/stage",
    onCommand: function (commandData) {
        if (commandData.command === "turn") {

            let starting = String(commandData.starting).toLowerCase();
            let ending = String(commandData.ending).toLowerCase();

            var move = game.move({
                from: starting,
                to: ending
            });

            if (move == null) {
                alanBtnInstance.playText("Illegal move. Please try again.");
                return 'snapback';
            }

            board.move(starting + "-" + ending);

            updateStatus();

            //call client code that will react on the received command
        }
    },
    rootEl: document.getElementById("alan-btn"),
});


$('#startBtn').on('click', function () {
    window.location.reload();

});
$('#colorBtn').on('click', board.flip);
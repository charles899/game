let boxes = document.querySelectorAll('.box');
let playAgainBtn = document.getElementById('play_again');
let results = document.getElementById('results');
let overlay = document.getElementById('overlay');
let vibrationEnabled = true; // Vibration is enabled by default

let turn = 'O';
let isGameOver = false;

boxes.forEach((box) => {
    box.innerHTML = '';
    box.addEventListener('click', () => {
        if (!isGameOver && box.innerHTML === '' && turn === 'O') {
            box.innerHTML = turn;
            box.style.color = turn === 'X' ? '#FF6347' : '#32CD32'; // Set color for X and O
            checkWin();
            checkDraw();
            changeTurn();
            if (vibrationEnabled) {
                navigator.vibrate(15); // Vibration feedback
            }
            if (!isGameOver) {
                setTimeout(aiMove, 500); // AI makes its move after a 500ms delay
            }
        }
    });
});

const changeTurn = () => {
    if (turn === 'O') {
        turn = 'X';
        document.querySelector('.bg').style.left = '85px';
    } else {
        turn = 'O';
        document.querySelector('.bg').style.left = '0';
    }
};

const checkWin = () => {
    let winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winningConditions.length; i++) {
        let v0 = boxes[winningConditions[i][0]].innerHTML;
        let v1 = boxes[winningConditions[i][1]].innerHTML;
        let v2 = boxes[winningConditions[i][2]].innerHTML;

        if (v0 != '' && v0 === v1 && v0 === v2) {
            isGameOver = true;
            document.querySelector('#results').innerHTML = `"${turn}" wins`;
            document.querySelector('#play_again').style.display = 'inline';

            for (let j = 0; j < 3; j++) {
                boxes[winningConditions[i][j]].style.backgroundColor = '#FFC55A';
                boxes[winningConditions[i][j]].style.color = '#000'; // Change the text color to black for the winning line
            }

            // Trigger confetti
            celebrateWin();
        }
    }
};

const celebrateWin = () => {
    let end = Date.now() + 2 * 1000; // 2 seconds
    let colors = ['#ff0c0c', '#00ff00', '#00c0ff', '#ff00c0', '#c0ff00'];

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
};

const checkDraw = () => {
    if (!isGameOver) {
        let isDraw = true;
        boxes.forEach((box) => {
            if (box.innerHTML === '') isDraw = false;
        });

        if (isDraw) {
            isGameOver = true;
            document.querySelector('#results').innerHTML = 'It\'s a Draw';
            document.querySelector('#play_again').style.display = 'inline';
        }
    }
};

// AI Logic using Minimax algorithm
const aiMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].innerHTML === '') {
            boxes[i].innerHTML = 'X'; // AI's turn
            const score = minimax(getBoardState(), 0, false);
            boxes[i].innerHTML = ''; // Undo the move
            if (score > bestScore) {
                bestScore = score;
                move = i; // Record the best move
            }
        }
    }

    // Make the best move for the AI after a delay
    setTimeout(() => {
        boxes[move].innerHTML = 'X'; // AI makes its move
        boxes[move].style.color = '#FF6347'; // Set color for AI
        checkWin();
        checkDraw();
        changeTurn();
    }, 500); // Delay of 500ms
};

const getBoardState = () => {
    return Array.from(boxes).map(box => box.innerHTML);
};

const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === 'X') return 10 - depth; // AI wins
    if (winner === 'O') return depth - 10; // Player wins
    if (winner === 'Tie') return 0; // Tie

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X'; // Make the move
                const score = minimax(board, depth + 1, false);
                board[i] = ''; // Undo the move
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // Make the move
                const score = minimax(board, depth + 1, true);
                board[i] = ''; // Undo the move
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};

const checkWinner = (board) => {
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < winningConditions.length; i++) {
        let [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }

    return board.includes('') ? null : 'Tie'; // Return 'Tie' if the board is full
};

// Play Again functionality
playAgainBtn.addEventListener('click', () => {
    boxes.forEach((box) => {
        box.innerHTML = '';
        box.style.backgroundColor = ''; // Reset to default background color
        box.style.color = '#fff'; // Reset text color
    });
    results.innerHTML = '';
    playAgainBtn.style.display = 'none';
    isGameOver = false;
    turn = 'O';
    document.querySelector('.bg').style.left = '0'; // Reset turn indicator
});
function playGame(gameUrl) {
    window.location.href = gameUrl;
}
function goBack() {
    window.location.href = 'index.html'; // Replace 'game_list.html' with the actual URL or path to your game list
}
// Toggle Vibration function
function toggleVibration() {
    vibrationEnabled = !vibrationEnabled; // Toggle the vibration state
    document.getElementById('vibrationStatus').innerText = vibrationEnabled ? '📳' : '🔕'; // Update the icon
}

// Toggle Overlay
function toggleOverlay() {
    overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none'; // Toggle display between 'none' and 'flex'
}

// Toggle settings overlay when the settings icon is clicked
function toggleSettings() {
    toggleOverlay();
}
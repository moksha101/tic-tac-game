// إعداد Firebase  
const firebaseConfig = {  
    apiKey: "AIzaSyDgp7dxrnf5dmUpdsTyi7GVrVXq-CVyNW0",  
    authDomain: "tic-tac-game-dc228.firebaseapp.com",  
    databaseURL: "https://tic-tac-game-dc228-default-rtdb.firebaseio.com",  
    projectId: "tic-tac-game-dc228",  
    storageBucket: "tic-tac-game-dc228.appspot.com",  
    messagingSenderId: "477141160451",  
    appId: "1:477141160451:web:6aaf4f1d462292d41bf436"  
};  

const app = firebase.initializeApp(firebaseConfig);  
const database = firebase.database();  

const board = document.getElementById('board');  
const statusDisplay = document.getElementById('status');  
const resetButton = document.getElementById('reset');  

let gameActive = true;  
let currentPlayer = "X";  
let gameState = ["", "", "", "", "", "", "", "", ""];  

// شرط الفوز  
const winningConditions = [  
    [0, 1, 2],  
    [3, 4, 5],  
    [6, 7, 8],  
    [0, 3, 6],  
    [1, 4, 7],  
    [2, 5, 8],  
    [0, 4, 8],  
    [2, 4, 6]  
];  

function handleCellClick(clickedCell, clickedCellIndex) {  
    if (gameState[clickedCellIndex] !== "" || !gameActive) {  
        return;  
    }  

    gameState[clickedCellIndex] = currentPlayer;  
    clickedCell.innerHTML = currentPlayer;  

    // تحديث الحالة في Firebase  
    database.ref('games/currentGame').set({  
        state: gameState,  
        currentPlayer: currentPlayer  
    });  

    checkResult();  
}  

function checkResult() {  
    let roundWon = false;  
    for (let i = 0; i < winningConditions.length; i++) {  
        const [a, b, c] = winningConditions[i];  
        if (gameState[a] === "" || gameState[b] === "" || gameState[c] === "") {  
            continue;  
        }  
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c]) {  
            roundWon = true;  
            break;  
        }  
    }  

    if (roundWon) {  
        statusDisplay.innerHTML = `اللاعب ${currentPlayer} فاز!`;  
        gameActive = false;  
        return;  
    }  

    if (!gameState.includes("")) {  
        statusDisplay.innerHTML = "لعبة التعادل!";  
        gameActive = false;  
        return;  
    }  

    currentPlayer = currentPlayer === "X" ? "O" : "X";  
}  

// إنشاء اللوحة  
function createBoard() {  
    gameState = ["", "", "", "", "", "", "", "", ""];  
    gameActive = true;  
    currentPlayer = "X";  
    statusDisplay.innerHTML = '';  
    board.innerHTML = '';  

    for (let i = 0; i < 9; i++) {  
        const cell = document.createElement('div');  
        cell.classList.add('cell');  
        cell.setAttribute('data-cell-index', i);  
        cell.addEventListener('click', () => handleCellClick(cell, i));  
        board.appendChild(cell);  
    }  

    // إعداد مراقبة Firebase  
    database.ref('games/currentGame').on('value', (snapshot) => {  
        const data = snapshot.val();  
        if (data) {  
            gameState = data.state;  
            currentPlayer = data.currentPlayer;  
            updateBoard();  
        }  
    });  
}  

// تحديث اللوحة بناءً على حالة اللعبة  
function updateBoard() {  
    for (let i = 0; i < gameState.length; i++) {  
        const cell = board.children[i];  
        cell.innerHTML = gameState[i];  
    }  
}  

// إعادة بدء اللعبة  
resetButton.addEventListener('click', createBoard);  
createBoard();  
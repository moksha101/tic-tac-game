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

    if (

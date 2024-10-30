const cardsArray = [
    { id: 1, image: 'img/cartas/batman1.jpg' },
    { id: 2, image: 'img/cartas/batman2.jpg' },
    { id: 3, image: 'img/cartas/batman3.jpg' },
    { id: 4, image: 'img/cartas/batman4.jpg' },
    { id: 5, image: 'img/cartas/batman5.jpg' },
    { id: 6, image: 'img/cartas/batman6.jpg' },
    { id: 7, image: 'img/cartas/batman1.jpg' }, 
    { id: 8, image: 'img/cartas/batman2.jpg' },
    { id: 9, image: 'img/cartas/batman3.jpg' },
    { id: 10, image: 'img/cartas/batman4.jpg' },
    { id: 11, image: 'img/cartas/batman5.jpg' },
    { id: 12, image: 'img/cartas/batman6.jpg' },
];

const backImage = 'img/cartas/back.jpeg'; // Imagen de la marca de la bajara
let flippedCards = [];
let timer;
let timeRemaining = 30; // Tiempo total del juego en segundos
let pairsFound = 0; // Contador de pares encontrados

// Elementos del DOM
const gameBoard = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const resetButton = document.getElementById('reset-button');
const loseMessage = document.getElementById('lose-message');
const winMessage = document.getElementById('win-message'); // Mensaje de victoria

// Crear tablero
function createBoard() {
    const shuffledCards = shuffle(cardsArray);
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'bg-gray-700', 'h-32', 'w-full', 'rounded-lg', 'cursor-pointer');
        cardElement.dataset.id = card.id;
        cardElement.dataset.image = card.image;

        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="${backImage}" class="h-full w-full rounded-lg" alt="Marca de la bajara">
                </div>
                <div class="card-back">
                    <img src="${card.image}" class="h-full w-full rounded-lg" alt="Imagen de la carta">
                </div>
            </div>
        `;

        cardElement.addEventListener('click', handleCardClick);
        gameBoard.appendChild(cardElement);
    });
}

// Manejo de clic en cartas
function handleCardClick(event) {
    const cardElement = event.currentTarget;

    if (!flippedCards.includes(cardElement) && flippedCards.length < 2) {
        cardElement.classList.add('flipped');
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// Verificar coincidencias
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        // Las cartas coinciden
        pairsFound++; // Incrementar el contador de pares
        flippedCards = [];

        // Verificar si se han encontrado todos los pares
        if (pairsFound === cardsArray.length / 2) {
            clearInterval(timer); // Detener el temporizador
            winMessage.classList.remove('hidden'); // Mostrar mensaje de victoria
            winMessage.textContent = "¡Ganaste el juego en " + (30 - timeRemaining) + " segundos!"; // Mensaje adicional con tiempo
        }
    } else {
        // Regresar a la imagen inicial si no coinciden
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        flippedCards = [];
    }
}

// Manejo de fin de juego
function handleGameOver() {
    // Mostrar mensaje de pérdida
    loseMessage.classList.remove('hidden');
    loseMessage.textContent = "¡Se acabó el tiempo! Has perdido.";
    
    // Limpiar y redirigir si es necesario
    setTimeout(() => {
        window.location.href = 'game-over.html'; // Redirigir a la página de game over
    }, 3000); // Esperar 3 segundos antes de redirigir
}

// Temporizador del juego
function startTimer() {
    timer = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerDisplay.textContent = timeRemaining;
        } else {
            clearInterval(timer);
            handleGameOver(); // Llama a la función de game over
        }
    }, 1000);
}

// Manejo de fin de juego
function handleGameOver() {
    // Mezclar y mover las cartas antes de redirigir
    for (let i = 0; i < 5; i++) { // Cambia la posición varias veces antes de redirigir
        setTimeout(() => {
            gameBoard.innerHTML = ''; // Limpia el tablero
            createBoard(); // Crea un nuevo tablero
        }, i * 500); // Intervalo de 500 ms entre cambios
    }
    
    setTimeout(() => {
        window.location.href = 'game-over.html'; // Redirigir a la página de game over
    }, 3000); // Esperar 3 segundos antes de redirigir
}

// Iniciar el juego
function startGame() {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden'); // Asegurarse de que el mensaje de victoria esté oculto
    pairsFound = 0; // Reiniciar contador de pares
    createBoard();

    // Mostrar todas las cartas durante 6 segundos
    setTimeout(() => {
        document.querySelectorAll('.card-inner').forEach(inner => inner.classList.remove('flipped'));
        startTimer();
    }, 6000);
}

// Mezclar cartas
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Reiniciar juego
function resetGame() {
    clearInterval(timer);
    timeRemaining = 30;
    timerDisplay.textContent = timeRemaining;
    flippedCards = [];
    pairsFound = 0; // Reiniciar el contador de pares
    gameBoard.innerHTML = '';
    winMessage.classList.add('hidden'); // Asegurarse de que el mensaje de victoria esté oculto
    startGame();
}

// Evento del botón de reinicio
resetButton.addEventListener('click', resetGame);

// Inicia el juego al cargar la página
window.onload = startGame;

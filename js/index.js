const CARD_IMAGES = [
    './img/emoji-1.png',
    './img/emoji-2.png',
    './img/emoji-3.png',
    './img/emoji-4.png',
    './img/emoji-5.png',
    './img/emoji-6.png',
    './img/emoji-7.png',
    './img/emoji-8.png',
];

const gameState = {
    firstCard: null,
    secondCard: null,
    moves: 0,
    matchedPairs: 0,
    isLocked: false,
    closeTimerId: null,
};

function createDeck() {
    return [...CARD_IMAGES, ...CARD_IMAGES];
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[randomIndex]] = [deck[randomIndex], deck[i]];
    }

    return deck;
}

function updateStats() {
    const movesElement = document.querySelector('.game-stats-moves');
    const pairsElement = document.querySelector('.game-stats-pairs');

    movesElement.textContent = `Ходы: ${gameState.moves}`;
    pairsElement.textContent = `Пары: ${gameState.matchedPairs} из 8`;
}

function resetSelectedCards() {
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.isLocked = false;
}

function handleCardClick(event) {
    const card = event.currentTarget;

    if (
        gameState.isLocked ||
        card === gameState.firstCard ||
        card.classList.contains('is-matched')
    ) {
        return;
    }

    card.classList.add('is-open');

    if (!gameState.firstCard) {
        gameState.firstCard = card;
        return;
    }

    gameState.secondCard = card;
    gameState.moves += 1;

    const cardsMatch = gameState.firstCard.dataset.image === gameState.secondCard.dataset.image;

    if (cardsMatch) {
        gameState.firstCard.classList.add('is-matched');
        gameState.secondCard.classList.add('is-matched');
        gameState.matchedPairs += 1;

        updateStats();
        resetSelectedCards();
        return;
    }

    gameState.isLocked = true;
    updateStats();

    const firstCard = gameState.firstCard;
    const secondCard = gameState.secondCard;

    gameState.closeTimerId = setTimeout(() => {
        firstCard.classList.remove('is-open');
        secondCard.classList.remove('is-open');

        gameState.closeTimerId = null;
        resetSelectedCards();
    }, 1000);
}

function createCard(imagePath) {
    const card = document.createElement('button');
    card.className = 'game-board-card';
    card.type = 'button';
    card.setAttribute('aria-label', 'Открыть карточку');
    card.dataset.image = imagePath;
    card.addEventListener('click', handleCardClick);

    const cardImage = document.createElement('img');
    cardImage.className = 'game-board-card-image';
    cardImage.src = imagePath;
    cardImage.alt = '';

    card.append(cardImage);

    return card;
}

function renderDeck(gameBoard) {
    const deck = shuffleDeck(createDeck());

    const cards = deck.map(imagePath => {
        return createCard(imagePath);
    });

    gameBoard.replaceChildren(...cards);
}

function startNewGame() {
    if (gameState.closeTimerId !== null) {
        clearTimeout(gameState.closeTimerId);
        gameState.closeTimerId = null;
    }

    gameState.moves = 0;
    gameState.matchedPairs = 0;

    resetSelectedCards();

    const gameBoard = document.querySelector('.game-board');

    renderDeck(gameBoard);
    updateStats();
}

function createHeader() {
    const header = document.createElement('header');
    header.className = 'header';

    const container = document.createElement('div');
    container.className = 'container header-container';

    const newGameButton = document.createElement('button');
    newGameButton.className = 'header-button';
    newGameButton.type = 'button';
    newGameButton.textContent = 'Новая игра';
    newGameButton.addEventListener('click', startNewGame);

    const leaderBoardButton = document.createElement('button');
    leaderBoardButton.className = 'header-button';
    leaderBoardButton.type = 'button';
    leaderBoardButton.textContent = 'Таблица лидеров';

    container.append(newGameButton, leaderBoardButton);
    header.append(container);

    return header;
}

function createMain() {
    const main = document.createElement('main');
    main.className = 'main';

    const container = document.createElement('div');
    container.className = 'container main-container';

    const gameStats = document.createElement('div');
    gameStats.className = 'game-stats';

    const gameStatsMoves = document.createElement('p');
    gameStatsMoves.className = 'game-stats-moves';

    const gameStatsPairs = document.createElement('p');
    gameStatsPairs.className = 'game-stats-pairs';

    const gameBoard = document.createElement('div');
    gameBoard.className = 'game-board';

    renderDeck(gameBoard);

    gameStats.append(gameStatsMoves, gameStatsPairs);
    container.append(gameStats, gameBoard);
    main.append(container);

    return main;
}

function initApp() {
    document.body.append(createHeader(), createMain());
    updateStats();
}

initApp();

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
const LEADERBOARD_KEY = 'memory-game-results';
const MAX_LEADERBOARD_RESULTS = 10;

const gameState = {
    firstCard: null,
    secondCard: null,
    moves: 0,
    matchedPairs: 0,
    isLocked: false,
    closeTimerId: null,
    isFinished: false,
};

function getLeaderboard() {
    const savedResults = localStorage.getItem(LEADERBOARD_KEY);

    if (!savedResults) {
        return [];
    }

    try {
        const results = JSON.parse(savedResults);

        return Array.isArray(results) ? results : [];
    } catch {
        return [];
    }
}

function saveResult(moves) {
    const results = getLeaderboard();

    results.push({
        moves,
        completedAt: Date.now(),
    });

    results.sort((firstResult, secondResult) => {
        return (
            firstResult.moves - secondResult.moves ||
            firstResult.completedAt - secondResult.completedAt
        );
    });

    const bestResults = results.slice(0, MAX_LEADERBOARD_RESULTS);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(bestResults));
}

function formatResultDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

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

function createLeaderboardList(results) {
    const list = document.createElement('ol');
    list.className = 'leaderboard-list';

    results.forEach(result => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';

        const row = document.createElement('div');
        row.className = 'leaderboard-row';

        const moves = document.createElement('span');
        moves.textContent = `Ходы: ${result.moves}`;

        const date = document.createElement('time');
        date.dateTime = new Date(result.completedAt).toISOString().slice(0, 10);
        date.textContent = formatResultDate(result.completedAt);

        row.append(moves, date);
        item.append(row);
        list.append(item);
    });

    return list;
}

function createModal() {
    const modal = document.createElement('dialog');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    modal.append(modalContent);

    modal.addEventListener('click', event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modal.addEventListener('close', () => {
        document.body.classList.remove('modal-open');
    });

    return modal;
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
    leaderBoardButton.addEventListener('click', openLeaderboard);

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

function updateStats() {
    const movesElement = document.querySelector('.game-stats-moves');
    const pairsElement = document.querySelector('.game-stats-pairs');

    movesElement.textContent = `Ходы: ${gameState.moves}`;
    pairsElement.textContent = `Пары: ${gameState.matchedPairs} из 8`;
}

function renderDeck(gameBoard) {
    const deck = shuffleDeck(createDeck());

    const cards = deck.map(imagePath => {
        return createCard(imagePath);
    });

    gameBoard.replaceChildren(...cards);
}

function openModal(...contentElements) {
    const modal = document.querySelector('.modal');
    const modalContent = modal.querySelector('.modal-content');

    modalContent.replaceChildren(...contentElements);
    document.body.classList.add('modal-open');
    modal.showModal();
}

function closeModal() {
    const modal = document.querySelector('.modal');

    modal.close();
}

function openVictoryModal() {
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = 'Победа!';

    const message = document.createElement('p');
    message.className = 'modal-message';
    message.textContent = `Вы нашли все пары за ${gameState.moves} ходов`;

    const actions = document.createElement('div');
    actions.className = 'modal-actions';

    const newGameButton = document.createElement('button');
    newGameButton.className = 'modal-button';
    newGameButton.type = 'button';
    newGameButton.textContent = 'Новая игра';
    newGameButton.addEventListener('click', startNewGame);

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-button';
    closeButton.type = 'button';
    closeButton.textContent = 'Закрыть';
    closeButton.addEventListener('click', closeModal);

    actions.append(newGameButton, closeButton);
    openModal(title, message, actions);
}

function openLeaderboard() {
    const title = document.createElement('h2');
    title.className = 'modal-title';
    title.textContent = 'Таблица лидеров';

    const results = getLeaderboard();
    let content;

    if (results.length === 0) {
        content = document.createElement('p');
        content.className = 'modal-message';
        content.textContent = 'Пока нет результатов';
    } else {
        content = createLeaderboardList(results);
    }

    const closeButton = document.createElement('button');
    closeButton.className = 'modal-button';
    closeButton.type = 'button';
    closeButton.textContent = 'Закрыть';
    closeButton.addEventListener('click', closeModal);

    openModal(title, content, closeButton);
}

function resetSelectedCards() {
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.isLocked = false;
}

function handleCardClick(event) {
    const card = event.currentTarget;

    if (
        gameState.isFinished ||
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

        if (gameState.matchedPairs === CARD_IMAGES.length) {
            gameState.isFinished = true;
            saveResult(gameState.moves);
            openVictoryModal();
        }
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

function startNewGame() {
    gameState.isFinished = false;

    const modal = document.querySelector('.modal');

    if (modal.open) {
        closeModal();
    }

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

function initApp() {
    document.body.append(createHeader(), createMain(), createModal());

    updateStats();
}

initApp();

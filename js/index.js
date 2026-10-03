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

function createDeck() {
    return [...CARD_IMAGES, ...CARD_IMAGES];
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

    const leaderBoardButton = document.createElement('button');
    leaderBoardButton.className = 'header-button';
    leaderBoardButton.type = 'button';
    leaderBoardButton.textContent = 'Таблица лидеров';

    container.append(newGameButton, leaderBoardButton);
    header.append(container);

    return header;
}

function createCard(imagePath) {
    const card = document.createElement('button');
    card.className = 'game-board-card';
    card.type = 'button';
    card.setAttribute('aria-label', 'Открыть карточку');
    card.dataset.image = imagePath;

    const cardImage = document.createElement('img');
    cardImage.className = 'game-board-card-image';
    cardImage.src = imagePath;
    cardImage.alt = '';

    card.append(cardImage);

    return card;
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
    gameStatsMoves.textContent = 'Ходы: 0';

    const gameStatsPairs = document.createElement('p');
    gameStatsPairs.className = 'game-stats-pairs';
    gameStatsPairs.textContent = 'Пары: 0 из 8';

    const gameBoard = document.createElement('div');
    gameBoard.className = 'game-board';

    const deck = createDeck();

    deck.forEach(imagePath => {
        const card = createCard(imagePath);
        gameBoard.append(card);
    });

    gameStats.append(gameStatsMoves, gameStatsPairs);
    container.append(gameStats, gameBoard);
    main.append(container);

    return main;
}

document.body.append(createHeader(), createMain());

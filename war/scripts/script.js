document.getElementById('start-game-btn').addEventListener('click', startGame);
document.getElementById('next-round-btn').addEventListener('click', nextRound);
document.getElementById('reset-game-btn').addEventListener('click', resetGame);
document.getElementById('shuffle-deck-btn').addEventListener('click', shuffleDeck);
document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
document.getElementById('end-game-btn').addEventListener('click', endGame);

let deck, player1Deck, player2Deck, player1Card, player2Card, player1Score, player2Score;
let player1Revealed = false;
let player2Revealed = false;
//starts the game, starts createDeck and shuffleDeck functions. 
function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-area').style.display = 'flex';
    deck = createDeck();
    shuffleDeck(deck);
    [player1Deck, player2Deck] = dealDeck(deck);
    player1Score = 0;
    player2Score = 0;
    updateScores();
    updateCardCounts();
    nextRound();
}
// handles switching rounds, resets cards 
function nextRound() {
    if (player1Deck.length > 0 && player2Deck.length > 0) {
        player1Card = player1Deck.shift();
        player2Card = player2Deck.shift();
        document.getElementById('player1-card').src = 'https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/back.png';
        document.getElementById('player2-card').src = 'https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/back.png';
        player1Revealed = false;
        player2Revealed = false;
        document.getElementById('player1-card').addEventListener('click', revealCard);
        document.getElementById('player2-card').addEventListener('click', revealCard);
        updateCardCounts();
    } else {
        endGame();
    }
}
//resets whole html
function resetGame() {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-area').style.display = 'none';
}
//toggles light/dark mode
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}
// creates the deck we will use
function createDeck() {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    suits.forEach(suit => {
        values.forEach(value => {
            const card = {
                value: value,
                suit: suit,
                image: `https://raw.githubusercontent.com/hayeah/playing-cards-assets/master/png/${value}_of_${suit}.png`
            };
            deck.push(card);
        });
    });
    return deck;
}
//shuffles the deck, provides pop up gui that alerts players the deck was shuffled
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    alert("Deck has been shuffled!");
}
// sets up deck
function dealDeck(deck) {
    const player1Deck = [];
    const player2Deck = [];
    while (deck.length > 0) {
        player1Deck.push(deck.shift());
        player2Deck.push(deck.shift());
    }
    return [player1Deck, player2Deck];
}
// this is the function that determines who the winner is. 
function compareCards() {
    const valueMap = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
    const player1Value = valueMap[player1Card.value];
    const player2Value = valueMap[player2Card.value];

    if (player1Value > player2Value) {
        player1Score++;
    } else if (player1Value < player2Value) {
        player2Score++;
    } else {
        handleWar();
    }

    updateScores();
}
//update 2/24/25 - added function
function handleWar() {
    if (player1Deck.length > 0 && player2Deck.length > 0) {
        const warCards = [player1Card, player2Card];
        player1Card = player1Deck.shift();
        player2Card = player2Deck.shift();
        warCards.push(player1Card, player2Card);

        if (valueMap[player1Card.value] > valueMap[player2Card.value]) {
            player1Score += warCards.length / 2;
        } else if (valueMap[player1Card.value] < valueMap[player2Card.value]) {
            player2Score += warCards.length / 2;
        } else {
            handleWar(); // In case of another tie
        }
    } else {
        endGame(); // If one of the players runs out of cards during the war
    }

    updateScores();
}
//this is the function that keeps track of the player scores and displayes them below the current player cards
function updateScores() {
    document.getElementById('player1-score').textContent = `Player 1: ${player1Score}`;
    document.getElementById('player2-score').textContent = `Player 2: ${player2Score}`;
}
// this handles the player clicking on the card
function revealCard(event) {
    const cardElement = event.target;
    if (cardElement.id === 'player1-card') {
        cardElement.src = player1Card.image;
        player1Revealed = true;
    } else if (cardElement.id === 'player2-card') {
        cardElement.src = player2Card.image;
        player2Revealed = true;
    }

    if (player1Revealed && player2Revealed) {
        compareCards();
        document.getElementById('player1-card').removeEventListener('click', revealCard);
        document.getElementById('player2-card').removeEventListener('click', revealCard);
        updateCardCounts();
    }
}
function updateCardCounts() {
    document.getElementById('player1-card-count').textContent = `Player 1 Cards: ${player1Deck.length}`;
    document.getElementById('player2-card-count').textContent = `Player 2 Cards: ${player2Deck.length}`;
}

//this ends the game and declares a winner
function endGame() {
    if (player1Score > player2Score) {
        alert('Player 1 wins the game!');
    } else if (player2Score > player1Score) {
        alert('Player 2 wins the game!');
    } else {
        alert('The game is a draw!');
    }   
    // Additional reset logic if needed
    resetGame();
}

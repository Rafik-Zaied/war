const get = (element) => document.querySelector(element);
const newDeckBtn = get("#new-deck-button");
const drawCardsBtn = get("#draw-cards");
const card1Display = get("#card-1");
const card1Pile = get("#card-1-pile");
const card2Display = get("#card-2");
const card2Pile = get("#card-2-pile");
const remainingCardsDisplay = get("#remaining-cards");
let pile = 0;
let player1Score = 0;
const player1ScoreDisplay = get("#player-1-score");
let player2Score = 0;
const player2ScoreDisplay = get("#player-2-score");
let deckId = "";

drawCardsBtn.disabled = true;

function getNewDeck() {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle")
    .then((res) => res.json())
    .then((data) => {
      deckId = data.deck_id;
      drawCardsBtn.disabled = false;
      player1Score = 0;
      player2Score = 0;
      player1ScoreDisplay.textContent = "";
      player2ScoreDisplay.textContent = "";
      card1Display.innerHTML = ``;
      card2Display.innerHTML = ``;
      card1Pile.innerHTML = ``;
      card2Pile.innerHTML = ``;
      displayRemainingCards(data);
    });
}

function drawCards() {
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      let { cards } = data;
      card1Display.innerHTML = `<img src=${cards[0].image} class="card" />`;
      card2Display.innerHTML = `<img src=${cards[1].image} class="card" />`;
      compareCards(cards);
      displayRemainingCards(data);
    });
}

function compareCards(cards) {
  console.log(cards);
  const valueOptions = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "JACK",
    "QUEEN",
    "KING",
    "ACE",
  ];
  let [card1, card2] = cards;
  let cardValues = cards.map((card) => card.value);

  let valueOfCard1 = valueOptions.indexOf(cardValues[0]);
  let valueOfCard2 = valueOptions.indexOf(cardValues[1]);

  if (valueOfCard1 > valueOfCard2) {
    player1Score += 1;
    player1Score += pile;
    erasePile();
    player1ScoreDisplay.textContent = ` - score: ${player1Score}`;
  } else if (valueOfCard1 === valueOfCard2) {
    card1Display.innerHTML = ` `;
    card2Display.innerHTML = ` `;
    card1Pile.innerHTML = `<img src=${card1.image} class="card" />`;
    card2Pile.innerHTML = `<img src=${card2.image} class="card" />`;
    pile += 1;
  } else {
    player2Score += 1;
    player2Score += pile;
    erasePile();
    player2ScoreDisplay.textContent = ` - score: ${player2Score}`;
  }
}

function erasePile() {
  pile = 0;
  card1Pile.innerHTML = ``;
  card2Pile.innerHTML = ``;
}

function displayRemainingCards(data) {
  remainingCardsDisplay.textContent = `Cards Remaining: ${data.remaining}`;
  if (data.remaining === 0) {
    drawCardsBtn.disabled = true;
    remainingCardsDisplay.textContent = `Draw a New Deck to Play Again`;

    if (player1Score > player2Score) {
      player1ScoreDisplay.textContent = `WON THE GAME WITH ${player1Score} points`;
      player2ScoreDisplay.textContent = "LOST :(";
    } else {
      player1ScoreDisplay.textContent = "LOST :(";
      player2ScoreDisplay.textContent = `WON THE GAME WITH ${player2Score} points`;
    }
  }
}

newDeckBtn.addEventListener("click", getNewDeck);
drawCardsBtn.addEventListener("click", drawCards);

function createPlayers() {

  const seatBotNames = [
  "シュン",
  "オザム",
  "タケル",
  "ムラゼ",
  "ﾀﾞｲｿﾞｰ"
];

  const players = [];

  const playerName =
  document
    .getElementById("player-name")
    .value
    .trim() || "あなた";

  let humanCount = 1;

  for (let i = 1; i <= 5; i++) {

    const type =
      document.getElementById(`player${i}`).value;

    if (type === "human") {

      players.push({

  name:
    humanCount === 1
      ? playerName
      : `${playerName}${humanCount}`,

  type: "human"

});

      humanCount++;

    } else {

      players.push({

  name: seatBotNames[i - 1],

  level: botDifficulty,

  type: "bot"

});
    }
  }

  return players;
}

function renderPlayers(players) {

  const container =
    document.getElementById("players");

  container.innerHTML = "";

  players.forEach((player, index) => {

    container.innerHTML += `
      <div
        class="player-card player-${index}"
        id="player-${index}"
      >
        ${player.name}
      </div>
    `;

  });

}

function updateCurrentPlayer() {

  document
    .querySelectorAll(".player-card")
    .forEach(card =>
      card.classList.remove("active")
    );

  document
    .getElementById(
      `player-${currentPlayerIndex}`
    )
    ?.classList.add("active");

  const currentPlayer =
    players[currentPlayerIndex];

  const answerInput =
    document.getElementById(
      "answer-input"
    );

  const answerBtn =
    document.getElementById(
      "answer-btn"
    );

  if (currentPlayer.type === "human") {

    answerInput.disabled = false;

    answerBtn.disabled = false;

    answerInput.focus();

  } else {

    answerInput.disabled = true;

    answerBtn.disabled = true;

  }

  moveBomb();

}

function nextTurn() {

  currentPlayerIndex++;

  if (
    currentPlayerIndex >=
    players.length
  ) {

    currentPlayerIndex = 0;

  }

  updateCurrentPlayer();

  checkBotTurn();

}
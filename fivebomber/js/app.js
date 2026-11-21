let gameFinished = false;

let timerId = null;

let remainingTime = 45;


let currentQuestion = null;
let correctAnswers = [];

let allQuestions = [];
let selectedGenres = [];

let usedQuestionIds = [];

let totalScore = 0;

let playedCount = 0;

let players = [];

let currentPlayerIndex = 0;

function updateProgress() {

  if (!currentQuestion) {
    return;
  }

  const progress =
    document.getElementById("progress");

  let html = "";

  for (
    let i = 0;
    i < currentQuestion.targetCount;
    i++
  ) {

    if (i < correctAnswers.length) {
      html += "✅ ";
    } else {
      html += "□ ";
    }

  }

  progress.textContent = html;

}

const startButton =
  document.getElementById("start-btn");

startButton.addEventListener(
  "click",
  handleStart
);

async function handleStart() {

 gameFinished = false;

 totalScore = 0;

 playedCount = 0;

  players = createPlayers();

  selectedGenres =
    getSelectedGenres();

  document.getElementById(
    "settings-screen"
  ).hidden = true;

  document.getElementById(
    "game-screen"
  ).hidden = false;
  
document.getElementById(
  "next-btn"
).hidden = false;


  renderPlayers(players);

  allQuestions =
    await loadQuestions();

  usedQuestionIds = [];

const question =
  getRandomQuestion(
    allQuestions,
    selectedGenres,
    usedQuestionIds
  );

  document.getElementById(
    "question"
  ).textContent =
    question.question;

  currentQuestion = question;

  usedQuestionIds.push(
  question.id
);

  correctAnswers = [];

  currentPlayerIndex = 0;

  updateCurrentPlayer();

  updateProgress();

  startTimer();

  checkBotTurn();
}

function createPlayers() {

  const players = [];

  let humanCount = 1;
  let botCount = 1;

  for (let i = 1; i <= 5; i++) {

    const type =
      document.getElementById(`player${i}`).value;

    if (type === "human") {

      players.push({
        name: `あなた${humanCount}`,
        type: "human"
      });

      humanCount++;

    } else {

      players.push({
        name: `BOT${botCount}`,
        type: "bot"
      });

      botCount++;

    }
  }

  return players;
}

function getSelectedGenres() {

  const checkedGenres =
    document.querySelectorAll(
      "#genre-list input:checked"
    );

  return [...checkedGenres].map(
    checkbox => checkbox.value
  );
}

function renderPlayers(players) {

  const container =
    document.getElementById("players");

  container.innerHTML = "";

  players.forEach(player => {

    container.innerHTML += `
      <div class="player-card">
        ${player.name}
        (${player.type})
      </div>
    `;

  });

}

document
  .getElementById("answer-btn")
  .addEventListener(
    "click",
    submitAnswer
  );

function submitAnswer() {

  const input =
    document.getElementById(
      "answer-input"
    );

  const answer =
    input.value.trim();

  if (!answer) {
    return;
  }

  if (
    correctAnswers.includes(answer)
  ) {
    alert("既に回答済みです");
    return;
  }

  const isCorrect =
    currentQuestion.answers
      .includes(answer);

  if (isCorrect) {

    correctAnswers.push(answer);

    addAnswerToHistory(answer);

    updateProgress();

    nextTurn();

    input.value = "";

    checkClear();

  } else {

    alert("不正解");

  }

}

function addAnswerToHistory(
  answer
) {

  const history =
    document.getElementById(
      "answer-history"
    );

  history.innerHTML += `
    <div class="answer-item">
      ✅ ${answer}
    </div>
  `;

}

function showResult(isClear) {

  document.getElementById(
    "game-screen"
  ).hidden = true;

  document.getElementById(
    "game-screen"
  ).hidden = true;

  document.getElementById(
    "result-screen"
  ).hidden = false;

  const score =
    correctAnswers.length * 10;

  totalScore += score;

  playedCount++;

  document.getElementById(
    "result-score"
  ).textContent =
    `${score} POINTS`;

  if (isClear) {

    document.getElementById(
      "result-title"
    ).textContent =
      "CLEARED";

    document.getElementById(
      "result-detail"
    ).textContent =
      "5問クリア！";

  } else {

    document.getElementById(
      "result-title"
    ).textContent =
      "GAME OVER";

    document.getElementById(
      "result-detail"
    ).textContent =
      `${correctAnswers.length}問正解`;

  }

  document.getElementById(
    "result-total"
  ).textContent =
    `TOTAL SCORE : ${totalScore} POINTS`;

　console.log("TOTAL SCORE:", totalScore);

}

function checkClear() {

  if (
    correctAnswers.length >=
    currentQuestion.targetCount
  ) {

    gameFinished = true;

    clearInterval(timerId);

    showResult(true);

  }

}

function loadNextQuestion() {

 gameFinished = false;

  document.getElementById(
    "result-screen"
  ).hidden = true;

  document.getElementById(
    "game-screen"
  ).hidden = false;

const question =
  getRandomQuestion(
    allQuestions,
    selectedGenres,
    usedQuestionIds
  );

if (question === null) {

  document.getElementById(
    "game-screen"
  ).hidden = true;

  document.getElementById(
    "result-screen"
  ).hidden = false;

  document.getElementById(
    "result-title"
  ).textContent =
    "ALL CLEAR";

  document.getElementById(
    "result-score"
  ).textContent =
    "";

  document.getElementById(
    "result-detail"
  ).textContent =
    "出題可能な問題がありません";

  document.getElementById(
    "next-btn"
  ).hidden = true;

  return;

}

  currentQuestion = question;

usedQuestionIds.push(
  question.id
);


  correctAnswers = [];

  document.getElementById(
    "question"
  ).textContent =
    question.question;

  document.getElementById(
    "answer-history"
  ).innerHTML = "";

  document.getElementById(
    "answer-input"
  ).value = "";

  updateProgress();

  startTimer();

}

function startTimer() {

  remainingTime = 45;

  updateTimer();

  clearInterval(timerId);

  timerId = setInterval(() => {

    remainingTime--;

    updateTimer();

    if (remainingTime <= 0) {

      clearInterval(timerId);

gameFinished = true;

setTimeout(() => {

  showResult(false);

 }, 500);
    }

  }, 1000);

}

function updateTimer() {

  document.getElementById(
    "timer"
  ).textContent =
    `残り時間: ${remainingTime}秒`;

}

document
  .getElementById("next-btn")
  .addEventListener(
    "click",
    loadNextQuestion
  );

document
  .getElementById("finish-btn")
  .addEventListener(
    "click",
    () => {

      document.getElementById(
        "result-screen"
      ).hidden = true;

      document.getElementById(
        "settings-screen"
      ).hidden = false;

    }
  );

  function updateCurrentPlayer() {

  document.getElementById(
    "current-player-name"
  ).textContent =
    players[currentPlayerIndex].name;

if (
  players[currentPlayerIndex].type ===
  "human"
) {

  document.getElementById(
    "bot-status"
  ).textContent = "";

}

}

function checkBotTurn() {

  if (gameFinished) {
    return;
  }

  const currentPlayer =
    players[currentPlayerIndex];

  if (
    currentPlayer.type !== "bot"
  ) {
    return;
  }

 document.getElementById(
  "bot-status"
).textContent =
  `🤔 ${currentPlayer.name} が考え中...`;

  const delay =
  Math.floor(
    Math.random() * 4000
  ) + 2000;

  setTimeout(() => {

    if (gameFinished) {
      return;
    }

    const availableAnswers =
      currentQuestion.answers.filter(
        answer =>
          !correctAnswers.includes(
            answer
          )
      );

    if (
      availableAnswers.length === 0
    ) {
      return;
    }

    const randomAnswer =
      availableAnswers[
        Math.floor(
          Math.random() *
          availableAnswers.length
        )
      ];

    correctAnswers.push(
      randomAnswer
    );

document.getElementById(
  "bot-status"
).textContent = "";

    addAnswerToHistory(
      `🤖 ${currentPlayer.name} : ${randomAnswer}`
    );

    updateProgress();

    nextTurn();

    checkClear();

 }, delay);

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
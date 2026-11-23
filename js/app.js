let gameFinished = false;

let timerId = null;

let remainingTime = 45;


let currentQuestion = null;
let correctAnswers = [];

let allQuestions = [];
let selectedGenres = [];

let usedQuestionIds = [];

let totalScore = 0;

let players = [];

let currentPlayerIndex = 0;

let botDifficulty = "perfect";

let gameStarting = false;

document
  .getElementById("answer-btn")
  .addEventListener(
    "click",
    submitAnswer
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

      document.getElementById(
        "answer-history"
      ).innerHTML = "";

      document.getElementById(
        "answer-input"
      ).value = "";

    }
  );

const startButton =
  document.getElementById("start-btn");

startButton.addEventListener(
  "click",
  handleStart
);

async function handleStart() {

 gameFinished = false;

 totalScore = 0;

 botDifficulty =
  document.getElementById(
    "bot-difficulty"
  ).value;

  const humanCount =
  Array.from({ length: 5 }, (_, i) =>
    document.getElementById(`player${i + 1}`).value
  ).filter(type => type === "human").length;

if (humanCount === 0) {

  alert(
    "人間プレイヤーを1人以上選択してください。"
  );

  return;

}

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

  resetAnswerArea();

  currentPlayerIndex = 0;

  updateCurrentPlayer();

  startQuestion();
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

function startQuestion() {

  gameStarting = true;

  document.getElementById(
    "bomb"
  ).hidden = true;

  document.getElementById(
    "answer-input"
  ).disabled = true;

  document.getElementById(
    "answer-btn"
  ).disabled = true;

  setTimeout(() => {

    gameStarting = false;

    document.getElementById(
      "bomb"
    ).hidden = false;

    updateCurrentPlayer();

    updateBombHeight();

    startTimer();

    checkBotTurn();

  }, 2000);

}

function submitAnswer() {

  if (gameStarting) {
  return;
}

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

    playSE("se-correct");

  correctAnswers.push(answer);

    addAnswerToHistory(
  players[currentPlayerIndex].name,
  answer,
  true
);

    nextTurn();

    input.value = "";

    checkClear();

  } else {

  playSE("se-wrong");

  addAnswerToHistory(
  players[currentPlayerIndex].name,
  answer,
  false
);

  alert("不正解");

}

}

function addAnswerToHistory(
  playerName,
  answer,
  isCorrect
) {

  const history =
    document.getElementById(
      "answer-history"
    );

  history.innerHTML += `
    <div class="answer-item ${
      isCorrect
        ? "correct"
        : "wrong"
    }">
      ${playerName} :
      ${isCorrect ? "✅" : "❌"}
      ${answer}
    </div>
  `;

}

function showResult(isClear) {

playSE("se-cleared");

    const bomb =
  document.getElementById("bomb");

bomb.classList.remove(
  "danger"
);

bomb.classList.remove(
  "explode"
);

bomb.textContent = "💣";

bomb.style.transform =
  "scale(1)";

bomb.style.filter =
  "none";

bomb.style.top = "0px";

remainingTime = 45;

updateBombHeight();

document
  .getElementById("flash")
  .classList.remove("active");

document
  .getElementById("bomb")
  .classList.remove("danger");

  document.getElementById(
    "game-screen"
  ).hidden = true;

  document.getElementById(
    "result-screen"
  ).hidden = false;

  const score =
    correctAnswers.length * 10;

  totalScore += score;

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

    const examples =
  currentQuestion.answers
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

document.getElementById(
  "result-detail"
).innerHTML = `
  ${correctAnswers.length}問正解
  <br><br>
  回答例
  <br>
  ・${examples.join("<br>・")}
`;

  }

  document.getElementById(
    "result-total"
  ).textContent =
    `TOTAL SCORE : ${totalScore} POINTS`;

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

document
  .getElementById("next-btn")
  .addEventListener(
    "click",
    loadNextQuestion
  );

function resetAnswerArea() {

  document.getElementById(
    "answer-history"
  ).innerHTML = "";

  document.getElementById(
    "answer-input"
  ).value = "";

}

function loadNextQuestion() {

 gameFinished = false;

 document
  .getElementById("flash")
  .classList.remove("active");

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

  currentPlayerIndex = 0;

  updateCurrentPlayer();

  document.getElementById(
    "question"
  ).textContent =
    question.question;

  resetAnswerArea();

  startQuestion();

}

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

    let successRate;

switch (currentPlayer.level) {

  case "hard":
    successRate = 0.3;
    break;

  case "normal":
    successRate = 0.5;
    break;

  case "easy":
    successRate = 0.8;
    break;

  case "perfect":
    successRate = 1.0;
    break;

  default:
    successRate = 0.5;

}

if (Math.random() > successRate) {

playSE("se-wrong");

  addAnswerToHistory(
    currentPlayer.name,
    "・・・",
    false
  );

  checkBotTurn();

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

    playSE("se-correct");

    addAnswerToHistory(
  currentPlayer.name,
  randomAnswer,
  true
);

    nextTurn();

    checkClear();

 }, delay);

}
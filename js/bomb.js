function startTimer() {

  remainingTime = 45;

  updateTimer();

  clearInterval(timerId);

  timerId = setInterval(() => {

    remainingTime--;

    updateTimer();

    updateBombHeight();

    if (remainingTime === 5) {

  playSE("se-warning");

}

    if (remainingTime <= 0) {

      clearInterval(timerId);

      gameFinished = true;

      // 0秒を見せる
      setTimeout(() => {

        explodeBomb();

        // 爆発演出を見る
        setTimeout(() => {

          showResult(false);

        }, 2000);

      }, 1000);

    }

  }, 1000);

}

function updateTimer() {
  return;
}

function moveBomb() {

    const playerElement =
  document.getElementById(
    `player-${currentPlayerIndex}`
);

  if (!playerElement) {
    return;
  }

  const bomb =
    document.getElementById("bomb");

  const playerRect =
    playerElement.getBoundingClientRect();

  const appRect =
    document
      .getElementById("app")
      .getBoundingClientRect();

  bomb.style.left =
    `${playerRect.left - appRect.left + playerRect.width / 2 - 24}px`;

}

function updateBombHeight() {

  const bomb =
    document.getElementById("bomb");

  const progress =
    (45 - remainingTime) / 45;

  const startY = 15;
  const endY = 205;

  bomb.style.top =
    `${
      startY +
      progress *
      (endY - startY)
    }px`;

  const scale =
    1 + progress * 1.5;

  bomb.style.transform =
    `scale(${scale})`;

if (remainingTime <= 5) {

  bomb.classList.add("danger");

} else {

  bomb.classList.remove("danger");

  bomb.style.transform =
    "scale(1)";

  bomb.style.filter =
    "none";

}

}

function explodeBomb() {

  const bomb =
    document.getElementById(
      "bomb"
    );

  playSE("se-explosion");

  bomb.textContent = "💥";

  bomb.classList.remove(
    "danger"
  );

  bomb.classList.add(
    "explode"
  );

  document
  .getElementById("flash")
  .classList.add("active");

}

function playSE(id) {

  const audio =
    document.getElementById(id);

  if (!audio) return;

   audio.volume = 0.6;

  audio.currentTime = 0;

  audio.play();

}
async function loadQuestions() {

  const files = [
    "geography.json",
    "history.json",
    "japanese.json",
    "sakurazaka46.json"
  ];

  const results = await Promise.all(

    files.map(file =>
      fetch(`data/${file}`)
        .then(response => response.json())
    )

  );

  return results.flat();

}

function getRandomQuestion(
  questions,
  genres,
  usedQuestionIds
) {

  const filtered =
    questions.filter(question =>
      genres.includes(question.genre) &&
      !usedQuestionIds.includes(question.id)
    );

  if (filtered.length === 0) {
    return null;
  }

  const randomIndex =
    Math.floor(
      Math.random() * filtered.length
    );

  return filtered[randomIndex];

}
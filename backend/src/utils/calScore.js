const calScore = (scores) => {
  console.log(scores);
  let highestScore = 0;
  let lowestScore = 10;
  let total = 0;
  scores.forEach((element) => {
    total += element.score;
    if (element.score > highestScore) {
      highestScore = element.score;
    }
    if (element.score < lowestScore) {
      lowestScore = element.score;
    }
  });
  const averageScore = total / scores.length;
  return { highestScore, lowestScore, averageScore };
};
module.exports = calScore;

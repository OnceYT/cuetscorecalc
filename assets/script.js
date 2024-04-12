function submitForms() {
  let responsesheettext = document.getElementById("text1").value;
  let answerkeytext = document.getElementById("text2").value;

  let linelist = [];
  let answerkey = {};

  answerkeytext.split('\n').forEach((line) => {
    if (line.startsWith('COQP')) {
      linelist.push(line);
    }
  });

  linelist.forEach((x) => {
    let temp = x.split('\t');
    if (temp[3].length > 1 && temp[3][0] !== 'D') {
      temp[3] = temp[3].split('-')[1][0];
    }
    answerkey[temp[2]] = temp[3];
  });

  let droppedlist = new Set(Object.keys(answerkey).filter((key) => answerkey[key] === 'DROP'));

  answerkey = Object.fromEntries(
    Object.entries(answerkey).filter(([key, value]) => value !== 'DROP')
  );

  let question_ids = [];
  let options_chosen = [];

  responsesheettext.split('\n').forEach((line) => {
    if (line.includes('Question ID')) {
      question_ids.push(line.split(':')[1].trim());
    }
    if (line.includes('Chosen Option')) {
      options_chosen.push(line.split(':')[1].trim()[0]);
    }
  });

  let responsesheet = Object.fromEntries(
    Object.entries(Object.fromEntries(question_ids.map((id, i) => [id, options_chosen[i]]))).filter(
      ([key, value]) => value !== '-' && !droppedlist.has(key)
    )
  );

  let score = 0;
  let correctresponses = 0;
  let incorrectresponses = 0;

  Object.entries(responsesheet).forEach(([response, value]) => {
    if (value === answerkey[response]) {
      score += 4;
      correctresponses += 1;
    } else {
      score -= 1;
      incorrectresponses += 1;
    }
  });

  var outputDiv = document.getElementById("output");
        outputDiv.innerHTML = `
            - Total Score: ${score} <br>
            - Questions Attempted: ${Object.keys(responsesheet).length} <br>
            - Correct Responses: ${correctresponses} <br>
            - Incorrect Responses: ${incorrectresponses} <br>
            - Dropped Questions*: ${droppedlist.size}
            `;
}

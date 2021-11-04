export class Question {
  static create(question) {
    return fetch('https://questions-with-authorisation-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        question.id = response.name
        return question
      })
      .then(addToLocalStorage)
  }
}

function addToLocalStorage(question) {
  const all = getLocalQuestion()
  console.log(all)
  all.push(question)
  localStorage.setItem('questions', JSON.stringify(all))
}

function getLocalQuestion() {
  return JSON.parse(localStorage.getItem('questions') || '[]')
}

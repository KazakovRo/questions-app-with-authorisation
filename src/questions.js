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
      .then(Question.renderList)
  }

  static fetchToken(token) {
    if (!token) {
      return Promise.resolve('<p class="error">You don\'t have token</p>')
    }

    return fetch(
      `https://questions-with-authorisation-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`
    )
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class="error>${response.error}</p>`
        }

        return response
          ? Object.keys(response).map(key => ({
              ...response[key],
              id: key
            }))
          : []
      })
  }

  static renderList() {
    const listQuestions = getLocalQuestion()

    const html = listQuestions.length
      ? listQuestions.map(toCard).join('')
      : `<div class="mui--text-headline">You haven\'t asked anything yet ...</div>`

    const elList = document.getElementById('list')
    elList.innerHTML = html
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map(item => `<li>${item.text}</li>`).join('')}</ol>`
      : "<p>We don't have questions</p>"
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

function toCard(question) {
  return `
    <div class="mui--text-black-54">
      ${new Date(question.date).toLocaleDateString()}
      ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br>
  `
}

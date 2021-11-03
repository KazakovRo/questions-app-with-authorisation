export class Question {
  static create(question) {
    return fetch('https://questions-with-authorisation-default-rtdb.europe-west1.firebasedatabase.app/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => Response.json())
      .then(response => {
        console.log(response)
      })
  }
}

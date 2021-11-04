import { Question } from './questions'
import { createModal, isValid } from './utils'
import { getAuthForm, authWithEmailAndPass } from './auth'
import './style.css'

const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')
const modalBtn = document.getElementById('modal-btn')

window.addEventListener('load', Question.renderList)

form.addEventListener('submit', submitFormHandler)
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
})

modalBtn.addEventListener('click', openModal)

function submitFormHandler(e) {
  e.preventDefault()

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON()
    }

    submitBtn.disabled = true

    // Server request
    console.log('quest', question)
    Question.create(question).then(() => {
      input.value = ''
      input.className = ''
      submitBtn.disabled = false
    })
  }
}

function openModal() {
  createModal('Authorisation', getAuthForm())
  document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true })
}

function authFormHandler(e) {
  e.preventDefault()

  const btn = e.target.querySelector('button')
  const email = e.target.querySelector('#email').value
  const password = e.target.querySelector('#password').value

  btn.disabled = true

  authWithEmailAndPass(email, password)
    .then(token => Question.fetchToken(token))
    .then(renderModalAfterAuth)
    .then(() => (btn.disabled = false))
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    createModal('Error !!!', content)
    console.warn(content)
  } else {
    createModal('List of questions', Question.listToHTML(content))
  }
}

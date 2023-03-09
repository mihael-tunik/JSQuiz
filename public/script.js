const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const answerCounter = document.getElementById('answer-counter')

const questions = [];
const questionNumber = 10;

let shuffledQuestions, currentQuestionIndex
let correctAnswers, chosenFlag

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
  currentQuestionIndex++
  setNextQuestion()
})

function startGame() {
  startButton.classList.add('hide')
  
  generateQuestions().then(
   () => {
   // checkout if it's necessary to shuffle here
   shuffledQuestions = questions.sort(() => Math.random() - .5)
   currentQuestionIndex = 0
   correctAnswers = 0
   chosenFlag = 0
  
   questionContainerElement.classList.remove('hide')
   setNextQuestion()
   
   }
  )
}

function setNextQuestion() {
  resetState()
  showQuestion(shuffledQuestions[currentQuestionIndex])
}

function showQuestion(question) {
  questionElement.innerText = question.question
  
  question.answers.forEach(answer => {
    const button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
  })
}

function resetState() {
  chosenFlag = 0
  clearStatusClass(document.body)
  nextButton.classList.add('hide')
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild)
  }
}

function selectAnswer(e) {
  const selectedButton = e.target
  const correct = selectedButton.dataset.correct
  setStatusClass(document.body, correct)
  
  Array.from(answerButtonsElement.children).forEach(button => {
    clearStatusClass(button)
  })
  
  setStatusClass(selectedButton, correct)
  
  if (correct && chosenFlag == 0) {
    correctAnswers = correctAnswers + 1
  }
  answerCounter.innerText = correctAnswers + '/' + (currentQuestionIndex+1) + '/' + questionNumber
  chosenFlag = 1 
  
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide')
  } else {
    correctAnswers = 0
    startButton.innerText = 'Restart'
    startButton.classList.remove('hide')
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element)
  if (correct) {
    element.classList.add('correct')
  } else {
    element.classList.add('wrong')
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct')
  element.classList.remove('wrong')
}

function sample(n, m){
    const res = [];
    
    while(res.length < m){
        let candidate = Math.floor(Math.random() * n);
        let flag = 1;
        
        for (let j = 0; j < res.length; ++j){
            if(res[j] == candidate){
                flag = 0
            }
        }
        
        if (flag == 1){
            res.push(candidate)
        }
    }
    return res
}

async function generateQuestions(){
    
    const alphabet = [];
    const transcript = [];
    
    console.log('Starting...')
    
    const result = await fetch('http://127.0.0.1:8001/alphabet/ge', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        },
    })
    .then(response => response.json())
    
        
    for (var key in result){
         console.log('Read: ' + key + ':' + result[key]) 
        
         alphabet.push(key)
         transcript.push(result[key])
    }
        
        
    let length = alphabet.length;
    let variants = 4;
    
    for (let question_idx = 0; question_idx < questionNumber; ++question_idx){
        
        let random_idx = sample(length, variants);
        let shuffle = sample(variants, variants);
        
        // this code is not good
        const answers = [
                {text: transcript[random_idx[0]], correct: true},
                {text: transcript[random_idx[1]], correct: false},
                {text: transcript[random_idx[2]], correct: false},
                {text: transcript[random_idx[3]], correct: false},
            ];
        //
            
        const answers_shuffled = [];
        
        for (let j = 0; j < shuffle.length; ++j)
            answers_shuffled.push(answers[shuffle[j]])
            
        quiz_item = {
            question: alphabet[random_idx[0]],
            answers: answers_shuffled
        }
                    
        questions.push(quiz_item)
    }
    
}

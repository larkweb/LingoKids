const container = document.querySelector('.container');
const questionBox = document.querySelector('.question');
const choicesBox = document.querySelector('.choices');
const nextBtn = document.querySelector('.nextBtn');
const scoreCard = document.querySelector('.scoreCard');
const alert = document.querySelector('.alert');
const startBtn = document.querySelector('.startBtn');
const timer = document.querySelector('.timer');

const quiz = [
    {
        question: "1. ¿Cómo se dice azul en inglés?",
        choices: ["Red", "Green", "Blue", "Yellow"],
        answer: "Blue"
    },
    {
        question: "2. ¿Cómo se dice cinco en inglés?",
        choices: ["Three", "Five", "Ten", "Two"],
        answer: "Five"
    },
    {
        question: "3. ¿Cómo se dice jugar en inglés?",
        choices: ["Sleep", "Play", "Paint", "Sing"],
        answer: "Play"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let quizOver = false;
let timeLeft = 60;
let timerID = null;

const showQuestions = () => {
    const questionDetails = quiz[currentQuestionIndex];
    questionBox.textContent = questionDetails.question;

    choicesBox.textContent = "";
    for (let i = 0; i < questionDetails.choices.length; i++) {
        const currentChoice = questionDetails.choices[i];
        const choiceDiv = document.createElement('div');
        choiceDiv.textContent = currentChoice;
        choiceDiv.classList.add('choice');
        choicesBox.appendChild(choiceDiv);

        choiceDiv.addEventListener('click', () => {
            if (choiceDiv.classList.contains('selected')) {
                choiceDiv.classList.remove('selected');
            }
            else {
                choiceDiv.classList.add('selected');
            }
        });
    }

    if (currentQuestionIndex < quiz.length) {
        startTimer();
    }
}

const checkAnswer = () => {
    const selectedChoice = document.querySelector('.choice.selected');
    if (selectedChoice.textContent === quiz[currentQuestionIndex].answer) {
        displayAlert("Respuesta Correcta");
        score++;
    }
    else {
        displayAlert(`Respuesta Incorrecta. La respuesta correcta es ${quiz[currentQuestionIndex].answer}`);
    }
    timeLeft = 60;
    currentQuestionIndex++;
    if (currentQuestionIndex < quiz.length) {
        showQuestions();
    }
    else {
        stopTimer();
        showScore();
    }
}

const showScore = () => {
    questionBox.textContent = "";
    choicesBox.textContent = "";
    scoreCard.textContent = `Puntuación: ${score} de ${quiz.length} preguntas correctas.`;
    displayAlert("Has completado este cuestionario.");
    nextBtn.textContent = "Jugar de nuevo";
    quizOver = true;
    timer.style.display = "none";
}

const displayAlert = (msg) => {
    alert.style.display = "block";
    alert.textContent = msg;
    setTimeout(() => {
        alert.style.display = "none";
    }, 2000);
}

const startTimer = () => {
    clearInterval(timerID);
    timer.textContent = timeLeft;

    const countDown = () => {
        timeLeft--;
        timer.textContent = timeLeft;
        if (timeLeft === 0) {
            const confirmUser = confirm("¡Tiempo agotado! ¿Quieres jugar el cuestionario de nuevo?");
            if (confirmUser) {
                timeLeft = 60;
                startQuiz();
            }
            else {
                startBtn.style.display = "block";
                container.style.display = "none";
                return;
            }
        }
    }
    timerID = setInterval(countDown, 1000);
}

const stopTimer = () => {
    clearInterval(timerID);
}

const shuffleQuestions = () => {
    for (let i = quiz.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quiz[i], quiz[j]] = [quiz[j], quiz[i]];
    }
    currentQuestionIndex = 0;
    showQuestions();
}

const startQuiz = () => {
    timeLeft = 60;
    timer.style.display = "flex";
    shuffleQuestions();
}

startBtn.addEventListener('click', () => {
    startBtn.style.display = "none";
    container.style.display = "block";
    startQuiz();
});

nextBtn.addEventListener('click', () => {
    const selectedChoice = document.querySelector('.choice.selected');
    if (!selectedChoice && nextBtn.textContent === "Siguiente") {
        displayAlert("Selecciona tu respuesta");
        return;
    }
    if (quizOver) {
        nextBtn.textContent = "Siguiente";
        scoreCard.textContent = "";
        currentQuestionIndex = 0;
        quizOver = false;
        score = 0;
        startQuiz();
    }
    else {
        checkAnswer();
    }
});

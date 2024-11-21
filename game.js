// Game data
const gameData = {
    capitals: [
        { question: "What is the capital of France?", answer: "Paris", options: ["London", "Paris", "Berlin", "Madrid"] },
        { question: "What is the capital of Japan?", answer: "Tokyo", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"] },
        { question: "What is the capital of Brazil?", answer: "Brasília", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Buenos Aires"] },
        { question: "What is the capital of Australia?", answer: "Canberra", options: ["Sydney", "Melbourne", "Perth", "Canberra"] },
        { question: "What is the capital of Egypt?", answer: "Cairo", options: ["Cairo", "Alexandria", "Luxor", "Giza"] }
    ],
    flags: [
        { question: "Which country's flag is this?", image: "https://flagcdn.com/w320/fr.png", answer: "France", options: ["Netherlands", "France", "Italy", "Russia"] },
        { question: "Which country's flag is this?", image: "https://flagcdn.com/w320/jp.png", answer: "Japan", options: ["South Korea", "China", "Japan", "Vietnam"] },
        { question: "Which country's flag is this?", image: "https://flagcdn.com/w320/br.png", answer: "Brazil", options: ["Argentina", "Colombia", "Brazil", "Mexico"] },
        { question: "Which country's flag is this?", image: "https://flagcdn.com/w320/gb.png", answer: "United Kingdom", options: ["United States", "Australia", "New Zealand", "United Kingdom"] },
        { question: "Which country's flag is this?", image: "https://flagcdn.com/w320/za.png", answer: "South Africa", options: ["Kenya", "Nigeria", "South Africa", "Egypt"] }
    ],
    landmarks: [
        { question: "Which famous landmark is this?", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a", answer: "Eiffel Tower", options: ["Big Ben", "Eiffel Tower", "Statue of Liberty", "Tower Bridge"] },
        { question: "Which famous landmark is this?", image: "https://images.unsplash.com/photo-1587495504299-ea5c91d97798", answer: "Taj Mahal", options: ["Taj Mahal", "Angkor Wat", "Petra", "Hagia Sophia"] },
        { question: "Which famous landmark is this?", image: "https://images.unsplash.com/photo-1590114538379-921188f9689d", answer: "Great Wall of China", options: ["Hadrian's Wall", "Great Wall of China", "Machu Picchu", "Petra"] },
        { question: "Which famous landmark is this?", image: "https://images.unsplash.com/photo-1555992336-fb0d29498b13", answer: "Colosseum", options: ["Parthenon", "Colosseum", "Acropolis", "Roman Forum"] },
        { question: "Which famous landmark is this?", image: "https://images.unsplash.com/photo-1526392060635-9d6019884377", answer: "Sydney Opera House", options: ["Sydney Opera House", "Royal Albert Hall", "La Scala", "Metropolitan Opera"] }
    ]
};

// Game state
let currentMode = '';
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 30;
let highScores = {
    capitals: 0,
    flags: 0,
    landmarks: 0
};

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const questionImage = document.getElementById('question-image');
const optionsContainer = document.querySelector('.options-container');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const finalScoreElement = document.getElementById('final-score');
const highScoreElement = document.getElementById('high-score');
const progressBar = document.querySelector('.progress');

// Event Listeners
document.querySelectorAll('.mode-btn').forEach(button => {
    button.addEventListener('click', () => startGame(button.dataset.mode));
});

document.getElementById('play-again').addEventListener('click', () => startGame(currentMode));
document.getElementById('change-mode').addEventListener('click', showStartScreen);

// Game Functions
function startGame(mode) {
    currentMode = mode;
    currentQuestions = [...gameData[mode]];
    shuffleArray(currentQuestions);
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 30;
    
    updateScore();
    showGameScreen();
    displayQuestion();
    startTimer();
}

function showStartScreen() {
    startScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.add('hidden');
    if (timer) clearInterval(timer);
}

function showGameScreen() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
}

function showResultScreen() {
    startScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    if (score > highScores[currentMode]) {
        highScores[currentMode] = score;
    }
    
    finalScoreElement.textContent = score;
    highScoreElement.textContent = highScores[currentMode];
}

function displayQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    
    if (question.image) {
        questionImage.style.display = 'block';
        questionImage.innerHTML = `<img src="${question.image}" alt="Quiz Image" style="max-width: 100%; height: auto;">`;
    } else {
        questionImage.style.display = 'none';
    }
    
    optionsContainer.innerHTML = '';
    shuffleArray(question.options).forEach(option => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
    
    updateProgress();
}

function checkAnswer(selectedAnswer) {
    const question = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    options.forEach(option => {
        option.disabled = true;
        if (option.textContent === question.answer) {
            option.classList.add('correct');
        } else if (option.textContent === selectedAnswer) {
            option.classList.add('wrong');
        }
    });
    
    if (selectedAnswer === question.answer) {
        score += 10;
        updateScore();
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
            displayQuestion();
        } else {
            endGame();
        }
    }, 1000);
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    if (timer) clearInterval(timer);
    showResultScreen();
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateProgress() {
    const progress = (currentQuestionIndex / currentQuestions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize game
showStartScreen();

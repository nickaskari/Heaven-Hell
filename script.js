let evilScore = 0;
let currentQuestion = 0;
const totalQuestions = 5;
let playerName = "";
const questions = [
  { question: "Is Mathias a battyboy", answers: ["Yes", "No"] },
  { question: "Is breaking the rules fun?", answers: ["Yes", "No"] },
  { question: "Do you think of yourself as powerful?", answers: ["Yes", "No"] },
  { question: "Do you enjoy chaos?", answers: ["Yes", "No"] },
  { question: "Diddy?", answers: ["Yes", "No"] }
];

// Sound effects using Howler.js
const buttonClickSound = new Howl({
  src: ['https://freesound.org/data/previews/49/49656_634166-lq.mp3']
});

// Start background music on quiz start
const backgroundMusic = new Howl({
  src: ['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
  loop: true,
  volume: 0.2
});

// Landing page buttons
const startGameBtn = document.getElementById('start-game-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');

// Sections
const landingPage = document.getElementById('landing-page');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const nameInputSection = document.getElementById('name-input-section');

// Question elements
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Name input form
const nameForm = document.getElementById('name-form');
const playerNameInput = document.getElementById('player-name');

// Start Game
startGameBtn.addEventListener('click', function() {
  resetGame();
  fadeOut(landingPage, 500);  // Reduce fade-out time to 0.5s
  backgroundMusic.play(); // Start background music
  setTimeout(() => {
    fadeIn(quizSection, 500);  // Reduce fade-in time to 0.5s
    loadQuestion();  // Ensure the first question loads right away
  }, 500);
});

// Leaderboard Button
leaderboardBtn.addEventListener('click', function() {
  fadeOut(landingPage, 500);  // Reduce fade-out time to 0.5s
  setTimeout(() => fadeIn(leaderboardSection, 500), 500);  // Reduce fade-in time to 0.5s
});

// Back to Home Button
backToHomeBtn.addEventListener('click', function() {
  fadeOut(leaderboardSection, 500);
  fadeOut(resultSection, 500);
  fadeOut(nameInputSection, 500);
  setTimeout(() => fadeIn(landingPage, 500), 500);  // Reduce fade-in time to 0.5s
  backgroundMusic.stop(); // Stop background music
});

// Name Submission
nameForm.addEventListener('submit', function(event) {
  event.preventDefault();
  playerName = playerNameInput.value;
  addToLeaderboard(playerName, evilScore);
  fadeOut(nameInputSection, 500);
  setTimeout(() => fadeIn(leaderboardSection, 500), 500);
});

// Load questions one by one
function loadQuestion() {
  if (currentQuestion < totalQuestions) {
    questionText.textContent = questions[currentQuestion].question;  // Ensure question text is updated

    // Only animate the button that was clicked
    yesBtn.onclick = () => handleAnswer("Yes", yesBtn);
    noBtn.onclick = () => handleAnswer("No", noBtn);
  } else {
    displayResult();
  }
}

// Handle Yes/No answers and press-in effect
function handleAnswer(answer, clickedButton) {
  buttonClickSound.play(); // Play button sound on click

  if (answer === "Yes") {
    evilScore += 100; // Increase score by 100 for "Yes"
  }
  currentQuestion++;

  // Immediately load the next question without any bounce effect
  loadQuestion();
}

// Display the final result and prompt name input
function displayResult() {
  fadeOut(quizSection, 500);  // Fade out the quiz section faster
  setTimeout(() => {
    fadeIn(resultSection, 500);  // Fade in the result section
    const resultMessage = document.getElementById('result-message');
    
    if (evilScore >= 200) {
      resultMessage.textContent = "You are a DEMON! You belong in HELL!";
    } else {
      resultMessage.textContent = "You are safe... for now!";
    }

    // Show name input after the result has been shown for 3 seconds
    setTimeout(() => {
      fadeOut(resultSection, 500);
      fadeIn(nameInputSection, 500);  // Prompt user to input name
    }, 3000);  // Wait 3 seconds before showing name input
  }, 500);  // Faster transition into result section
}

// Add result to leaderboard
function addToLeaderboard(name, score) {
  const leaderboard = document.getElementById('leaderboard-list');
  const playerEntry = document.createElement('tr');
  
  const nameCell = document.createElement('td');
  nameCell.textContent = name;
  
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score + " points";
  
  playerEntry.appendChild(nameCell);
  playerEntry.appendChild(scoreCell);
  
  leaderboard.appendChild(playerEntry);
}

// Reset the game when "Start Game" is pressed
function resetGame() {
  evilScore = 0;
  currentQuestion = 0;
  playerName = "";
  playerNameInput.value = "";
  quizSection.style.display = 'none';
  resultSection.style.display = 'none';
  nameInputSection.style.display = 'none';
}

// Fade-in and fade-out transitions
function fadeOut(element, duration = 500) {  // Set default to 500ms for faster transitions
  element.style.transition = `opacity ${duration}ms ease-out`;
  element.style.opacity = 0;
  setTimeout(() => {
    element.style.display = "none";
  }, duration);
}

function fadeIn(element, duration = 500) {  // Set default to 500ms for faster transitions
  element.style.display = "flex";
  element.style.opacity = 0;
  element.style.transition = `opacity ${duration}ms ease-in`;
  setTimeout(() => {
    element.style.opacity = 1;
  }, 10);
}

// Initialize particles.js for the background effect
particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ff4500"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#ff4500"
      },
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 5,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 20,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "retina_detect": true
});

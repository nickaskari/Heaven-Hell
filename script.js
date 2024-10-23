let evilScore = 0;
let currentQuestion = 0;
const totalQuestions = 5;
let playerName = "";
let countdownInterval = null;
const questions = [
  { question: "Do you eat kids?", answers: ["Yes", "No"] },
  { question: "Is breaking the rules fun?", answers: ["Yes", "No"] },
  { question: "Diddy do it?", answers: ["Yes", "No"] },
  { question: "Would you rather poop nails or poop bricks?", answers: ["Yes", "No"] },
  { question: "Do you often use the phrase: Now its demon time!! ", answers: ["Yes", "No"] }
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

// Intense countdown music and alarm sound
const countdownMusic = new Howl({
  src: ['https://freesound.org/data/previews/75/75599_634166-lq.mp3'],  // Add your intense music URL here
  loop: true,
  volume: 0.3
});

const alarmSound = new Howl({
  src: ['https://actions.google.com/sounds/v1/alarms/spaceship_alarm.ogg'],  // Google public domain alarm sound
  loop: true,
  volume: 0.5
});

// Password to reset leaderboard (change this as needed)
const resetPassword = "bro";

// Landing page buttons
const startGameBtn = document.getElementById('start-game-btn');
const leaderboardBtn = document.getElementById('leaderboard-btn');
const backToHomeBtn = document.getElementById('back-to-home-btn');
const resetLeaderboardBtn = document.getElementById('reset-leaderboard-btn');

// Sections
const landingPage = document.getElementById('landing-page');
const quizSection = document.getElementById('quiz-section');
const resultSection = document.getElementById('result-section');
const leaderboardSection = document.getElementById('leaderboard-section');
const nameInputSection = document.getElementById('name-input-section');
const countdownSection = document.createElement('div');  // Countdown element for drink challenge
countdownSection.id = 'countdown-section';
countdownSection.style.display = 'none';
quizSection.appendChild(countdownSection);

// Question elements
const questionText = document.getElementById('question-text');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Name input form
const nameForm = document.getElementById('name-form');
const playerNameInput = document.getElementById('player-name');

// Load leaderboard from local storage when the page loads
window.onload = loadLeaderboard;

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

// Reset Leaderboard Button with password prompt inside leaderboard section
resetLeaderboardBtn.addEventListener('click', function() {
  const enteredPassword = prompt("Enter the password to reset the leaderboard:");
  if (enteredPassword === resetPassword) {
    resetLeaderboard();
    alert("Leaderboard has been reset.");
  } else {
    alert("Incorrect password.");
  }
});

// Name Submission
nameForm.addEventListener('submit', function(event) {
  event.preventDefault();
  playerName = playerNameInput.value;
  addToLeaderboard(playerName, evilScore);
  saveLeaderboard();  // Save the leaderboard to local storage
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

    // Randomly trigger a drink countdown or jumpscare during the quiz
    if (Math.random() < 0.3) {
      triggerCountdown();  // 30% chance for countdown
    } else {
      randomJumpscare();  // Additional chance for jumpscare
    }

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

// Trigger a countdown during the quiz for the user to "chug their drink"
function triggerCountdown() {
  countdownSection.style.display = 'flex';  // Show countdown section
  countdownSection.classList.add('urgent');  // Add urgent styling
  let countdown = 10;  // Countdown from 10 seconds

  // Pause background music and play countdown music + alarm sound
  backgroundMusic.pause();
  countdownMusic.play();
  alarmSound.play();

  countdownSection.innerHTML = `<h2>Chug your drink or you'll go to hell in <span id="countdown-timer">${countdown}</span> seconds!</h2>`;

  countdownInterval = setInterval(() => {
    countdown--;
    document.getElementById('countdown-timer').textContent = countdown;

    if (countdown <= 0) {
      clearInterval(countdownInterval);  // Stop countdown
      countdownSection.style.display = 'none';  // Hide countdown
      countdownMusic.stop();
      alarmSound.stop();
      backgroundMusic.play();  // Resume background music
    }
  }, 1000);  // 1-second intervals for countdown
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

function addToLeaderboard(name, score) {
  const leaderboard = document.getElementById('leaderboard-list');
  const playerEntry = document.createElement('tr');
  
  const nameCell = document.createElement('td');
  nameCell.textContent = name;
  
  const scoreCell = document.createElement('td');
  scoreCell.textContent = score + " points";  // Ensure score is saved correctly
  
  playerEntry.appendChild(nameCell);
  playerEntry.appendChild(scoreCell);
  
  leaderboard.appendChild(playerEntry);
}


// Save leaderboard to local storage
function saveLeaderboard() {
  const leaderboard = document.getElementById('leaderboard-list');
  const rows = leaderboard.getElementsByTagName('tr');
  const leaderboardData = [];

  for (let i = 0; i < rows.length; i++) {
    const name = rows[i].getElementsByTagName('td')[0].textContent;
    const score = rows[i].getElementsByTagName('td')[1].textContent;
    leaderboardData.push({ name, score });
  }

  localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

function loadLeaderboard() {
  const savedLeaderboard = localStorage.getItem('leaderboard');
  if (savedLeaderboard) {
    const leaderboardData = JSON.parse(savedLeaderboard);

    // Sort the leaderboard data by score in descending order
    leaderboardData.sort((a, b) => {
      const scoreA = parseInt(a.score);  // Convert score to integer
      const scoreB = parseInt(b.score);  // Convert score to integer
      return scoreB - scoreA;  // Descending order
    });

    // Display sorted leaderboard
    leaderboardData.forEach(entry => addToLeaderboard(entry.name, entry.score));
  }
}


// Reset leaderboard
function resetLeaderboard() {
  localStorage.removeItem('leaderboard');
  document.getElementById('leaderboard-list').innerHTML = '';
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
  countdownSection.style.display = 'none';  // Hide countdown on game reset
  clearInterval(countdownInterval);  // Clear any ongoing countdown
  countdownMusic.stop();
  alarmSound.stop();
  backgroundMusic.stop();  // Stop any music
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

let jumpscareSound;  // Declare the sound variable

// Load the sound and set it to start 5 seconds before it ends
jumpscareSound = new Howl({
  src: ['./scarysound.mp3'],  // Ensure the sound file is in the root directory
  volume: 1,
  onload: function() {
    const duration = jumpscareSound.duration();  // Get the duration of the sound
    const startTime = Math.max(0, duration - 8);  // Start 5 seconds before the end
    jumpscareSound.seek(startTime);  // Seek to that point
  }
});



// Function to trigger the jumpscare
function triggerJumpscare() {
  const jumpscareSection = document.getElementById('jumpscare-section');

  // Show jumpscare image
  jumpscareSection.style.display = 'flex';

  // Play jumpscare sound
  jumpscareSound.play();

  // Capture picture after jumpscare starts
  setTimeout(() => {
    capturePicture();  // Capture the picture after the jumpscare
    jumpscareSection.style.display = 'none';
  }, 2000);  // Adjust the time for how long the jumpscare lasts
}



// Randomly trigger jumpscare during the game
function randomJumpscare() {
  if (Math.random() < 0.2) {  // 20% chance to trigger jumpscare
    triggerJumpscare();
  }
}

const video = document.getElementById('player-video');
const canvas = document.getElementById('snapshot-canvas');

// Initialize webcam
function startWebcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(error => {
      console.error("Error accessing the camera:", error);
    });
}

// Capture image and store it
function capturePicture() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert the captured image to a base64 string
  const imageData = canvas.toDataURL('image/png');

  // Save the picture
  savePicture(imageData);
}

// Save picture to localStorage
function savePicture(imageData) {
  let pictures = JSON.parse(localStorage.getItem('jumpscarePictures')) || [];
  pictures.push({ image: imageData });
  localStorage.setItem('jumpscarePictures', JSON.stringify(pictures));
}

const picturesList = document.getElementById('pictures-list');
const viewPicturesBtn = document.getElementById('view-pictures-btn');
const picturesGallery = document.getElementById('pictures-gallery');
const backToHomeFromPictures = document.getElementById('back-to-home-from-pictures');

// Load and display pictures
function loadPictures() {
  const pictures = JSON.parse(localStorage.getItem('jumpscarePictures')) || [];

  picturesList.innerHTML = '';  // Clear previous pictures

  pictures.forEach(picture => {
    const img = document.createElement('img');
    img.src = picture.image;
    img.alt = 'Jumpscare Picture';
    img.style.width = '200px';  // Resize image as needed
    img.style.margin = '10px';
    picturesList.appendChild(img);
  });
}

// Show picture gallery when "View Jumpscare Pictures" is clicked
viewPicturesBtn.addEventListener('click', function() {
  fadeOut(landingPage, 500);
  setTimeout(() => {
    fadeIn(picturesGallery, 500);
    loadPictures();  // Load pictures when the gallery is opened
  }, 500);
});


// Back to home button on picture gallery
backToHomeFromPictures.addEventListener('click', function() {
  fadeOut(picturesGallery, 500);
  setTimeout(() => fadeIn(landingPage, 500), 500);  // Return to the main menu
});


startGameBtn.addEventListener('click', function() {
  resetGame();
  startWebcam();  // Start the webcam when the game starts
  fadeOut(landingPage, 500);
  setTimeout(() => {
    fadeIn(quizSection, 500);
    loadQuestion();
  }, 500);
});

const galleryBtn = document.getElementById('gallery-btn');

// Show the gallery when the "Gallery" button is clicked
galleryBtn.addEventListener('click', function() {
  fadeOut(landingPage, 500);  // Hide the start menu
  setTimeout(() => {
    fadeIn(picturesGallery, 500);  // Show the gallery
    loadPictures();  // Load pictures when the gallery is opened
  }, 500);
});

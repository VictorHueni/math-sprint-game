// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0s';

// Scroll
let valueY = 0;

// Reset Game
function playAgain() {
    gamePage.addEventListener('click', startTimer);
    scorePage.hidden = true;
    splashPage.hidden = false;
    equationsArray = [];
    playerGuessArray = [];
    valueY = 0;
    playAgainBtn.hidden = false;
}

// Show Score Page
function showScorePage() {
    scorePage.hidden = false;
    gamePage.hidden = true;
    // Show Play Again button after 1 seconds
    setTimeout(() => {
        playAgainBtn.hidden = false;
    }, 1000);
}

// Format & display time in DOM
function scoresToDOM() {
    finalTimeDisplay = finalTime.toFixed(1);
    baseTime = timePlayed.toFixed(1);
    penaltyTime = penaltyTime.toFixed(1);

    finalTimeEl.textContent = `${finalTimeDisplay}s`;
    baseTimeEl.textContent = `Base Time: ${baseTime}s`;
    penaltyTimeEl.textContent = `Penalty Time: +${penaltyTime}s`;
    //Scroll to Top, go to score page
    itemContainer.scrollTo({ top: 0, behavior: 'instant' });
    showScorePage();

}

// Stop Timer, Process Results, go to Score Page
function checkTime() {
    if (playerGuessArray.length == questionAmount) {
        clearInterval(timer);
        // Check for wrong guessses, add penalty time
        equationsArray.forEach((equation, index) => {
            if (equation.evaluated === playerGuessArray[index]) {
                //Correct guess, no penalty

            } else {
                // Incorrect guess, add penalty
                penaltyTime += 0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        scoresToDOM();
    }
}

// Add a tenth of a second to timePLayed
function addTime() {
    timePlayed += 0.1;
    checkTime();
}

// Start Timer when game page is clicked
function startTimer() {
    // Reset times
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0;
    timer = setInterval(addTime, 100);
    gamePage.removeEventListener('click', startTimer);
}

//Scrol, store user selection in playerGuessArray
function select(guessedTrue) {
    // Scroll 80px
    valueY += 80;
    itemContainer.scroll(0, valueY);
    // Add player guess to array
    return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false')
}

// Display  game page
function showGamePage() {
    gamePage.hidden = false;
    countdownPage.hidden = true;
}

// Get Random Number up to a max number
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// Create Correct/Incorrect Random Equations
function createEquations() {
    // Randomly choose how many correct equations there should be
    const correctEquations = getRandomInt(questionAmount);
    // Set amount of wrong equations
    const wrongEquations = questionAmount - correctEquations;
    // Loop through, multiply random numbers up to 9, push to array
    for (let i = 0; i < correctEquations; i++) {
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
        equationObject = { value: equation, evaluated: 'true' };
        equationsArray.push(equationObject);
    }
    // Loop through, mess with the equation results, push to array
    for (let i = 0; i < wrongEquations; i++) {
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
        wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
        wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
        const formatChoice = getRandomInt(3);
        const equation = wrongFormat[formatChoice];
        equationObject = { value: equation, evaluated: 'false' };
        equationsArray.push(equationObject);
    }
    shuffle(equationsArray);
}

// Add equations to DOM
function equationsToDOM() {
    equationsArray.forEach((equation) => {
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        //Equation Text
        const equationText = document.createElement('h1');
        equationText.textContent = equation.value;
        // Append
        item.appendChild(equationText);
        itemContainer.appendChild(item);
    });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
    // Reset DOM, Set Blank Space Above
    itemContainer.textContent = '';
    // Spacer
    const topSpacer = document.createElement('div');
    topSpacer.classList.add('height-240');
    // Selected Item
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');
    // Append
    itemContainer.append(topSpacer, selectedItem);

    // Create Equations, Build Elements in DOM
    createEquations();
    equationsToDOM();

    // Set Blank Space Below
    const bottomSpacer = document.createElement('div');
    bottomSpacer.classList.add('height-500');
    itemContainer.appendChild(bottomSpacer);
}

// Display 3, 2, 1, Go !
function countdownStart() {
    let delay = 0;
    for (let i = 3; i >= 0; i--) {
        delay += 1000;
        setTimeout(() => {
            countdown.textContent = i > 0 ? `${i}` : 'Go!';
        }, delay);
    }
}

// Navigate from splash page to coutdown page
function showCountdown() {
    countdownPage.hidden = false;
    splashPage.hidden = true;
    countdownStart();
    populateGamePage();
    setTimeout(showGamePage, 5000);
}

// Get the value from the selected radio button
function getRadioValue() {
    let radioValue;
    radioInputs.forEach((radioInput) => {
        if (radioInput.checked) {
            radioValue = radioInput.value;
        }
    });
    return radioValue;
}

// form that decides amount of questions
function selectQuestionAmount(e) {
    e.preventDefault();
    questionAmount = getRadioValue();
    if (questionAmount) {
        showCountdown();
    }
}

// Event Listeners
startForm.addEventListener('click', () => {
    radioContainers.forEach((radioEl) => {
        // Remove selectede label styling
        radioEl.classList.remove('selected-label');
        // Add it back if radio is checked
        if (radioEl.children[1].checked) {
            radioEl.classList.add('selected-label');
        }
    });
});


startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer)
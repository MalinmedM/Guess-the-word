//The unordered list where the player’s guessed letters will appear
const guessedLettersList = document.querySelector(".guessed-letters");
//The button with the text “Guess!” in it
const guessButton = document.querySelector(".guess");
//The text input where the player will guess a letter
const letterInput = document.querySelector(".letter");
//The empty paragraph where the word in progress will appear
const wordInProgress = document.querySelector(".word-in-progress");
//The paragraph where the remaining guesses will display
const remainingGuessesElement = document.querySelector(".remaining");
//The span inside the paragraph where the remaining guesses will display
const remainingGuessesSpan = document.querySelector(".remaining span");
//The empty paragraph where messages will appear when the player guesses a letter
const messageAppear = document.querySelector(".message");
//The hidden button that will appear prompting the player to play again
const playAgainButton = document.querySelector(".play-again hide")

//Starting word to test out the game
let word = "magnolia";
//Array for containing all the letters the player guessed
const guessedLetters = [];
//Variable for the number of guesses
let remainingGuesses = 8;

const getWord = async function(){
    const wordRequest = await fetch (`https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt`);
    const words = await wordRequest.text();
    //Seeing the retrieved data: console.log(words);
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * words.length);
    word = wordArray[randomIndex].trim();
    placeholders(word);
};
//Fire off the game: 
getWord();

//Function to Add Placeholders for Each Letter
//explanation of the circles for word: So with your placeholder function, you're first creating an empty array called placeholderLetters . Then your for loop is saying "for every letter that exists in word , I'm going to put in a new circle into the placeholder array. So you're not tampering with the actual word , you're creating a new array and creating a circle every time it loops through a letter from the word and it loops until it goes through each letter then stops! So you end up with the exact amount of circles that existed in the word
const placeholders = function(word){
    //Empty array to be filled with dots
    const placeholderLetters = [];
    //for of to loop over the word to fill the array
    for(const letter of word){
        console.log(letter);
        placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
};

placeholders(word);

guessButton.addEventListener("click", function(e){
    //Prevents default behaviour of clicking button, form submitting and reloading page
    e.preventDefault();
    //emptying message element
    messageAppear.innerText = "";
    const guess = letterInput.value;
    //making sure its a single letter
    const goodGuess = validateInput(guess);
    console.log(guess);
    
    if (goodGuess) {
        makeGuess(guess);
    }

    letterInput.value = "";
});

//Checking players input
const validateInput = function(input){
    //regular expression to ensure input is a letter
    const acceptedLetter = /[a-zA-Z]/;
    //is input empty?
    if (input.length === 0) {
        messageAppear.innerText = "Try another letter!";
    } else if (input.length > 1) {
        messageAppear.innerText = "Please only one letter at a time.";
    } else if (!input.match(acceptedLetter)) {
        messageAppear.innerText = "Letters only, please.";
    } else {
        return input;
    }
};

//Function to capture input
const makeGuess = function(guess) {
    //converting letter to uppercase
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        messageAppear.innerText = "You have already guessed that letter. Try again!"
    } else {
        guessedLetters.push(guess);
        
        console.log(guessedLetters);
        postGuessedLetters();
        wordUpdate(guessedLetters);
        guessCounter(guess);
    }
};

const postGuessedLetters = function(){
    //clear list first
    guessedLettersList.innerHTML = "";
    //looping over the array to put guessed letters in it
    for (const letter of guessedLetters) {
        const listItem = document.createElement("li");
        listItem.innerText = letter;
        guessedLettersList.append(listItem);
    }
};

//Updates the word in progress
const wordUpdate = function(guessedLetters){
    const wordUpper = word.toUpperCase();
    //split the word string into an array so that the letter can appear in the guessedLetters array
    const wordArray = wordUpper.split("");
    const revealWord = [];
    //loopar letter över wordArray för att se om den gissade bokstaven finns i word
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("●");
        }
    }
    //console.log(revealWord);
    wordInProgress.innerText = revealWord.join("");
    playerWin();
};

//Function to count guesses remaining
const guessCounter = function(guess){
    const upperWord = word.toUpperCase();
    if(!upperWord.includes(guess)) {
        messageAppear.innerText = `Sorry, the word does not contain ${guess}.`;
        remainingGuesses -= 1;
    } else {
        messageAppear.innerText = "You guessed it!"
    }

    if(remainingGuesses === 0){
        messageAppear.innerHTML =`Game over! The word was <span class="highlight">${word}</span>. Better luck next time!`;
    }
    else if(remainingGuesses === 1){
        remainingGuessesSpan.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesSpan.innerText = `${remainingGuesses} guesses`;
    }
};

//Function to Check If the Player Won
const playerWin = function(){
    if (word.toUpperCase() === wordInProgress.innerText) {
        messageAppear.classList.add("win");
        messageAppear.innerHTML = `<p class="highlight">You guessed the word! Congrats!</p>`;
    }
};

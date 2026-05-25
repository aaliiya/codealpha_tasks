const wordDisplay = document.getElementById("word-display");
const guessedLetters = document.getElementById("guessed-letters");
const attempts = document.getElementById("attempts");
const message = document.getElementById("message");
const guessBtn = document.getElementById("guess-btn");
const restartBtn = document.getElementById("restart-btn");
const input = document.getElementById("letter-input");
const statusBanner = document.getElementById("status-banner");

const winsText = document.getElementById("wins");
const lossesText = document.getElementById("losses");

const parts = document.querySelectorAll(".part");

async function startGame() {
    const response = await fetch("/start");
    const data = await response.json();

    updateUI(data);

    message.textContent = "";

    parts.forEach(part => {
        part.classList.add("hidden");
    });
}

function updateHangman(wrongGuesses) {
    for (let i = 0; i < wrongGuesses; i++) {
        parts[i].classList.remove("hidden");
    }
}

function updateUI(data) {
    wordDisplay.textContent = data.hidden_word;
    guessedLetters.textContent = data.guessed_letters.join(", ");
    attempts.textContent = data.remaining_attempts;

    winsText.textContent = data.wins;
    lossesText.textContent = data.losses;

    if (data.status === "won") {
        statusBanner.textContent = "🎉 You Won!";
        statusBanner.style.background = "#c8f7c5";
    } else if (data.status === "lost") {
        statusBanner.textContent = "💀 You Lost!";
        statusBanner.style.background = "#ffb3b3";
    } else {
        statusBanner.textContent = "🎮 Playing";
        statusBanner.style.background = "#f1f1f1";
    }
}

async function makeGuess() {
    const letter = input.value.trim();

    if (!letter) return;

    const response = await fetch("/guess", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ letter })
    });

    const data = await response.json();

    if (data.error) {
        message.textContent = data.error;
        message.className = "message wrong";
        return;
    }

    updateUI(data);

    updateHangman(data.wrong_guesses);

    if (data.status === "won") {
        message.textContent = "Congratulations! You guessed the word!";
        message.className = "message correct";
    } else if (data.status === "lost") {
        message.textContent = `Game Over! Word was: ${data.correct_word}`;
        message.className = "message wrong";
    } else {
        message.textContent = "";
    }

    input.value = "";
}

guessBtn.addEventListener("click", makeGuess);

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        makeGuess();
    }
});

restartBtn.addEventListener("click", startGame);

startGame();
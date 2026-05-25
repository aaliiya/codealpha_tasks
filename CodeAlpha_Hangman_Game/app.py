from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)

# Predefined word list
WORDS = ["python", "flask", "coding", "gaming", "browser"]

# Game state
game_data = {
    "word": "",
    "guessed_letters": [],
    "wrong_guesses": 0,
    "max_attempts": 6,
    "wins": 0,
    "losses": 0
}


def start_new_game():
    game_data["word"] = random.choice(WORDS)
    game_data["guessed_letters"] = []
    game_data["wrong_guesses"] = 0


def get_hidden_word():
    return " ".join([
        letter if letter in game_data["guessed_letters"] else "_"
        for letter in game_data["word"]
    ])


def check_game_status():
    word = game_data["word"]

    if all(letter in game_data["guessed_letters"] for letter in word):
        game_data["wins"] += 1
        return "won"

    if game_data["wrong_guesses"] >= game_data["max_attempts"]:
        game_data["losses"] += 1
        return "lost"

    return "playing"


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/start", methods=["GET"])
def start():
    start_new_game()

    return jsonify({
        "hidden_word": get_hidden_word(),
        "guessed_letters": [],
        "remaining_attempts": game_data["max_attempts"],
        "status": "playing",
        "wins": game_data["wins"],
        "losses": game_data["losses"]
    })


@app.route("/guess", methods=["POST"])
def guess():
    data = request.get_json()
    letter = data.get("letter", "").lower()

    # Validation
    if not letter.isalpha() or len(letter) != 1:
        return jsonify({"error": "Please enter a single valid letter."})

    if letter in game_data["guessed_letters"]:
        return jsonify({"error": "Letter already guessed!"})

    game_data["guessed_letters"].append(letter)

    if letter not in game_data["word"]:
        game_data["wrong_guesses"] += 1

    status = check_game_status()

    response = {
        "hidden_word": get_hidden_word(),
        "guessed_letters": game_data["guessed_letters"],
        "remaining_attempts": game_data["max_attempts"] - game_data["wrong_guesses"],
        "status": status,
        "wrong_guesses": game_data["wrong_guesses"],
        "wins": game_data["wins"],
        "losses": game_data["losses"]
    }

    if status == "lost":
        response["correct_word"] = game_data["word"]

    return jsonify(response)


if __name__ == "__main__":
    start_new_game()
    app.run(debug=True)
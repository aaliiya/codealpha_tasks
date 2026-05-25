from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Predefined chatbot responses
responses = {
    "hello": "Hi there! 👋",
    "hi": "Hello! 😊",
    "how are you": "I'm fine, thanks! How about you?",
    "what is your name": "I'm your chatbot assistant 🤖",
    "bye": "Goodbye! Have a great day 👋",
    "thanks": "You're welcome 😊",
    "thank you": "Happy to help!",
    "who created you": "I was created using Python and Flask.",
    "help": "You can say hello, ask my name, or chat with me!",
    "good morning": "Good morning ☀️",
    "good night": "Good night 🌙"
}


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get_response", methods=["POST"])
def get_response():
    data = request.get_json()

    user_message = data.get("message", "").lower().strip()

    bot_reply = responses.get(
        user_message,
        "Sorry, I don't understand that."
    )

    return jsonify({
        "reply": bot_reply
    })


if __name__ == "__main__":
    app.run(debug=True)
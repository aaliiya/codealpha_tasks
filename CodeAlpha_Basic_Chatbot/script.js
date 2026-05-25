const chatBox = document.getElementById("chat-box");
const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const clearChatBtn = document.getElementById("clear-chat");
const typingIndicator = document.getElementById("typing-indicator");


function getCurrentTime() {
    const now = new Date();

    return now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
}


function addMessage(message, sender) {

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);

    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="timestamp">${getCurrentTime()}</div>
    `;

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    addMessage(message, "user");

    userInput.value = "";

    typingIndicator.style.display = "block";

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/get_response", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        setTimeout(() => {

            typingIndicator.style.display = "none";

            addMessage(data.reply, "bot");

        }, 1000);

    } catch (error) {

        typingIndicator.style.display = "none";

        addMessage("Error connecting to server.", "bot");
    }
}


sendBtn.addEventListener("click", sendMessage);


userInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }
});


clearChatBtn.addEventListener("click", () => {

    chatBox.innerHTML = `
        <div class="message bot-message">
            <div class="message-content">
                Chat cleared successfully ✅
            </div>
            <div class="timestamp">${getCurrentTime()}</div>
        </div>
    `;
});
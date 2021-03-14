// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
const messageForm = document.getElementById('message-form');
const messageBox = document.getElementById('message-box');
const messages = document.getElementById('messages');

const options = {
    accessTokenFactory: getToken
};

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat", options)
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on('newMessage', (sender, messageText) => {
    console.log(`${sender}:${messageText}`);

    const newMessage = document.createElement('li');
    newMessage.appendChild(document.createTextNode(`${sender}:${messageText}`));
    messages.appendChild(newMessage);
});

connection.start()
    .then(() => console.log('connected!'))
    .catch(console.error);

messageForm.addEventListener('submit', ev => {
    ev.preventDefault();
    const message = messageBox.value;
    connection.invoke('SendMessage', message);
    messageBox.value = '';
});

function getToken() {
    const xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
        xhr.onreadystatechange = function () {
            if (this.readyState !== 4) return;
            if (this.status == 200) {
                resolve(this.responseText);
            } else {
                reject(this.statusText);
            }
        };
        xhr.open("GET", "/api/token");
        xhr.send();
    });
}
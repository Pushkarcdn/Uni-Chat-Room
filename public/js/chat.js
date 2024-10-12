let userName;
let userID;

const setName = () => {
    if (localStorage.getItem("userName")) {

        userName = localStorage.getItem("userName");

    } else {
        while (!userName) {
            userName = prompt("Enter your name");
        }
        localStorage.setItem("userName", userName);
    }
    document.querySelector(".my-name").innerText = `Chatting as ${userName}`;
}

const setID = () => {
    if (localStorage.getItem("userID")) {
        userID = localStorage.getItem("userID");
    } else {
        userID = Math.floor(Math.random() * 990000999 + 256);
        localStorage.setItem("userID", userID);
    }
}

setName();
setID();

const isAdmin = userID === "pushkarcdn";

const socket = io('/', {
    query: {
        userName: userName,
        userID: localStorage.getItem("userID")
    }
});

const sendMessage = (event) => {

    event.preventDefault();

    const msgInput = document.forms['msgform']['message'];

    const message = msgInput.value;

    if (!message.trim()) return;

    socket.emit("message", userID, userName, message);

    msgInput.value = "";

}


const deleteMessage = async (messageID) => {

    socket.emit("delete", messageID);

    const message = document.getElementById(messageID).remove();

}

const insertMessage = (messageID, userId, userName, message, time) => {

    // console.log(messageID);

    isMyMessage = userId == userID;

    const div = document.createElement("div");

    classes = `w-full flex items-start gap-2.5 ${isMyMessage ? 'justify-end' : 'justify-start'}`;

    div.className = classes;

    div.id = messageID;

    div.innerHTML = `
    <div class='min-w-64 sm:min-w-96 flex gap-4 ${isMyMessage ? 'flex-row-reverse' : ''}'>

            <img class="w-8 h-8 rounded-full" src="/images/person.jpg" alt="Jese image">

            <div
                class="flex flex-col w-full sm:max-w-[80%] leading-1.5 p-4 border-gray-200 bg-white rounded-es-xl dark:bg-gray-700 rounded-xl ${isMyMessage ? ' rounded-tr-sm' : 'rounded-tl-sm'}">

                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">${userName}</span>
                    <span class="text-xs font-normal text-gray-500 dark:text-gray-400">${time}</span>
                </div>

                <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                    ${message}
                </p>

                <span class="text-xs font-normal text-gray-500 dark:text-gray-400">Delivered</span>

                <button 
                    class='text-right text-red-500 text-xs font-medium ${(isAdmin || (userId == userID)) ? 'block' : 'hidden'}'
                    id='delete-${messageID}'
                >
                    delete
                </button>

            </div>

        </div>

    `
    const parent = document.getElementById("parent");

    parent.appendChild(div);

    parent.scrollTop = parent.scrollHeight;

    // Add the onClick event listener for the delete button
    const deleteButton = document.getElementById(`delete-${messageID}`);
    deleteButton.addEventListener('click', () => {
        deleteMessage(messageID);
    });

}

function formatDate(dateString) {

    const date = new Date(dateString);
    const now = new Date();

    // Helper function to format the time in 12-hour format with AM/PM
    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
        return `${hours}:${minutes} ${ampm}`;
    };

    // Check if the date is today
    const isToday = (date.getDate() === now.getDate()) &&
        (date.getMonth() === now.getMonth()) &&
        (date.getFullYear() === now.getFullYear());

    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = (date.getDate() === yesterday.getDate()) &&
        (date.getMonth() === yesterday.getMonth()) &&
        (date.getFullYear() === yesterday.getFullYear());

    // Format the time
    const time = formatTime(date);

    if (isToday) {
        return time;
    } else if (isYesterday) {
        return `${time}, Yesterday`;
    } else {
        // Format the date as '12 Jan'
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return `${time} | ${day} ${month}`;
    }
}


const loadOldMessages = async () => {

    const response = await fetch("/messages");

    const messages = await response.json();

    messages.forEach(message => {

        let time = formatDate(message.createdAt);

        insertMessage(message._id, message.userID, message.userName, message.message, time);

    });

}

loadOldMessages();

socket.on("message", (userId, messageID, userName, message, time) => {

    insertMessage(messageID, userId, userName, message, time);

});

socket.on("updated", () => {
    loadOldMessages();
})

const rename = () => {

    let newName;

    newName = prompt("Enter your name");

    if (!newName.trim()) return;

    if (newName) {
        if (newName.length > 20) {
            alert("Name should be less than 20 characters");
            return;
        }
    }

    localStorage.setItem("userName", newName);
    userName = newName;
    document.querySelector(".my-name").innerText = `Chatting as ${newName}`;

}


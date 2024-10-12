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

    socket.emit("message", userID, userName, message);

    msgInput.value = "";

}

socket.on("message", (userId, userName, message) => {

    isMyMessage = userId == userID;

    const div = document.createElement("div");

    classes = `w-full flex items-start gap-2.5 ${isMyMessage ? 'justify-end' : 'justify-start'}`;

    div.className = classes;

    div.innerHTML = `
    <div class='min-w-64 sm:min-w-96 flex gap-4 ${isMyMessage ? 'flex-row-reverse' : ''}'>

            <img class="w-8 h-8 rounded-full" src="/images/person.jpg" alt="Jese image">

            <div
                class="flex flex-col w-full max-w-[1000px] leading-1.5 p-4 border-gray-200 bg-white rounded-es-xl dark:bg-gray-700 rounded-xl ${isMyMessage ? ' rounded-tr-sm' : 'rounded-tl-sm'}">

                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">${userName}</span>
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                </div>

                <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                    ${message}
                </p>

                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>

            </div>

        </div>

    `
    const parent = document.getElementById("parent");

    parent.appendChild(div);

    parent.scrollTop = parent.scrollHeight;

});




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


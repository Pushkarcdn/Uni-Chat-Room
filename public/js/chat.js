const socket = io();

const sendMessage = (event) => {

    event.preventDefault();

    const msgInput = document.forms['msgform']['message'];

    const message = msgInput.value;

    socket.emit("message", message);

    msgInput.value = "";

}

socket.on("message", (msg) => {

    // console.log(msg);

    const div = document.createElement("div");

    div.innerHTML = `
    <div class="flex items-start gap-2.5 min-w-96">

            <img class="w-8 h-8 rounded-full" src="/images/person.jpg" alt="Jese image">

            <div
                class="flex flex-col w-full max-w-[1000px] leading-1.5 p-4 border-gray-200 bg-white rounded-e-xl rounded-es-xl dark:bg-gray-700">

                <div class="flex items-center space-x-2 rtl:space-x-reverse">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">Bonnie Green</span>
                    <span class="text-sm font-normal text-gray-500 dark:text-gray-400">11:46</span>
                </div>

                <p class="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                    ${msg}
                </p>

                <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Delivered</span>

            </div>

        </div>
    `
    const parent = document.getElementById("parent");

    parent.appendChild(div);

    parent.scrollTop = parent.scrollHeight;

});
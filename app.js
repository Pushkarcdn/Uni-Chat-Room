import express from "express";
import http from "http";
import { Server } from 'socket.io';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const port = process.env.PORT || 3005;

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

io.on("connection", (socket) => {

    const userName = socket.handshake.query.userName;

    console.log(userName, " connected");

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });

    socket.on("message", (userID, userName, message) => {

        io.emit("message", userID, userName, message);

    });

})

server.listen(port, () => {
    console.log('server running at ' + port);
});
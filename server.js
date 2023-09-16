const express = require("express");
let app = express();
const mongoose = require("mongoose");
let expressWs = require("express-ws")(app);
const Chat = require("./model/chat");
const ChatList = require("./model/chatsList");
require("dotenv").config();
const jwt = require("jsonwebtoken");

mongoose
  .connect(
    "mongodb+srv://alim:123qweasdzxc@cluster0.bxjnnrq.mongodb.net/twi?retryWrites=true&w=majority&appName=AtlasApp"
  )
  .then((res) => console.log("db connect"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// app.use(express.json())
// app.use(express.raw())

app.use("/api", require("./routes/api"));

app.ws("/chat/:id/:token", async (ws, req) => {
  console.log("Hey");
  let chatDetails = await ChatList.findOne({ _id: req.params.id })
    .select("-createdAt -updatedAt -__v")
    .populate("firstUser", "-password -token -updatedAt -createdAt -__v")
    .populate("secondUser", "-password -token -updatedAt -createdAt -__v");
  jwt.verify(req.params.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      console.log(err);
    } else {
      if (
        chatDetails.firstUser.id === authData._id ||
        chatDetails.secondUser.id === authData._id
      ) {
        ws.clientId = authData._id;
      } else {
        ws.close();
      }
    }
  });

  ws.on("message", async (msg) => {
    const parserMsg = JSON.parse(msg);
    if (
      ws.clientId === chatDetails.firstUser.id ||
      ws.clientId === chatDetails.secondUser.id
    ) {
    const newChat = new Chat({
      text: parserMsg.text,
      senderId: parserMsg.senderId,
      chatListId: req.params.id,
    });
    newChat.save().then((result) => {
      expressWs
        .getWss()
        .clients.forEach(
          (client) =>
            (client.clientId === parserMsg.senderId ||
              client.clientId === parserMsg.receiverId) &&
            client.send(JSON.stringify(parserMsg))
        );
    });
    }
  });
});

app.listen(3000, () => console.log("online"));

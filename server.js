const express = require("express");
let app = express();
const mongoose = require("mongoose");
let expressWs = require("express-ws")(app);
require("dotenv").config();
const cors = require("cors");

const jwt = require("jsonwebtoken");
const Chat = require("./model/chat");
const ChatList = require("./model/chatsList");

mongoose
  .connect("mongodb://127.0.0.1:27017/twi")
  // .connect(process.env.DB)
  .then((res) => console.log("db connect"))
  .catch((err) => console.log(err));

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// app.use(express.json())
// app.use(express.raw())

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

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
      newChat.save().then(async(result) => {
        const backMsg = await result
          .populate(
            "senderId",
            "-password -token -updatedAt -createdAt -__v -following -followers"
          );
        expressWs
          .getWss()
          .clients.forEach(
            (client) =>
              (client.clientId === parserMsg.senderId ||
                client.clientId === parserMsg.receiverId) &&
              client.send(JSON.stringify(backMsg))
          );
      });
    }
  });
});

app.listen(3000, () => console.log("online"));

const express = require("express");
let app = express();
const mongoose = require("mongoose");
let expressWs = require('express-ws')(app)
const Chat = require("./model/chat")
require('dotenv').config()

mongoose
  .connect(
    "mongodb+srv://alim:123qweasdzxc@cluster0.bxjnnrq.mongodb.net/twi?retryWrites=true&w=majority&appName=AtlasApp"
  )
  .then((res) => console.log("db connect"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({extended : false}))

app.use("/api", require("./routes/api"));

app.ws('/chat/:id' , (ws , req) => {
  console.log(req.params);
  // inputs : {senderId , chatListId , text}
  // expressWs.getWss().clients.forEach(client => client.send(JSON.stringify({ text : "IIIII"})))
  ws.on('message' , (msg) => {
    // console.log(msg);
    const parserMsg = JSON.parse(msg)
    const newChat = new Chat({
      text : parserMsg.text,
      senderId : parserMsg.senderId,
      chatListId : req.params.id,
    })
    newChat.save().then(result => {
      expressWs.getWss().clients.forEach(client => client.send(JSON.stringify(parserMsg)))
    })
  })
})

app.listen(3000, () => console.log("online"));

const Controller = require("./controller");
const Chat = require("../model/chat");
const ChatList = require("../model/chatsList");
module.exports = new (class chatController extends Controller {
  async createChat(req, res, next) {
    // inputs = {senderId , receiverId , text}
    try {
      const newChatList = new ChatList({
        firstUser: req.body.senderId,
        secondUser: req.body.receiverId,
      });
      newChatList.save().then((result) => {
        const newChat = new Chat({
          text: req.body.text,
          senderId: req.body.senderId,
          chatListId : result._id
        });
        newChat.save().then(r => {
            res.json({
                message : "The page was created successfully",
                chatListId : result._id
            })
        })
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage(ws, req) {
    // inputs = {senderId , receiverId , text}
    try {
      
    } catch (error) {
      console.log(error);
    }
  }
})();

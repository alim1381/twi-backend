const Controller = require("./controller");
const Chat = require("../model/chat");
const ChatList = require("../model/chatsList");
const User = require("../model/user");

module.exports = new (class chatController extends Controller {
  async createChat(req, res, next) {
    // inputs = {senderId , receiverId , text}
    try {
      if (req.body.senderId === req.userData._id) {
        const newChatList = new ChatList({
          firstUser: req.userData._id,
          secondUser: req.body.receiverId,
        });
        newChatList.save().then((result) => {
          const newChat = new Chat({
            text: req.body.text,
            senderId: req.userData._id,
            chatListId: result._id,
          });
          newChat.save().then((r) => {
            res.json({
              message: "The page was created successfully",
              chatListId: result._id,
            });
          });
        });
      } else {
        res.status(404).json({
          message: "The Entered senderId does not match your id",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllChat(req, res, next) {
    try {
      let userChatList = await ChatList.find({
        $or: [
          { firstUser: req.userData._id },
          { secondUser: req.userData._id },
        ],
      })
        .select("-__v -updatedAt")
        .populate("firstUser", "-password -token -updatedAt -createdAt -__v")
        .populate("secondUser", "-password -token -updatedAt -createdAt -__v");
      res.status(200).json(userChatList);
    } catch (error) {
      next(error);
    }
  }

  async getOneChat(req, res, next) {
    try {
      let chats = await Chat.find({ chatListId: req.params.id })
        .sort({ createdAt: -1 })
        .select("-chatListId -__v -createdAt")
        .populate("senderId", "-password -token -updatedAt -createdAt -__v");
      let chatList = await ChatList.findOne({ _id: req.params.id })
        .select("-createdAt -updatedAt -__v")
        .populate("firstUser", "-password -token -updatedAt -createdAt -__v")
        .populate("secondUser", "-password -token -updatedAt -createdAt -__v");
      if (
        chatList.firstUser.id === req.userData._id ||
        chatList.secondUser.id === req.userData._id
      ) {
        res.status(200).json({
          profiles: chatList,
          messages: chats,
        });
      } else {
        res.status(403).json({
          messages: "You do not have access to this chats",
        });
      }
    } catch (error) {
      next(error);
    }
  }
})();

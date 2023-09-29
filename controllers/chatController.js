const Controller = require("./controller");
const Chat = require("../model/chat");
const ChatList = require("../model/chatsList");
const User = require("../model/user");

module.exports = new (class chatController extends Controller {
  async createChat(req, res, next) {
    // inputs = {senderId , receiverId , text}
    try {
      let secUser = await User.findById(req.body.receiverId);
      let findChatList = await ChatList.findOne({
        $or: [
          { firstUser: req.userData._id, secondUser: req.body.receiverId },
          { firstUser: req.body.receiverId, secondUser: req.userData._id },
        ],
      });
      if (secUser) {
        console.log(findChatList);
        if (!findChatList) {
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
          res.json({
            message: "This page already exists",
            chatListId: findChatList._id,
          });
        }
      } else {
        res.status(404).json({
          message: "The Entered secondId is not found",
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
        .sort({ createdAt: -1 })
        .populate("firstUser", "-password -token -updatedAt -createdAt -__v")
        .populate("secondUser", "-password -token -updatedAt -createdAt -__v");
      res.status(200).json(userChatList);
    } catch (error) {
      next(error);
    }
  }
  async getLastMassege(req, res, next) {
    try {
      let list = await ChatList.findById(req.body.chatId)
        .populate("firstUser")
        .populate("secondUser");
      if (
        req.userData._id === list.firstUser.id ||
        req.userData._id === list.secondUser.id
      ) {
        let lastMassage = await Chat.findOne({ chatListId: list._id })
          .sort({ createdAt: -1 })
          .limit(1);

        res.status(200).json({
          lastMassage: lastMassage.text,
          createdAt: lastMassage.createdAt,
          success: true,
        });
      } else {
        res.status(200).json({
          message: "This chat is not yours",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getOneChat(req, res, next) {
    try {
      let chats = await Chat.find({ chatListId: req.params.id })
        .sort({ createdAt: -1 })
        .limit(50)
        .select("-chatListId -__v -createdAt")
        .populate(
          "senderId",
          "-password -token -updatedAt -createdAt -__v -following -followers"
        );
      let chatList = await ChatList.findOne({ _id: req.params.id })
        .select("-createdAt -updatedAt -__v")
        .populate(
          "firstUser",
          "-password -token -updatedAt -createdAt -__v -following -followers"
        )
        .populate(
          "secondUser",
          "-password -token -updatedAt -createdAt -__v -following -followers"
        );
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

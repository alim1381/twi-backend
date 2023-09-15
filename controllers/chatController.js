const Controller = require("./controller");
const Chat = require("../model/chat");
const ChatList = require("../model/chatsList");
const User = require('../model/user');

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
      next(error)
    }
  }

  async getAllChat(req, res , next) {
    try {
      let user = await User.findOne({token : req.token})
      if (user) {
        let userChatList = await ChatList.find({$or : [{firstUser : user._id} , {secondUser : user._id}]})
        .populate('firstUser' , '-password -token -updatedAt -createdAt')
        .populate('secondUser' , '-password -token -updatedAt -createdAt')
        res.status(200).json({
          userChatList
        })
      } else {
        res.status(403).json({
          message : "user token not found"
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getOneChat(req, res) {
    try {
      let user = await User.findOne({token : req.token})
      if (user) {
        let chats = await Chat.find({chatListId : req.params.id})
        .sort({createdAt : -1})
        .select('-chatListId -__v -createdAt')
        .populate('senderId' , '-password -token -updatedAt -createdAt -__v')
        let chatList = await ChatList.find({_id :req.params.id })
        .select('-createdAt -updatedAt -__v')
        .populate('firstUser' , '-password -token -updatedAt -createdAt -__v')
        .populate('secondUser' , '-password -token -updatedAt -createdAt -__v')

        res.status(200).json({
          profiles : chatList,
          messages : chats
        })
      } else {
        res.status(403).json({
          message : "user token not found"
        })
      }
    } catch (error) {
      next(error)
    }
  }
})();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/chat');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    const userId = req.user.id;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: 'Your name is MindMate.You are anAI study and wellness companion for students. You help with exam preparation, coding problems, research, and learning. Be friendly, encouraging, and explain things clearly.You are not a person named santhiya.You were created by Santhiya, a BCA student from a college inChennai.',
    });

    let chat = chatId ? await Chat.findById(chatId) : null;

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        title: message.substring(0, 30),
        messages: [],
      });
    }

    const history = chat.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const geminiChat = model.startChat({ history });

    const result = await geminiChat.sendMessage(message);
    const response = result.response.text();

    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: response });
    await chat.save();

    res.status(200).json({
      chatId: chat._id,
      message: response,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user.id }).select('title createdAt');
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMessage, getChats, getChat };

# 🌊 Gossip AI Chat Interface



<div align="center">



![Gossip AI](https://img.shields.io/badge/Gossip-AI-00FFFF?style=for-the-badge)

[![Made with React](https://img.shields.io/badge/Made_with-React_18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)

[![Powered by Ollama](https://img.shields.io/badge/Powered_by-Ollama-black?style=for-the-badge)](https://ollama.ai/)



A modern chat interface where you can talk to AI, customize its personality, and have natural conversations!







</div>



## 🎯 What is Gossip AI?



Gossip AI is a chat application that lets you talk to AI models in a natural way. Think of it as having a conversation with a smart friend who can help you with various tasks, answer questions, or just chat!



### ✨ What Makes It Special?



- 🎭 **Customizable AI Personality**: Make the AI behave how you want!

- 💬 **Natural Conversations**: The AI remembers your chat history

- 🎨 **Beautiful Design**: Modern, clean interface that works on all devices

- ⚡ **Fast Responses**: Quick and efficient AI responses

- 🔒 **Privacy Focused**: Your conversations stay on your computer



## ✨ Features



- Real-time chat interface with AI

- Multiple model support with dynamic loading

- Custom AI personality configuration

- Advanced model parameter tuning

- Network and server configuration

- Chat history management

- Responsive design for all devices

- Modern UI with animations

- Local storage persistence

- Session management



## 🚀 Getting Started



#### 📋 Prerequisites



Before you start, make sure you have these installed:

1. **Node.js**: [Download Here](https://nodejs.org/) (Version 14 or higher)

2. **Ollama**: [Download Here](https://ollama.ai/)

3. **Git**: [Download Here](https://git-scm.com/)



#### 💻 Installation Steps



1. **Get the Code**

```bash

git clone https://github.com/yourusername/gossipai.git

cd gossipai

```

2. **Install Dependencies**

```npm install ```



3. **Start Ollama**

- For Windows: Open Ollama application

- For Mac/Linux: Open terminal and run:

```ollama serve```

4. **Start the App**

```npm run dev```

5. **Open the app**

- Open Browser

- Go to: http://localhost:5173

## 📱 How to use

🔧 First-Time Setup

1. Click the ⚙️ (Settings) icon in the top right

2. Under "Network", enter your computer's IP address

- For Windows: Type ipconfig in Command Prompt

- For Mac/Linux: Type ifconfig in Terminal



3. Choose an AI model

4. Create an AI personality (optional)

5. Click "Save Configuration"



## 💭 Starting a Conversation

1. Type your message in the input box

2. Press "Send" or hit Enter

3. Wait for AI's response

4. Continue the conversation!\



## ⚙️ Customizing the AI

1. Open Settings (⚙️ icon)

2. Go to "Role" tab

3. Give your AI a name

4. Describe its personality

5. Save changes

## 🛠️ Advanced Features

**Model Parameters**

* **You can adjust these settings to change how the AI responds:

* **Temperature**: Higher = more creative, Lower = more focused

* **Top K & Top P**: Control response variety

* **Repeat Penalty**: Prevents repetitive responses



**Chat history**

* Conversations are saved automatically

* Clear history using the "Clear Chat History" button

* Reset AI personality using "Clear AI Role"



## 📁 Project Structure

```gossip-ai/
├── src/                   # Frontend source code
│   ├── components/        # React components
│   │   ├── ConfigSettings    # Settings panel
│   │   ├── LoadingDots      # Loading animation
│   │   ├── ModelParams      # AI parameters
│   │   ├── ModelPersonality # AI personality
│   │   └── NetworkInfo      # Network setup
│   ├── utils/            # Helper functions
│   └── App.jsx           # Main application
├── server/               # Backend code
│   └── index.js         # Express server
└── configuration files   # Various config files
```



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request, I'll be more than happy !



## Note: I poured a lot of time and effort into building this project. Feel free to use it and customize it to your liking! If you find it helpful, consider giving it a star on GitHub. ❤️

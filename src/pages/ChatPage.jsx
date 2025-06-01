import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations.jsx";
import { FaMicrophone, FaPaperPlane } from "react-icons/fa";

const ChatPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [firstRequest, setFirstRequest] = useState(true);

  const chatEndRef = useRef(null);

  const handleMessageChange = (e) => setUserMessage(e.target.value);

  const stopSpeaking = () => {
    if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleBack = () => {
    stopSpeaking();
    navigate("/functionalities");
  };

  const handleSendMessage = async (text, speakIt = false) => {
    if (!text.trim() || isSending) return;

    stopSpeaking();

    const newMessage = { from: "user", text };
    setChatHistory((prev) => [...prev, newMessage]);
    setUserMessage("");
    setIsSending(true);

    const typingMessage = { from: "ai", text: translations[lang].ai_type, typing: true };
    setChatHistory((prev) => [...prev, typingMessage]);

    try {
      const requestBody = firstRequest
        ? { message: text, limit: "false" }
        : { message: text };

      const response = await fetch(`${apiBaseUrl}/chats/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { from: "ai", text: data.message },
      ]);

      if (speakIt) {
        speakAIResponse(data.message);
      }
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setIsSending(false);
      setFirstRequest(false);
    }
  };

  const speakAIResponse = (text) => {
    if (!text.trim()) return;

    const voice = bengaliActive ? "Bangla India Female" : "US English Female";

    if (window.responsiveVoice) {
      window.responsiveVoice.speak(text, voice);
    } else if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bengaliActive ? "bn-IN" : "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("SpeechRecognition not supported!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = bengaliActive ? "bn-BD" : "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSendMessage(transcript, true);
    };
    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleSubmit = () => handleSendMessage(userMessage);

  useEffect(() => {
    setFirstRequest(true);
    const name = localStorage.getItem("name") || "there";
    const welcomeMessage = {
      from: "ai",
      text: `${translations[lang].greeting_title}${name}! ${translations[lang].chat_start}`,
    };
    setChatHistory([welcomeMessage]);
  }, [bengaliActive]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    const handleUnload = () => stopSpeaking();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <button onClick={handleBack} className="back-button">
            ← Back
          </button>
          <h2>{translations[lang].chat_head}</h2>
        </div>

        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-message ${msg.from} ${msg.typing ? "typing" : ""}`}
            >
              <div
                className="markdown-message"
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              />
            </div>
          ))}
          {isListening && (
            <div className="chat-message listening-indicator">
              <FaMicrophone /> {translations[lang].listening}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input">
          <textarea
            placeholder={translations[lang].new_msg}
            value={userMessage}
            onChange={handleMessageChange}
            disabled={isSending}
          />
          <div className="input-buttons">
            <button
              onClick={startListening}
              className="voice-button"
              disabled={isSending}
              title="Voice Input"
            >
              <FaMicrophone />
            </button>
            <button
              onClick={handleSubmit}
              className="send-button"
              disabled={isSending || !userMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

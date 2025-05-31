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

  // Stop sound on navigating back
  const handleBack = () => {
    stopSpeaking();
    navigate("/functionalities");
  };

  const handleSendMessage = async (text, speakIt = false) => {
    if (!text.trim() || isSending) return;

    // Stop any ongoing speaking when sending a new message
    stopSpeaking();

    const newMessage = { from: "user", text };
    setChatHistory((prev) => [...prev, newMessage]);
    setUserMessage("");
    setIsSending(true);

    try {
      // Include limit: "false" only for the first request after reload/bengaliActive change
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
      const aiMessage = { from: "ai", text: data.message };
      setChatHistory((prev) => [...prev, aiMessage]);

      if (speakIt) {
        speakAIResponse(aiMessage.text);
      }
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setIsSending(false);
      setFirstRequest(false); // After first request, don't include limit anymore
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
    } else {
      console.error("No speech synthesis available.");
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

  // Initialize chat and reset firstRequest on reload or language toggle
  useEffect(() => {
    setFirstRequest(true); // Reset to true on reload/bengaliActive change
    const name = localStorage.getItem("name") || "there";
    const welcomeMessage = {
      from: "ai",
      text: `${translations[lang].greeting_title}${name}! ${translations[lang].chat_start}`,
    };
    setChatHistory([welcomeMessage]);
  }, [bengaliActive]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // Stop speaking on page unload
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
            <div key={index} className={`chat-message ${msg.from}`}>
              <div
                className="markdown-message"
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              />
            </div>
          ))}
          {isListening && (
            <div className="chat-message listening-indicator">
              <div className="markdown-message">
                <FaMicrophone /> {translations[lang].listening}
              </div>
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

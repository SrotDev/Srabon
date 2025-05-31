import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import { LanguageContext } from "../LanguageContext";
import translations from "../translations.jsx";
import { FaMicrophone, FaPaperPlane, FaVolumeUp } from "react-icons/fa";

const ChatPage = () => {
  const { bengaliActive } = useContext(LanguageContext);
  const lang = bengaliActive ? "bn" : "en";
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isResponsiveVoiceLoaded, setIsResponsiveVoiceLoaded] = useState(false);

  const isFirstMessage = useRef(true);
  const chatEndRef = useRef(null);
  const shouldSpeakNextAiResponse = useRef(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://code.responsivevoice.org/responsivevoice.js?key=206RQ6BM";
    script.async = true;
    script.onload = () => {
      console.log("✅ ResponsiveVoice script loaded!");
      setIsResponsiveVoiceLoaded(true);
    };
    script.onerror = () => {
      console.error("❌ Failed to load ResponsiveVoice script.");
    };
    document.body.appendChild(script);
  }, []);

  const handleMessageChange = (e) => setUserMessage(e.target.value);

  const stopSpeaking = () => {
    if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || isSending) return;

    // Stop previous AI voice
    stopSpeaking();

    const newMessage = { from: "user", text };
    setChatHistory((prev) => [...prev, newMessage]);
    setUserMessage("");
    setIsSending(true);
    setAiTyping(true);

    try {
      const response = await fetch(`${apiBaseUrl}/chats/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          message: newMessage.text,
          limit: isFirstMessage.current ? "false" : "true",
        }),
      });

      const data = await response.json();
      const aiMessage = { from: "ai", text: data.message };
      setChatHistory((prev) => [...prev, aiMessage]);

      if (shouldSpeakNextAiResponse.current) {
        setTimeout(() => {
          const speakerButtons = document.querySelectorAll(".speaker-button");
          const lastSpeaker = speakerButtons[speakerButtons.length - 1];
          if (lastSpeaker) lastSpeaker.click();
        }, 100);
        shouldSpeakNextAiResponse.current = false;
      }

      isFirstMessage.current = false;
    } catch (error) {
      console.error("❌ Error while sending message:", error);
    } finally {
      setAiTyping(false);
      setIsSending(false);
    }
  };

  const handleSubmit = () => handleSendMessage(userMessage);

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = bengaliActive ? "bn-BD" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      shouldSpeakNextAiResponse.current = true;
      handleSendMessage(transcript);
    };
    recognition.onerror = (event) => {
      console.error("❌ Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const speakText = (text) => {
    if (!text.trim()) return;

    const voice = bengaliActive ? "Bangla India Female" : "US English Female";

    if (isResponsiveVoiceLoaded && window.responsiveVoice) {
      window.responsiveVoice.speak(text, voice);
    } else if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = bengaliActive ? "bn-IN" : "en-US";
      synth.cancel();
      synth.speak(utterance);
    }
  };

  useEffect(() => {
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

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-buttons">
            <button onClick={() => navigate("/functionalities")} className="back-button">
              ← Back
            </button>
          </div>
          <h2>{translations[lang].chat_head}</h2>
        </div>

        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.from}`}>
              <div
                className="markdown-message"
                dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
              />
              {msg.from === "ai" && (
                <button
                  className="speaker-button"
                  style={{ display: "none" }}
                  onClick={() => speakText(msg.text)}
                  title="Play Audio"
                >
                  <FaVolumeUp />
                </button>
              )}
            </div>
          ))}
          {aiTyping && (
            <div className="chat-message ai typing">
              <div className="markdown-message">{translations[lang].ai_type}</div>
            </div>
          )}
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
            <button onClick={startListening} className="voice-button" disabled={isSending} title="Voice Input">
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

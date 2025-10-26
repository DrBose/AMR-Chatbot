import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Message } from './types';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import { createChatSession } from './services/geminiService';
import type { Chat } from '@google/genai';
import { useQuiz } from './hooks/useQuiz';
import { useFaq } from './hooks/useFaq';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { isQuizActive, startQuiz, handleQuizAnswer } = useQuiz({ setMessages });
  const { isFaqActive, startFaq, handleFaqSelection } = useFaq({ setMessages });

  useEffect(() => {
    chatRef.current = createChatSession();
    const initialSuggestions = [
      "What is AMR?",
      "How do bacteria become resistant?",
      "View FAQs",
    ];
    setMessages([
      {
        id: 'initial-bot-message',
        text: "Hello! I'm the Antibiotic Steward, an AI assistant here to help you learn about Antimicrobial Resistance (AMR). How can I help you today? \n\nType 'quiz' to test your knowledge about the One Health Initiative, or 'faq' to see common questions.\n\nPlease remember, I cannot give medical advice. Always consult a healthcare professional for health concerns.",
        sender: 'bot',
        suggestions: initialSuggestions,
      },
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const callGeminiAPI = useCallback(async (messageText: string) => {
    setIsLoading(true);
    setMessages((prev) => prev.filter((msg) => !msg.isError));

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const response = await chatRef.current.sendMessage({ message: messageText });
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: response.text,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      let errorMessageText = 'Sorry, an unexpected error occurred. Please try again.';
      if (error instanceof Error) {
        errorMessageText = `I couldn't get a response. Error: ${error.message}. Please check your connection and try again.`;
      }
      const errorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: errorMessageText,
        sender: 'bot',
        isError: true,
        originalText: messageText,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isQuizActive || isFaqActive) return;

    const messageToSend = input;
    setInput('');

    if (messageToSend.trim().toLowerCase() === 'quiz') {
        startQuiz();
        return;
    }

    if (messageToSend.trim().toLowerCase() === 'faq') {
        startFaq();
        return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      sender: 'user',
    };
    
    setMessages((prev) => [...prev, userMessage]);

    await callGeminiAPI(messageToSend);
  }, [input, isLoading, isQuizActive, isFaqActive, callGeminiAPI, startQuiz, startFaq]);

  const handleRetry = useCallback(async (messageToRetry: string) => {
    if (isLoading) return;
    await callGeminiAPI(messageToRetry);
  }, [isLoading, callGeminiAPI]);

  const handleSuggestionClick = useCallback(async (suggestionText: string) => {
    if (isLoading) return;

    // Remove suggestions from all messages to prevent re-use
    setMessages(prev => prev.map(msg => 
      msg.suggestions ? { ...msg, suggestions: undefined } : msg
    ));
    
    if (isFaqActive) {
      handleFaqSelection(suggestionText);
      return;
    }

    if (suggestionText === 'Start Over') {
      startQuiz();
      return;
    }

    if (suggestionText === 'View FAQs') {
      startFaq();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: suggestionText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    await callGeminiAPI(suggestionText);
  }, [isLoading, isFaqActive, callGeminiAPI, startQuiz, startFaq, handleFaqSelection]);


  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto bg-gray-50 shadow-2xl rounded-lg overflow-hidden">
      <header className="p-4 bg-blue-700 text-white text-center shadow-md">
        <h1 className="text-2xl font-bold">AMR Awareness Chatbot</h1>
        <p className="text-sm text-blue-200">Your Guide to Antibiotic Stewardship</p>
      </header>

      <main ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-2">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              onRetry={handleRetry} 
              onOptionClick={handleQuizAnswer}
              onSuggestionClick={handleSuggestionClick}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start items-end gap-2 my-4">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
                      <path d="M8 12h8m-4 4V8" opacity=".3"/>
                  </svg>
               </div>
               <div className="bg-blue-600 text-white rounded-r-xl rounded-bl-xl">
                 <TypingIndicator />
               </div>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0">
        <ChatInput
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          isQuizActive={isQuizActive}
          isFaqActive={isFaqActive}
        />
      </footer>
    </div>
  );
};

export default App;
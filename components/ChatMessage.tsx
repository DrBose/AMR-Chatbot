import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  onRetry?: (failedMessageText: string) => void;
  onOptionClick?: (messageId: string, option: string) => void;
  onSuggestionClick?: (suggestionText: string) => void;
}

const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
        <path d="M8 12h8m-4 4V8" opacity=".3"/>
    </svg>
);


const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
    </svg>
);

const ErrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry, onOptionClick, onSuggestionClick }) => {
  const { id, text, sender, isError, originalText, isQuizQuestion, options, selectedAnswer, suggestions } = message;
  const isBot = sender === 'bot';

  const messageClasses = isBot
    ? isError
      ? 'bg-red-100 text-red-800 rounded-r-xl rounded-bl-xl border border-red-200'
      : 'bg-blue-600 text-white rounded-r-xl rounded-bl-xl'
    : 'bg-white text-gray-800 rounded-l-xl rounded-br-xl border border-gray-200';
  
  const containerClasses = isBot ? 'justify-start' : 'justify-end';

  return (
    <div className={`flex items-end gap-2 my-4 ${containerClasses}`}>
      {isBot && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isError ? 'bg-red-500' : 'bg-blue-600'}`}>
            {isError ? <ErrorIcon /> : <BotIcon />}
        </div>
      )}
      <div
        className={`px-4 py-3 max-w-sm md:max-w-md lg:max-w-lg break-words ${messageClasses}`}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>

        {suggestions && suggestions.length > 0 && onSuggestionClick && (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        {isQuizQuestion && options && onOptionClick && (
            <div className="mt-4 space-y-2">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onOptionClick(id, option)}
                        disabled={!!selectedAnswer}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 text-sm
                            ${!selectedAnswer ? 'bg-blue-500 hover:bg-blue-400 text-white' : ''}
                            ${selectedAnswer && option === originalText ? 'bg-green-200 text-green-800 border-green-400' : ''}
                            ${selectedAnswer && selectedAnswer === option && option !== originalText ? 'bg-red-200 text-red-800 border-red-400' : ''}
                            ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                    >
                        {option}
                    </button>
                ))}
            </div>
        )}

        {isError && originalText && onRetry && (
            <button
              onClick={() => onRetry(originalText)}
              className="mt-3 px-4 py-1.5 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              aria-label="Retry sending message"
            >
              Retry
            </button>
        )}
      </div>
       {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <UserIcon />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
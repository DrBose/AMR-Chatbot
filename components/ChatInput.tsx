
import React from 'react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  isQuizActive: boolean;
  isFaqActive: boolean;
}

const SendIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);


const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, onSendMessage, isLoading, isQuizActive, isFaqActive }) => {
  const isDisabled = isLoading || isQuizActive || isFaqActive;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isDisabled && input.trim()) {
        onSendMessage(e as any);
      }
    }
  };

  const getPlaceholder = () => {
    if (isQuizActive) return "Complete the quiz to continue chatting";
    if (isFaqActive) return "Please select an option from the FAQ";
    return "Ask about AMR and antibiotics...";
  }

  return (
    <form
      onSubmit={onSendMessage}
      className="flex items-center p-2 bg-white border-t border-gray-200"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getPlaceholder()}
        className="flex-grow px-4 py-3 text-lg bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        disabled={isDisabled}
      />
      <button
        type="submit"
        disabled={isDisabled || !input.trim()}
        className="ml-3 p-3 bg-blue-600 text-white rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform enabled:hover:scale-110"
        aria-label="Send message"
      >
        {isLoading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
            <SendIcon className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
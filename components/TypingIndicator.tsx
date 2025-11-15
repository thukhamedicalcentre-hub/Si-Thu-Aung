
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-bot-bubble-light dark:bg-bot-bubble-dark text-gray-800 dark:text-gray-200 self-start rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
        <div className="flex items-center justify-center space-x-1.5">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

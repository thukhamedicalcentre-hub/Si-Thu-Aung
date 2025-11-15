
import React from 'react';
import { Message, MessageSender } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === MessageSender.USER;

  const bubbleClasses = isUser
    ? 'bg-user-bubble text-white self-end rounded-2xl rounded-br-none'
    : 'bg-bot-bubble-light dark:bg-bot-bubble-dark text-gray-800 dark:text-gray-200 self-start rounded-2xl rounded-bl-none';

  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex ${containerClasses}`}>
      <div className={`max-w-md md:max-w-lg lg:max-w-2xl px-4 py-3 shadow-md ${bubbleClasses}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageBubble;

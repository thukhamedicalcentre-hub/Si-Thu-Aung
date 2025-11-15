
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from '@google/genai';
import { Message, MessageSender } from './types';
import { GREETING_MESSAGE } from './constants';
import { createChatSession } from './services/geminiService';
import MessageBubble from './components/MessageBubble';
import TypingIndicator from './components/TypingIndicator';
import { SendIcon, HealthIcon } from './components/Icons';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      ...GREETING_MESSAGE,
      sender: MessageSender.BOT,
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatSessionRef.current = createChatSession();
    } catch (e: any) {
       setError("AI နှင့် ချိတ်ဆက်ရာတွင် မအောင်မြင်ပါ။ သင်၏ API key ကို စစ်ဆေးပေးပါ။");
       console.error(e);
    }
  }, []);
  
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: MessageSender.USER,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const botMessageId = `bot-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: '', sender: MessageSender.BOT },
    ]);
    
    try {
      if (!chatSessionRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const stream = await chatSessionRef.current.sendMessageStream({ message: input });
      
      let fullResponse = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          )
        );
      }
    } catch (e: any) {
      console.error("Error sending message:", e);
      const errorMessage = "တောင်းပန်ပါတယ်။ အမှားအယွင်းတစ်ခု ဖြစ်ပွားခဲ့ပါတယ်။ ကျေးဇူးပြု၍ နောက်တစ်ကြိမ် ထပ်ကြိုးစားပါ။";
      setError(errorMessage);
       setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: errorMessage } : msg
          )
        );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700">
        <HealthIcon className="w-8 h-8 text-clinic-primary" />
        <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI ကျန်းမာရေး လက်ထောက်</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">သင့်ကျန်းမာရေးအတွက် ပထမဆုံး ဆက်သွယ်ရန်နေရာ</p>
        </div>
      </header>

      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
        {error && <div className="text-red-500 text-center">{error}</div>}
      </main>

      <footer className="sticky bottom-0 bg-white dark:bg-gray-800 p-2 md:p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="သင်၏ ရောဂါလက္ခဏာများ သို့မဟုတ် မေးခွန်းများကို ရိုက်ထည့်ပါ..."
            className="flex-1 w-full px-5 py-3 text-base bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-clinic-secondary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="ml-3 inline-flex items-center justify-center w-12 h-12 rounded-full bg-clinic-primary text-white hover:bg-clinic-secondary focus:outline-none focus:ring-2 focus:ring-clinic-secondary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            aria-label="မက်ဆေ့ချ်ပို့ပါ"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default App;

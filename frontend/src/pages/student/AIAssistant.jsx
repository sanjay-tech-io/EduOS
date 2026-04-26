import { useState } from 'react';
import { askAI } from '../../services/api';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Summarize my academic performance",
    "Generate a resume from my profile",
    "Suggest career improvements",
    "What are my strongest subjects?",
    "How can I improve my attendance?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await askAI(userMessage);
      setChatHistory(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggested = (question) => {
    setMessage(question);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Assistant</h1>
        
        <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🤖</div>
                <h2 className="text-xl font-bold mb-2">How can I help you today?</h2>
                <p className="text-gray-500 mb-6">Ask me about your academic performance, career advice, or any general questions.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggested(q)}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatHistory.map((chat, i) => (
                <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-lg ${
                    chat.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="font-bold text-sm mb-1">
                      {chat.role === 'user' ? 'You' : 'AI Assistant'}
                    </div>
                    <p className="whitespace-pre-wrap">{chat.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="font-bold text-sm mb-1">AI Assistant</div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

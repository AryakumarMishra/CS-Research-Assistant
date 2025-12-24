import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, FileText } from 'lucide-react';
import { sendQuery } from '../services/api';
import toast from 'react-hot-toast';

const ChatInterface = ({ pdfId, fileName, messages, onSendMessage }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        const userMessage = query.trim();
        // Propagate user message to parent
        onSendMessage({ type: 'user', content: userMessage });
        setQuery('');
        setLoading(true);

        try {
            const data = await sendQuery({
                question: userMessage,
                pdf_id: pdfId
            });
            // Adjust based on your backend response
            const aiResponse = data.answer || data.response || JSON.stringify(data);

            // Propagate AI message to parent
            onSendMessage({ type: 'ai', content: aiResponse });
        } catch (error) {
            console.error(error);
            toast.error('Failed to get response.');
            onSendMessage({ type: 'error', content: 'Sorry, I encountered an error responding to that.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col h-full bg-slate-800/50 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
            {/* Header / Context Badge */}
            <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Research Assistant</h2>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Online
                        </div>
                    </div>
                </div>
                {/* Filename Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-400 max-w-[200px]">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate" title={fileName}>{fileName || 'Unknown File'}</span>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex gap-4 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                            ${msg.type === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'}
                        `}>
                            {msg.type === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={`
                            max-w-[85%] md:max-w-[80%] p-4 rounded-2xl
                            ${msg.type === 'user'
                                ? 'bg-purple-600 text-white rounded-tr-sm'
                                : 'bg-slate-700/50 text-slate-200 border border-slate-600 rounded-tl-sm'}
                        `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-2xl rounded-tl-sm border border-slate-600 flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-800/80 border-t border-slate-700">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={`Ask about ${fileName || 'this document'}...`}
                        className="w-full bg-slate-900/50 text-white pl-4 pr-12 py-4 rounded-xl border border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || loading}
                        className="absolute right-2 top-2 p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    {/* Small Context Tag for Mobile */}
                    <div className="md:hidden absolute -top-6 left-0 text-xs text-slate-500 flex items-center gap-1 max-w-full overflow-hidden">
                        Using: <span className="font-mono text-indigo-400 truncate">{fileName}</span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;

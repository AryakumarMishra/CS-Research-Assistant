import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import FileUpload from './components/FileUpload';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';

function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Derive the active session object
  const activeSession = sessions.find(s => s.id === activeSessionId);

  const handleUploadSuccess = (pdfId, fileName) => {
    const newSession = {
      id: Date.now().toString(), // Simple unique ID
      pdfId,
      fileName,
      messages: [{ type: 'ai', content: `Document "${fileName}" processed. Ask me anything about it!` }]
    };

    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleSendMessage = (message) => {
    if (!activeSessionId) return;

    setSessions(prev => prev.map(session => {
      if (session.id === activeSessionId) {
        return {
          ...session,
          messages: [...session.messages, message]
        };
      }
      return session;
    }));
  };

  const handleDeleteSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-900 text-white overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none z-0"></div>

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSwitchSession={setActiveSessionId}
        onNewChat={() => setActiveSessionId(null)}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 w-full">
        <div className="flex-1 p-4 md:p-8 flex items-center justify-center overflow-hidden">

          {!activeSessionId ? (
            // Upload View
            <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                  AI Research Assistant
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                  Upload a new research paper to start a conversation.
                </p>
              </header>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          ) : (
            // Chat View
            <div className="w-full h-full animate-in slide-in-from-right-10 fade-in duration-300">
              <ChatInterface
                key={activeSession.id} // Re-mount when session changes to reset internal temporary states if any
                pdfId={activeSession.pdfId}
                fileName={activeSession.fileName}
                messages={activeSession.messages}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}

        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
    </div>
  );
}

export default App;

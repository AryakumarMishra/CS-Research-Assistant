import React from 'react';
import { MessageSquare, Plus, FileText, Trash2, Github } from 'lucide-react';

const Sidebar = ({ sessions, activeSessionId, onSwitchSession, onNewChat, onDeleteSession }) => {
    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen flex-shrink-0 transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
                    <span className="font-bold text-white text-lg">AI</span>
                </div>
                <h1 className="font-bold text-lg tracking-tight">Research Assistant</h1>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
                <button
                    onClick={onNewChat}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all shadow-lg shadow-primary/25 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    <span className="font-medium">New Conversation</span>
                </button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
                <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Your Papers
                </div>

                {sessions.length === 0 ? (
                    <div className="text-center py-8 px-4">
                        <p className="text-sm text-slate-500">No papers uploaded yet.</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => onSwitchSession(session.id)}
                            className={`
                                group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all relative overflow-hidden
                                ${activeSessionId === session.id
                                    ? 'bg-slate-800 text-white shadow-md'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}
                            `}
                        >
                            {activeSessionId === session.id && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                            )}

                            <FileText className={`w-5 h-5 flex-shrink-0 ${activeSessionId === session.id ? 'text-primary' : 'text-slate-500'}`} />

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {session.fileName}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                    {session.messages.length - 1} messages
                                </p>
                            </div>

                            {/* Delete specific session (optional, but good UX) */}
                            {/* Prevent propagation so we don't switch session when deleting */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-all"
                                title="Delete chat"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer text-slate-400 hover:text-white">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <Github className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium">Arya's Project</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

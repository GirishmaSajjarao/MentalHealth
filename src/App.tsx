import React from 'react';
import ChatWindow from "./components/Chat/ChatWindow";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans text-slate-900">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Safe Support System</h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            An AI-powered triage tool for emotional well-being. 
            <br className="hidden md:block" />
            Confidential, supportive, and safe.
          </p>
        </div>
        
        <ChatWindow />
        
        <div className="mt-8 text-center text-xs text-slate-400 max-w-2xl mx-auto">
          <p>
            <strong>Emergency Warning:</strong> If you or someone else is in immediate danger, 
            please call your local emergency services immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

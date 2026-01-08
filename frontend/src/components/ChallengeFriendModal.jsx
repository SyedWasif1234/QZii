import React, { useState } from "react";
import { X, Copy, Check, Share2, Link as LinkIcon, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChallengeFriendModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  // Steps: 'config' (select quiz) -> 'invite' (share link)
  const [step, setStep] = useState('config'); 
  const [selectedTopic, setSelectedTopic] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Mock Data for specific quizzes available for battle
  const topics = [
    { id: 'js-basics', name: 'JS Basics', questions: 10 },
    { id: 'react-hooks', name: 'React Hooks', questions: 15 },
    { id: 'css-grid', name: 'CSS Grid & Flexbox', questions: 8 },
  ];

  // Logic: User copies link
  const inviteLink = "https://quizmaster.com/battle/join/room-8821";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartBattle = () => {
    // In real app: Navigate to room and wait for socket 'player_joined' event
    // For demo: Direct navigation
    navigate("/battle/room/room-8821"); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800">
            {step === 'config' ? 'Setup Private Battle' : 'Invite Friend'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {/* STEP 1: CONFIGURATION */}
          {step === 'config' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Topic / Quiz
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {topics.map((topic) => (
                    <div 
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer flex justify-between items-center transition-all ${
                        selectedTopic === topic.id 
                          ? "border-sky-500 bg-sky-50" 
                          : "border-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <p className="font-bold text-slate-800">{topic.name}</p>
                        <p className="text-xs text-slate-500">{topic.questions} Questions</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTopic === topic.id ? "border-sky-500" : "border-slate-300"
                      }`}>
                        {selectedTopic === topic.id && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                disabled={!selectedTopic}
                onClick={() => setStep('invite')}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-md shadow-sky-200"
              >
                Create Room & Get Link
              </button>
            </div>
          )}

          {/* STEP 2: INVITE */}
          {step === 'invite' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <LinkIcon size={32} />
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">Room Created!</h4>
                <p className="text-slate-500 text-sm">
                  Share this link with your friend. The game will start automatically when they join.
                </p>
              </div>

              {/* Copy Link Box */}
              <div className="flex items-center gap-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
                <input 
                  type="text" 
                  readOnly 
                  value={inviteLink}
                  className="bg-transparent border-none focus:ring-0 text-sm text-slate-600 flex-1 w-full"
                />
                <button 
                  onClick={handleCopy}
                  className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                >
                  {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs text-slate-400 mb-4 animate-pulse">Waiting for opponent to join...</p>
                
                <button 
                  onClick={handleStartBattle}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center gap-2"
                >
                  <Play size={18} /> Enter Room Now
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ChallengeFriendModal;
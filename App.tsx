
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Patient, Step, Option } from './types';
import { DECISION_TREE } from './constants/decisionTree';
import { UserIcon, StethoscopeIcon, ClipboardIcon, AlertTriangleIcon } from './components/icons';

// --- MESSAGE & UI TYPES ---
type Message = {
  id: number;
  sender: 'bot' | 'user';
  content: React.ReactNode;
  step?: Step;
  options?: Option[];
};

// --- DEMOGRAPHICS FORM COMPONENT ---
const DemographicsForm: React.FC<{ onSubmit: (patient: Patient) => void }> = ({ onSubmit }) => {
  const [patient, setPatient] = useState<Patient>({ name: '', age: 0, gender: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient.name || patient.age <= 0 || !patient.gender) {
      setError('Please fill out all fields correctly.');
      return;
    }
    setError('');
    onSubmit(patient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label htmlFor="name" className="block font-medium text-slate-600 mb-1">Patient Name</label>
        <input
          type="text"
          id="name"
          value={patient.name}
          onChange={(e) => setPatient({ ...patient, name: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition bg-white text-black placeholder:text-slate-500"
          placeholder="e.g., John Doe"
        />
      </div>
      <div>
        <label htmlFor="age" className="block font-medium text-slate-600 mb-1">Age</label>
        <input
          type="number"
          id="age"
          value={patient.age || ''}
          onChange={(e) => setPatient({ ...patient, age: parseInt(e.target.value, 10) || 0 })}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition bg-white text-black placeholder:text-slate-500"
          placeholder="e.g., 35"
        />
      </div>
      <div>
        <span className="block font-medium text-slate-600 mb-2">Gender</span>
        <div className="flex gap-4">
          {['Male', 'Female'].map((gender) => (
            <label key={gender} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={gender}
                checked={patient.gender === gender}
                onChange={(e) => setPatient({ ...patient, gender: e.target.value as 'Male' | 'Female' })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-slate-700">{gender}</span>
            </label>
          ))}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-sm">
        Start Assessment
      </button>
    </form>
  );
};

// --- CHAT MESSAGE COMPONENT ---
const MessageBubble: React.FC<{ message: Message; onSelect: (nextStepId: string, text: string) => void }> = ({ message, onSelect }) => {
  const getIcon = (step?: Step) => {
    if (!step) return <StethoscopeIcon className="w-5 h-5" />;
    switch(step.category) {
        case 'Ask': case 'Assess':
            return <StethoscopeIcon className="w-5 h-5" />;
        case 'Inspect': case 'Look':
            return <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
        case 'Diagnosis': case 'Info':
            return step.isReferral ? <AlertTriangleIcon className="w-5 h-5" /> : <ClipboardIcon className="w-5 h-5" />;
        default:
            return <StethoscopeIcon className="w-5 h-5" />;
    }
  }

  const getIconBgColor = (step?: Step) => {
     if (step?.isReferral) return 'bg-red-100 text-red-600';
     switch(step?.category){
        case 'Diagnosis': return 'bg-green-100 text-green-600';
        default: return 'bg-blue-100 text-blue-600';
     }
  }
  
  if (message.sender === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-xl rounded-br-lg p-3 max-w-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start gap-3">
        <div className={`p-2 rounded-full h-fit ${getIconBgColor(message.step)}`}>
            {getIcon(message.step)}
        </div>
        <div className="bg-white rounded-xl rounded-bl-lg p-4 max-w-md w-full shadow-sm border border-slate-200">
            {message.step?.category && <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{message.step.diagnosis ? 'Diagnosis' : message.step.category}</p>}
            {message.step?.diagnosis && <h3 className="text-lg font-bold text-slate-800 mb-2">{message.step.diagnosis}</h3>}
            <div className="text-slate-700 text-md">{message.content}</div>
            {message.step?.details && <div className="mt-3 p-3 bg-slate-50 border-l-4 border-slate-200 text-slate-600 text-sm rounded-r-md">{message.step.details}</div>}
            
            <div className="flex flex-col space-y-2 mt-4">
                {message.options?.map((option) => (
                    <button
                        key={option.text}
                        onClick={() => onSelect(option.nextStepId, option.text)}
                        className="w-full text-left p-3 text-sm font-medium text-slate-700 rounded-md border-2 transition-all duration-200 border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const addBotMessage = useCallback((stepId: string) => {
    const step = DECISION_TREE[stepId];
    if (!step) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'bot',
      content: step.prompt,
      step: step,
      options: step.options,
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  // Initial message
  useEffect(() => {
    const initialStep = DECISION_TREE['start'];
    setMessages([
      {
        id: 0,
        sender: 'bot',
        content: <DemographicsForm onSubmit={handleDemographicsSubmit} />,
        step: initialStep,
      },
    ]);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleDemographicsSubmit = (patientData: Patient) => {
    setPatient(patientData);
    const nextStepId = patientData.gender === 'Male' ? 'male_symptoms' : 'female_symptoms';
    
    setMessages(prev => [
      ...prev.slice(0, -1),
      {
        id: Date.now(),
        sender: 'user',
        content: `Patient: ${patientData.name}, ${patientData.age}, ${patientData.gender}`
      }
    ]);

    setHistory(['start']);
    setCurrentStepId(nextStepId);
    addBotMessage(nextStepId);
  };

  const handleOptionSelect = (nextStepId: string, text: string) => {
    setMessages(prev => prev.map((msg, index) =>
        index === prev.length - 1 ? { ...msg, options: [] } : msg
    ));
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: text }]);
    
    setHistory(prev => [...prev, currentStepId]);
    setCurrentStepId(nextStepId);
    addBotMessage(nextStepId);
  };

  const handleRestart = () => {
    setPatient(null);
    setHistory([]);
    setCurrentStepId('start');
    const initialStep = DECISION_TREE['start'];
    setMessages([
      {
        id: 0,
        sender: 'bot',
        content: <DemographicsForm onSubmit={handleDemographicsSubmit} />,
        step: initialStep,
      },
    ]);
  };

  const handleBack = () => {
    if (history.length === 0 || history[history.length -1] === 'start') return;

    const newHistory = [...history];
    const prevStepId = newHistory.pop();
    if (!prevStepId) return;

    setHistory(newHistory);
    
    const lastUserMessageIndex = messages.findLastIndex(m => m.sender === 'user');
    setMessages(prev => prev.slice(0, lastUserMessageIndex - 1));

    setCurrentStepId(prevStepId);
    addBotMessage(prevStepId);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl flex flex-col h-[90vh] bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200">
        <div className="p-4 border-b border-slate-200 text-center">
            <h1 className="text-xl font-bold text-slate-800">Genito-Urinary Clinical Decision Support</h1>
            <p className="text-slate-500 text-sm mt-1">An interactive assistant for GU diagnosis pathways.</p>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} onSelect={handleOptionSelect} />
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-center gap-4 bg-slate-50/50 rounded-b-2xl">
            <button
                onClick={handleRestart}
                className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors duration-300"
            >
                Start Over
            </button>
            {history.length > 0 && history[history.length - 1] !== 'start' && (
            <button
                onClick={handleBack}
                className="bg-white text-slate-600 font-semibold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors duration-300 border border-slate-300"
            >
                Back
            </button>
            )}
        </div>
      </div>
    </div>
  );
}

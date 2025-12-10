"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 👇 I added ArrowRight to this list
import { Activity, ArrowRight, Check, Play, ChevronRight, ChevronDown, Lock, Loader2, X, Plus, Flame, Camera, Mic, LogOut } from "lucide-react";

// --- NAVBAR ---
const NavBar = ({ activeTab, setActiveTab, logout }: any) => (
  <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-panel px-2 py-2 rounded-full flex gap-1 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
    {['Train', 'Fuel', 'Track'].map((tab) => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
          activeTab === tab 
            ? 'bg-[#dcfc04] text-black shadow-[0_0_20px_rgba(220,252,4,0.4)] scale-105' 
            : 'text-gray-500 hover:text-white'
        }`}
      >
        {tab}
      </button>
    ))}
    <button onClick={logout} className="px-4 py-3 rounded-full text-red-500 hover:bg-white/10 transition flex items-center justify-center">
        <LogOut size={18} />
    </button>
  </nav>
);

export default function Home() {
  // --- STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStep, setLoginStep] = useState(0); 
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  // Dashboard
  const [activeTab, setActiveTab] = useState("Train");
  const [selectedGoal, setSelectedGoal] = useState("Muscle Gain");
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [calories, setCalories] = useState<any[]>([]);
  const [calInput, setCalInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stats
  const calGoal = 2500;
  const currentCals = calories.reduce((a, b) => a + b.cal, 0);
  const progress = Math.min((currentCals / calGoal) * 100, 100);

  // --- ACTIONS ---
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginStep(0); 
    setEmail("");
    setOtp("");
    setPlan(null); 
    setActiveTab("Train");
  };

  const handleGoalSwitch = (goal: string) => {
    setSelectedGoal(goal);
    setPlan(null); 
    setExpandedExercise(null);
  };

  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) return alert("Voice not supported in this browser.");
    // @ts-ignore
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognition.onresult = (event: any) => {
      setCalInput(event.results[0][0].transcript);
    };
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        const res = await fetch("/api/analyze-food", {
          method: "POST", body: JSON.stringify({ image: base64Image }),
        });
        const data = await res.json();
        if(data.food) {
            setCalories([...calories, { food: data.food, cal: data.calories }]);
            alert(`AI Identified: ${data.food} (${data.calories} kcal)`);
        }
      } catch (error) { alert("AI could not identify food."); }
      setAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePlan = async () => {
      setLoading(true);
      setExpandedExercise(null); 
      try {
        const res = await fetch("/api/generate", {
            method: "POST",
            body: JSON.stringify({ name: "Athlete", goal: selectedGoal })
        });
        const data = await res.json();
        setPlan(data);
      } catch (e) { alert("AI Generation Error"); }
      setLoading(false);
  };

  // --- LOGIN ---
  const handleEmailSubmit = (e: any) => { e.preventDefault(); if(email) { setLoginStep(1); setTimeout(() => setLoginStep(2), 1500); } };
  const handleOtpSubmit = (e: any) => { e.preventDefault(); if(otp === "1234") { setLoginStep(3); setTimeout(() => setIsLoggedIn(true), 1500); } else alert("Use 1234"); };

  // --- RENDER ---
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex w-full bg-black overflow-hidden">
        {/* LEFT: CINEMATIC VIDEO */}
        <div className="hidden lg:flex w-1/2 relative bg-[#0a0a0a] items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
             <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" className="w-full h-full object-cover grayscale opacity-60 animate-[pulse_10s_ease-in-out_infinite]" />
             <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black/80" />
          </div>
          <div className="relative z-10 p-12 w-full">
            <motion.h1 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1 }} className="text-8xl font-[family-name:var(--font-anton)] text-white uppercase leading-[0.9] drop-shadow-2xl">
              Define<br/>Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dcfc04] to-white">Legacy.</span>
            </motion.h1>
            <div className="mt-8 flex items-center gap-4"><div className="w-16 h-[2px] bg-[#dcfc04]" /><p className="text-gray-300 uppercase tracking-[0.3em] text-xs font-bold">Ai Performance Architecture</p></div>
          </div>
        </div>
        {/* RIGHT: AUTH */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="w-full max-w-[400px] relative z-10">
            <div className="mb-10">
               <div className="flex items-center gap-2 mb-2"><Activity className="text-[#dcfc04]" size={32} /><span className="text-2xl font-[family-name:var(--font-anton)] text-white tracking-wide">VIGOR<span className="text-[#dcfc04]">AI</span></span></div>
               <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            </div>
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {loginStep === 0 && (
                  <motion.form key="email" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handleEmailSubmit} className="space-y-4">
                    <div><label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full mt-2 bg-white/5 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-[#dcfc04] transition-colors" /></div>
                    <button className="w-full bg-white text-black font-black uppercase py-4 rounded-xl hover:bg-[#dcfc04] transition-all flex items-center justify-center gap-2 group">Continue <ArrowRight size={18} /></button>
                  </motion.form>
                )}
                {loginStep === 1 && (<motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-12 flex flex-col items-center justify-center space-y-4"><Loader2 size={40} className="animate-spin text-[#dcfc04]" /><span className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Verifying Credentials...</span></motion.div>)}
                {loginStep === 2 && (
                  <motion.form key="otp" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10"><Lock size={16} className="text-[#dcfc04]" /><span className="text-sm text-gray-400">Code sent to <span className="text-white">{email}</span></span></div>
                    <input type="text" maxLength={4} placeholder="0000" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full text-center text-4xl font-[family-name:var(--font-anton)] tracking-[0.5em] bg-transparent border-b-2 border-white/20 py-4 text-white focus:border-[#dcfc04] outline-none" />
                    <button className="w-full bg-[#dcfc04] text-black font-black uppercase py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(220,252,4,0.3)]">Verify & Access</button>
                    <p className="text-center text-xs text-gray-600">Hint: Use code 1234</p>
                  </motion.form>
                )}
                {loginStep === 3 && (<motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center"><div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(34,197,94,0.5)]"><Check className="text-black" size={32} /></div><h3 className="text-2xl font-[family-name:var(--font-anton)] text-white uppercase">Authorized</h3></motion.div>)}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <header className="p-6 flex justify-between items-center sticky top-0 z-40 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#dcfc04] flex items-center justify-center text-black font-bold shadow-[0_0_15px_rgba(220,252,4,0.4)]">{email.charAt(0).toUpperCase() || "U"}</div><div><h3 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Operative Status</h3><p className="font-bold text-lg leading-none flex items-center gap-2">ACTIVE <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/></p></div></div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5"><Flame className="text-orange-500 fill-orange-500" size={16} /><span className="font-bold text-sm">DAY 12</span></div>
      </header>

      <main className="px-4 max-w-2xl mx-auto mt-4">
        <AnimatePresence mode="wait">
          
          {/* === TRAIN TAB === */}
          {activeTab === "Train" && (
            <motion.div key="train" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              
              {/* HERO SECTION */}
              <div className="relative h-72 rounded-[30px] overflow-hidden group border border-white/10 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                   <span className="text-[10px] font-bold text-[#dcfc04] uppercase tracking-widest">Next Session</span>
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h1 className="text-5xl font-[family-name:var(--font-anton)] uppercase mt-2 leading-[0.9] drop-shadow-lg">
                    Destroy<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Weakness</span>
                  </h1>
                  
                  {/* --- GOAL SELECTOR (ALWAYS VISIBLE NOW) --- */}
                  <div className="flex gap-2 mb-4 justify-start overflow-x-auto pb-2">
                    {['Muscle Gain', 'Weight Loss', 'Strength'].map((g) => (
                      <button 
                        key={g} 
                        onClick={() => handleGoalSwitch(g)} 
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                          selectedGoal === g 
                            ? 'bg-[#dcfc04] text-black border-[#dcfc04]' 
                            : 'bg-black/40 text-gray-500 border-white/10 hover:border-white/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  {!plan ? (
                    <button onClick={handleGeneratePlan} className="bg-[#dcfc04] text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(220,252,4,0.4)]">
                      {loading ? <><Loader2 className="animate-spin" size={18}/> BUILDING PROTOCOL...</> : <><Play size={18} fill="black" /> GENERATE {selectedGoal.toUpperCase()}</>}
                    </button>
                  ) : (
                    <div className="flex gap-2 mt-4"><span className="bg-white text-black px-3 py-1 rounded-md text-xs font-bold">PROTOCOL LOADED</span></div>
                  )}
                </div>
              </div>

              {/* EXERCISE LIST (ACCORDION) */}
              {plan && plan.workout_plan && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end px-2"><h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Protocol Sequence</h3><span className="text-[#dcfc04] text-xs font-bold">{plan.workout_plan[0].exercises.length} EXERCISES</span></div>
                  {plan.workout_plan[0].exercises.map((ex: any, i: number) => {
                    const isOpen = expandedExercise === i;
                    return (
                      <motion.div key={i} layout transition={{ duration: 0.3 }} className={`glass-panel rounded-2xl overflow-hidden border transition-all ${isOpen ? 'border-[#dcfc04]' : 'border-white/5 hover:border-white/20'}`}>
                        {/* HEADER */}
                        <div onClick={() => setExpandedExercise(isOpen ? null : i)} className="p-5 flex items-center justify-between cursor-pointer bg-black/20">
                          <div className="flex items-center gap-5">
                            <span className={`text-4xl font-[family-name:var(--font-anton)] transition-colors ${isOpen ? 'text-[#dcfc04]' : 'text-gray-800'}`}>0{i+1}</span>
                            <div><h4 className="font-bold text-lg leading-none mb-1 text-white">{ex.name}</h4><p className="text-xs text-[#dcfc04] font-mono font-bold tracking-wider">{ex.reps}</p></div>
                          </div>
                          {isOpen ? <ChevronDown className="text-[#dcfc04]" /> : <ChevronRight className="text-gray-600" />}
                        </div>

                        {/* BODY */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-black/40 border-t border-white/5">
                              <div className="p-4 md:flex gap-4">
                                <div className="w-full md:w-1/2 aspect-video rounded-xl overflow-hidden border border-white/10 shadow-lg relative bg-black">
                                   {ex.video ? (<iframe src={ex.video} className="w-full h-full object-cover" allow="autoplay; encrypted-media" allowFullScreen></iframe>) : (<div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">NO SIGNAL</div>)}
                                </div>
                                <div className="w-full md:w-1/2 mt-3 md:mt-0 flex flex-col justify-center">
                                   <h5 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Technique Guide</h5>
                                   <p className="text-sm text-gray-300 leading-relaxed mb-4">{ex.description || "Control the weight. Feel the squeeze."}</p>
                                   <button className="w-full py-2 bg-white/5 hover:bg-[#dcfc04] hover:text-black rounded-lg text-xs font-bold uppercase transition-colors">Log Set</button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* === TRACK TAB === */}
          {activeTab === "Track" && (
            <motion.div key="track" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="pt-4 text-center">
              <div className="relative w-72 h-72 mx-auto mb-8">
                <div className="absolute inset-0 bg-[#dcfc04] blur-[60px] opacity-10 rounded-full" />
                <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl"><circle cx="144" cy="144" r="130" stroke="#1a1a1a" strokeWidth="16" fill="transparent" /><circle cx="144" cy="144" r="130" stroke="#dcfc04" strokeWidth="16" fill="transparent" strokeDasharray={816} strokeDashoffset={816 - (816 * progress) / 100} strokeLinecap="round" className="transition-all duration-[1.5s] ease-out" /></svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-7xl font-[family-name:var(--font-anton)] tracking-tighter text-white drop-shadow-lg">{currentCals}</span><span className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Kcal Burned</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mx-4 mb-4">
                 <button onClick={() => fileInputRef.current?.click()} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition gap-2 border border-white/10"><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />{analyzing ? <Loader2 className="animate-spin text-[#dcfc04]" /> : <Camera className="text-[#dcfc04]" />}<span className="text-xs font-bold uppercase tracking-widest">Scan Food</span></button>
                 <button onClick={handleVoice} className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 transition gap-2 border border-white/10"><Mic className="text-[#dcfc04]" /><span className="text-xs font-bold uppercase tracking-widest">Voice Log</span></button>
              </div>
              <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 mx-4 border border-white/10 shadow-lg"><div className="p-3 bg-[#dcfc04] rounded-xl text-black"><Plus size={24} /></div><input value={calInput} onChange={(e) => setCalInput(e.target.value)} placeholder="LOG INTAKE..." className="bg-transparent flex-1 p-3 text-white font-bold outline-none placeholder:text-gray-600 placeholder:font-normal uppercase text-sm" /><button onClick={() => { if(!calInput) return; setCalories([...calories, { food: calInput, cal: Math.floor(Math.random() * 300) + 100 }]); setCalInput(""); }} className="px-6 py-3 font-bold text-sm text-[#dcfc04] hover:bg-white/5 rounded-xl transition">ADD</button></div>
              <div className="space-y-3 px-4 mt-8 text-left">{calories.map((c, i) => (<motion.div initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} key={i} className="flex justify-between p-5 bg-white/5 rounded-2xl border border-white/5"><span className="font-bold text-sm uppercase">{c.food}</span><span className="text-[#dcfc04] font-mono font-bold">{c.cal}</span></motion.div>))}</div>
            </motion.div>
          )}

           {/* === FUEL TAB === */}
           {activeTab === "Fuel" && (
            <motion.div key="fuel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
               <div className="px-4"><h1 className="text-4xl font-[family-name:var(--font-anton)] uppercase leading-none">Elite<br/><span className="text-[#dcfc04]">Nutrition</span></h1></div>
              <div className="grid gap-6 px-4 pb-20">
                {['Protein Oats', 'Steak & Greens', 'Whey Isolate'].map((meal, i) => (
                   <div key={i} className="glass-panel rounded-[24px] overflow-hidden border border-white/10 group">
                     <div className="h-48 relative overflow-hidden"><img src={`https://pollinations.ai/p/${encodeURIComponent(meal + " dark moody food photography 8k")}?width=500&height=300&nologo=true`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" /><span className="absolute bottom-4 left-4 text-3xl font-[family-name:var(--font-anton)] uppercase text-white z-10">{meal}</span></div>
                     <div className="p-5 flex justify-between items-center bg-black/40 backdrop-blur-md"><div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Macro Profile</p><p className="text-white text-sm font-bold">450 KCAL • 42G PRO</p></div><button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#dcfc04] hover:text-black hover:border-[#dcfc04] transition-all"><ArrowRight size={18} /></button></div>
                   </div>
                ))}
              </div>
            </motion.div>
           )}
        </AnimatePresence>
      </main>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} logout={handleLogout} />
    </div>
  );
}
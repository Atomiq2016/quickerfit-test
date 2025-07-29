import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Minus, RotateCcw, Home, CreditCard, Check } from 'lucide-react';
import SubscriptionPage from './components/SubscriptionPage';

interface Session {
  id: string;
  date: string;
  time: string;
  duration: string;
  type: 'countdown' | 'countup';
}

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'subscription'>('home');
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'countdown' | 'countup'>('countdown');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [initialTime, setInitialTime] = useState(300);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionLoggedRef = useRef(false);

  // Audio context and sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  // Create tick sound (short beep)
  const playTick = () => {
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Create chirping alarm sound
  const playChirpAlarm = () => {
    const audioContext = initAudioContext();
    
    // Create multiple chirps
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Chirp effect: frequency sweep
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      }, i * 200);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          if (mode === 'countdown') {
            // Play tick sound for last 5 seconds
            if (prevTime <= 5 && prevTime > 1) {
              playTick();
            }
            
            if (prevTime <= 1) {
              // Timer finished - play alarm and log session only once
              if (!sessionLoggedRef.current) {
                playChirpAlarm();
                logSession();
                sessionLoggedRef.current = true;
              }
              setIsRunning(false);
              return 0;
            }
            return prevTime - 1;
          } else {
            return prevTime + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const logSession = () => {
    const now = new Date();
    const session: Session = {
      id: Math.random().toString(36).substr(2, 9),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      duration: formatTime(mode === 'countdown' ? initialTime : time),
      type: mode
    };
    setSessions(prev => [session, ...prev]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isRunning) {
      // Initialize audio context on user interaction
      initAudioContext();
      setStartTime(Date.now());
      setInitialTime(time);
      sessionLoggedRef.current = false; // Reset the flag when starting
    } else {
      // If stopping manually, only log for count-up mode (not countdown)
      if (startTime && !sessionLoggedRef.current && mode === 'countup') {
        logSession();
        sessionLoggedRef.current = true;
      }
    }
    setIsRunning(!isRunning);
  };

  const adjustTime = (delta: number) => {
    if (!isRunning && mode === 'countdown') {
      setTime(prev => Math.max(0, prev + delta * 60));
    }
  };

  const startHold = (delta: number) => {
    if (mode === 'countup') return;
    holdTimeoutRef.current = setTimeout(() => {
      holdIntervalRef.current = setInterval(() => {
        adjustTime(delta);
      }, 200);
    }, 1000);
  };

  const stopHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
  };

  const toggleMode = () => {
    if (!isRunning) {
      setMode(mode === 'countdown' ? 'countup' : 'countdown');
      if (mode === 'countup') {
        setTime(300); // Reset to 5 minutes for countdown
      } else {
        setTime(0); // Always start at 0 for count up
      }
      sessionLoggedRef.current = false; // Reset flag when changing modes
    }
  };

  const getProgressPercentage = () => {
    if (mode === 'countdown' && initialTime > 0 && isRunning) {
      // For countdown, show remaining time (drains from full to empty)
      return (time / initialTime) * 100;
    }
    // When not running, show full progress bar for countdown, empty for countup
    return mode === 'countdown' ? 100 : 0;
  };

  if (currentPage === 'subscription') {
    return <SubscriptionPage onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen text-gray-900 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://i.ibb.co/6cgL50K4/QfitBG.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      
      {/* Color Overlay for Theme Blending */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.3) 0%, rgba(148, 163, 184, 0.2) 50%, rgba(31, 41, 55, 0.1) 100%)',
          mixBlendMode: 'overlay'
        }}
      />
      
      {/* iPhone-optimized container */}
      <div className="max-w-sm mx-auto px-4 pt-12 pb-4 relative z-20" style={{ maxWidth: '375px' }}>
        {/* Header */}
        <div className="text-center mb-6">
          <img 
            src="https://i.ibb.co/5g5PZBP7/QfitLogo.png" 
            alt="QuickFit Logo" 
            className="mx-auto mb-1"
            style={{ height: '50px' }}
          />
          <div className="inline-flex items-center bg-gray-800 text-white px-2.5 py-1 rounded-full text-xs">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>
            {mode === 'countdown' ? 'Countdown' : 'Count Up'}
          </div>
        </div>

        {/* Timer Display with Rectangular Progress - Tighter */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {/* Background Rectangle - Smaller and tighter */}
            <div className="w-48 h-16 border-2 border-gray-300 rounded-xl relative overflow-hidden">
              {/* Progress Rectangle - Drains from right to left */}
              <div 
                className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-1000 ease-out rounded-lg"
                style={{ 
                  width: `${getProgressPercentage()}%`
                }}
              />
              
              {/* Timer Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-light italic text-gray-800 tracking-tight">
                  {formatTime(time)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {/* Plus/Minus Buttons Stack */}
          <div className="flex flex-col gap-1">
            <button
              onMouseDown={() => {
                adjustTime(1);
                startHold(1);
              }}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => {
                adjustTime(1);
                startHold(1);
              }}
              onTouchEnd={stopHold}
              disabled={isRunning || mode === 'countup'}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onMouseDown={() => {
                adjustTime(-1);
                startHold(-1);
              }}
              onMouseUp={stopHold}
              onMouseLeave={stopHold}
              onTouchStart={() => {
                adjustTime(-1);
                startHold(-1);
              }}
              onTouchEnd={stopHold}
              disabled={isRunning || mode === 'countup'}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center text-white"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Start/Pause Button */}
          <button
            onClick={toggleTimer}
            className="w-14 h-14 bg-emerald-400 hover:bg-emerald-500 rounded-full transition-all duration-200 active:scale-95 shadow-lg flex items-center justify-center text-gray-800"
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>

          {/* Mode Toggle Button */}
          <button
            onClick={toggleMode}
            disabled={isRunning}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Session Log */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-2 text-gray-700">Recent Sessions</h2>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="text-center py-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-dashed rounded-full"></div>
                </div>
                <p className="text-gray-500 text-xs">No sessions yet</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      session.type === 'countdown' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{session.duration}</div>
                      <div className="text-xs text-gray-500">
                        {session.type === 'countdown' ? 'Countdown' : 'Count Up'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <div>{session.date}</div>
                    <div>{session.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-3 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-sm font-medium">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button 
            onClick={() => setCurrentPage('subscription')}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2.5 px-3 rounded-full transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 text-sm font-medium"
          >
            <CreditCard className="w-4 h-4" />
            <span>Subscription</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
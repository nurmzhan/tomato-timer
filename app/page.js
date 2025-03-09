"use client"
import { useState, useEffect } from 'react';

const WORK_TIME = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const CYCLES_BEFORE_LONG_BREAK = 4;

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [mode, setMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextMode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning]);

  const handleNextMode = () => {
    if (mode === 'work') {
      if ((cycles + 1) % CYCLES_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeLeft(LONG_BREAK);
      } else {
        setMode('shortBreak');
        setTimeLeft(SHORT_BREAK);
      }
      setCycles((prev) => prev + 1);
    } else {
      setMode('work');
      setTimeLeft(WORK_TIME);
    }
  };

  const startPauseHandler = () => setIsRunning(!isRunning);
  const resetHandler = () => {
    setIsRunning(false);
    setMode('work');
    setTimeLeft(WORK_TIME);
    setCycles(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`h-screen flex flex-col justify-center items-center transition-colors ${mode === 'work' ? 'bg-red-500' : mode === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500'}`}>
      <h1 className="text-4xl font-bold text-white">{mode === 'work' ? 'Work' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}</h1>
      <p className="text-6xl font-mono text-white mt-4">{formatTime(timeLeft)}</p>
      <div className="mt-6 flex space-x-4">
        <button className="px-6 py-3 bg-white text-black rounded-lg text-lg font-bold" onClick={startPauseHandler}>{isRunning ? 'Pause' : 'Start'}</button>
        <button className="px-6 py-3 bg-gray-200 text-black rounded-lg text-lg font-bold" onClick={resetHandler}>Reset</button>
      </div>
    </div>
  );
}

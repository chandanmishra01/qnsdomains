import React from "react";
import Image from "next/image";

const ImagePlaceholder = () => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Outer neon box glow effect */}
      <div className="absolute -inset-1 bg-red-600 blur-md opacity-70 rounded-xl"></div>
      
      {/* Main card container */}
      <div className="relative rounded-xl bg-black overflow-hidden shadow-2xl border border-red-500">
        {/* Glitchy scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-gradient-to-b from-transparent via-red-500 to-transparent animate-scan"></div>
        </div>
        
        {/* Card header with glowing effect */}
        <div className="border-b-2 border-red-800 py-3 px-5 text-center relative">
          {/* Header glow lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-red-500 shadow-glow"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-red-500 shadow-glow"></div>
          
          <h2 className="text-lg font-bold text-white uppercase tracking-widest inline-flex items-center justify-center">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
            MINTING IN PROGRESS
          </h2>
        </div>
        
        {/* Main content */}
        <div className="p-6">
          {/* Center visualization and progress */}
          <div className="flex flex-col items-center mb-6">
            {/* Domain visualization with neon border */}
            <div className="relative mb-8 w-40 h-40">
              <div className="absolute inset-0 rounded-xl bg-red-600 blur-md opacity-70"></div>
              <div className="relative w-full h-full rounded-xl bg-gradient-to-r from-black to-gray-900 border-2 border-red-500 flex items-center justify-center overflow-hidden">
                {/* Corner light effects */}
                <div className="absolute top-0 left-0 w-6 h-6">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
                  <div className="absolute top-0 left-0 h-full w-1 bg-red-500"></div>
                </div>
                <div className="absolute top-0 right-0 w-6 h-6">
                  <div className="absolute top-0 right-0 w-full h-1 bg-red-500"></div>
                  <div className="absolute top-0 right-0 h-full w-1 bg-red-500"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-6 h-6">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500"></div>
                  <div className="absolute bottom-0 left-0 h-full w-1 bg-red-500"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6">
                  <div className="absolute bottom-0 right-0 w-full h-1 bg-red-500"></div>
                  <div className="absolute bottom-0 right-0 h-full w-1 bg-red-500"></div>
                </div>
                
                {/* Domain Visualization - Digital Network */}
                <div className="relative z-10 w-full h-full flex items-center justify-center p-3">
                  {/* Node connection visualization */}
                  <div className="relative w-full h-full">
                    {/* Central node */}
                    <div className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 bg-red-600 bg-opacity-30 rounded-full border border-red-500 z-20 flex items-center justify-center animate-pulse-slow">
                      <div className="text-xs text-white font-mono">.quai</div>
                    </div>
                    
                    {/* Secondary nodes */}
                    <div className="absolute top-1/4 left-1/4 w-6 h-6 -translate-x-1/2 -translate-y-1/2 bg-red-900 bg-opacity-50 rounded-full border border-red-700 flex items-center justify-center animate-pulse-slower">
                      <div className="text-[8px] text-white font-mono">A</div>
                    </div>
                    <div className="absolute top-1/5 right-1/4 w-8 h-8 translate-x-1/2 -translate-y-1/2 bg-red-900 bg-opacity-40 rounded-full border border-red-700 flex items-center justify-center animate-pulse-slow">
                      <div className="text-[10px] text-white font-mono">l</div>
                    </div>
                    <div className="absolute bottom-1/4 right-1/3 w-7 h-7 translate-x-1/2 translate-y-1/2 bg-red-900 bg-opacity-40 rounded-full border border-red-700 flex items-center justify-center animate-pulse-medium">
                      <div className="text-[10px] text-white font-mono">i</div>
                    </div>
                    <div className="absolute bottom-1/3 left-1/4 w-9 h-9 -translate-x-1/2 translate-y-1/2 bg-red-900 bg-opacity-30 rounded-full border border-red-700 flex items-center justify-center animate-pulse-slow">
                      <div className="text-[10px] text-white font-mono">c</div>
                    </div>
                    <div className="absolute top-1/2 right-1/6 w-5 h-5 translate-x-1/2 -translate-y-1/2 bg-red-900 bg-opacity-60 rounded-full border border-red-700 flex items-center justify-center animate-pulse-medium">
                      <div className="text-[8px] text-white font-mono">e</div>
                    </div>
                    
                    {/* Connection lines */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <line x1="50" y1="50" x2="25" y2="25" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="0.5" strokeDasharray="2 1" />
                      <line x1="50" y1="50" x2="75" y2="20" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="0.5" strokeDasharray="2 1" />
                      <line x1="50" y1="50" x2="67" y2="75" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="0.5" strokeDasharray="2 1" />
                      <line x1="50" y1="50" x2="25" y2="67" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="0.5" strokeDasharray="2 1" />
                      <line x1="50" y1="50" x2="83" y2="50" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="0.5" strokeDasharray="2 1" />
                    </svg>
                    
                    {/* Digital particles */}
                    <div className="absolute inset-0">
                      <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-float-1"></div>
                      <div className="absolute top-3/5 right-1/4 w-1 h-1 bg-white rounded-full animate-float-2"></div>
                      <div className="absolute bottom-1/3 left-1/2 w-1 h-1 bg-white rounded-full animate-float-3"></div>
                      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-float-4"></div>
                    </div>
                  </div>
                </div>
                
                {/* Subtle star field effect */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKSIvPjwvc3ZnPg==')] opacity-30"></div>
              </div>
            </div>
            
            {/* Percentage display */}
            <div className="relative mb-2">
              <div className="text-6xl font-bold text-white">60<span className="text-red-500">%</span></div>
              <div className="absolute -inset-1 bg-red-500 opacity-20 blur-md rounded-full"></div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full mb-6">
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-red-800">
                <div className="h-full bg-gradient-to-r from-red-900 to-red-500 relative" style={{ width: '60%' }}>
                  {/* Animated glow effect on progress bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* QNS Protocol Badge */}
          <div className="flex justify-center mb-6">
            <div className="px-3 py-1 bg-black border border-red-700 rounded-full flex items-center space-x-2">
              <span className="text-red-500 font-bold text-sm">QNS</span>
              
            </div>
          </div>
          
          {/* Domain info with neon effects */}
          <div className="relative py-4 px-6 bg-gray-900 bg-opacity-50 rounded-lg border border-red-800 mb-6">
            {/* Corner light effect */}
            <div className="absolute top-0 right-0 w-3 h-3">
              <div className="absolute top-0 right-0 w-full h-1 bg-red-500"></div>
              <div className="absolute top-0 right-0 h-full w-1 bg-red-500"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-center mb-2 text-white">
              Alice<span className="text-red-500">.quai</span>
            </h3>
            
            <div className="flex items-center justify-center">
              <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-gray-300 text-sm">Owned by <span className="text-red-400">0x23..D1</span></p>
            </div>
          </div>
          
          {/* Time estimate with tech-style display */}
          {/* <div className="flex justify-between items-center px-4 py-3 bg-black bg-opacity-70 rounded-lg border border-red-900 mb-4">
            <div className="text-gray-400 text-sm">Est. completion:</div>
            <div className="font-mono text-red-500 font-bold text-sm">00:02:45</div>
          </div> */}
        </div>
      </div>
      
      {/* Add style for the animations and glow */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-medium {
          animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.7; }
          50% { transform: translate(10px, -5px); opacity: 1; }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(-7px, 10px); opacity: 0.9; }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); opacity: 0.8; }
          50% { transform: translate(5px, 5px); opacity: 1; }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); opacity: 0.7; }
          50% { transform: translate(-8px, -8px); opacity: 0.9; }
        }
        .shadow-glow {
          box-shadow: 0 0 5px 1px rgba(239, 68, 68, 0.7);
        }
      `}</style>
    </div>
  );
};

export default ImagePlaceholder;
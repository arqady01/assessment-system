"use client"

import React from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  type = 'button',
  className = ''
}) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`uiverse ${className}`}
      style={{
        '--duration': '7s',
        '--easing': 'linear',
        '--c-color-1': 'rgba(212, 226, 254, 0.7)',
        '--c-color-2': '#3B82F6',
        '--c-color-3': '#6366F1',
        '--c-color-4': 'rgba(212, 226, 254, 0.8)',
        '--c-shadow': 'rgba(212, 226, 254, 0.5)',
        '--c-shadow-inset-top': 'rgba(212, 226, 254, 0.9)',
        '--c-shadow-inset-bottom': 'rgba(239, 246, 255, 0.8)',
        '--c-radial-inner': '#D4E2FE',
        '--c-radial-outer': '#E0E7FF',
        '--c-color': '#1E40AF',
      } as React.CSSProperties}
    >
      <div className="wrapper">
        <span>{children}</span>
        <div className="circle circle-12" />
        <div className="circle circle-11" />
        <div className="circle circle-10" />
        <div className="circle circle-9" />
        <div className="circle circle-8" />
        <div className="circle circle-7" />
        <div className="circle circle-6" />
        <div className="circle circle-5" />
        <div className="circle circle-4" />
        <div className="circle circle-3" />
        <div className="circle circle-2" />
        <div className="circle circle-1" />
      </div>

      <style jsx>{`
        .uiverse {
          -webkit-tap-highlight-color: transparent;
          -webkit-appearance: none;
          outline: none;
          position: relative;
          cursor: pointer;
          border: none;
          display: table;
          border-radius: 24px;
          padding: 0;
          margin: 0;
          text-align: center;
          font-weight: 600;
          font-size: 16px;
          letter-spacing: 0.02em;
          line-height: 1.5;
          color: var(--c-color);
          background: radial-gradient(
            circle,
            var(--c-radial-inner),
            var(--c-radial-outer) 80%
          );
          box-shadow: 0 0 14px var(--c-shadow);
          width: 100%;
        }

        .uiverse:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .uiverse:before {
          content: "";
          pointer-events: none;
          position: absolute;
          z-index: 3;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          border-radius: 24px;
          box-shadow:
            inset 0 3px 12px var(--c-shadow-inset-top),
            inset 0 -3px 4px var(--c-shadow-inset-bottom);
        }

        .uiverse .wrapper {
          -webkit-mask-image: -webkit-radial-gradient(white, black);
          overflow: hidden;
          border-radius: 24px;
          min-width: 132px;
          padding: 12px 0;
        }

        .uiverse .wrapper span {
          display: inline-block;
          position: relative;
          z-index: 1;
        }

        .uiverse:hover:not(:disabled) {
          --duration: 1400ms;
        }

        .uiverse .wrapper .circle {
          position: absolute;
          left: 0;
          top: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          filter: blur(var(--blur, 8px));
          background: var(--background, transparent);
          transform: translate(var(--x, 0), var(--y, 0)) translateZ(0);
          animation: var(--animation, none) var(--duration) var(--easing) infinite;
        }

        .uiverse .wrapper .circle.circle-1,
        .uiverse .wrapper .circle.circle-9,
        .uiverse .wrapper .circle.circle-10 {
          --background: var(--c-color-4);
        }

        .uiverse .wrapper .circle.circle-3,
        .uiverse .wrapper .circle.circle-4 {
          --background: var(--c-color-2);
          --blur: 14px;
        }

        .uiverse .wrapper .circle.circle-5,
        .uiverse .wrapper .circle.circle-6 {
          --background: var(--c-color-3);
          --blur: 16px;
        }

        .uiverse .wrapper .circle.circle-2,
        .uiverse .wrapper .circle.circle-7,
        .uiverse .wrapper .circle.circle-8,
        .uiverse .wrapper .circle.circle-11,
        .uiverse .wrapper .circle.circle-12 {
          --background: var(--c-color-1);
          --blur: 12px;
        }

        .uiverse .wrapper .circle.circle-1 {
          --x: 10%;
          --y: -40px;
          --animation: circle-1;
        }

        .uiverse .wrapper .circle.circle-2 {
          --x: 85%;
          --y: 8px;
          --animation: circle-2;
        }

        .uiverse .wrapper .circle.circle-3 {
          --x: 5%;
          --y: -12px;
          --animation: circle-3;
        }

        .uiverse .wrapper .circle.circle-4 {
          --x: 75%;
          --y: -12px;
          --animation: circle-4;
        }

        .uiverse .wrapper .circle.circle-5 {
          --x: 25%;
          --y: -4px;
          --animation: circle-5;
        }

        .uiverse .wrapper .circle.circle-6 {
          --x: 65%;
          --y: 16px;
          --animation: circle-6;
        }

        .uiverse .wrapper .circle.circle-7 {
          --x: 15%;
          --y: 28px;
          --animation: circle-7;
        }

        .uiverse .wrapper .circle.circle-8 {
          --x: 45%;
          --y: -4px;
          --animation: circle-8;
        }

        .uiverse .wrapper .circle.circle-9 {
          --x: 35%;
          --y: -12px;
          --animation: circle-9;
        }

        .uiverse .wrapper .circle.circle-10 {
          --x: 80%;
          --y: 16px;
          --animation: circle-10;
        }

        .uiverse .wrapper .circle.circle-11 {
          --x: 20%;
          --y: 4px;
          --animation: circle-11;
        }

        .uiverse .wrapper .circle.circle-12 {
          --blur: 14px;
          --x: 60%;
          --y: 4px;
          --animation: circle-12;
        }

        @keyframes circle-1 {
          33% {
            transform: translate(15%, 16px) translateZ(0);
          }
          66% {
            transform: translate(25%, 64px) translateZ(0);
          }
        }

        @keyframes circle-2 {
          33% {
            transform: translate(70%, -10px) translateZ(0);
          }
          66% {
            transform: translate(60%, -48px) translateZ(0);
          }
        }

        @keyframes circle-3 {
          33% {
            transform: translate(30%, 12px) translateZ(0);
          }
          66% {
            transform: translate(20%, 4px) translateZ(0);
          }
        }

        @keyframes circle-4 {
          33% {
            transform: translate(80%, -12px) translateZ(0);
          }
          66% {
            transform: translate(90%, -8px) translateZ(0);
          }
        }

        @keyframes circle-5 {
          33% {
            transform: translate(70%, 28px) translateZ(0);
          }
          66% {
            transform: translate(50%, -32px) translateZ(0);
          }
        }

        @keyframes circle-6 {
          33% {
            transform: translate(40%, -16px) translateZ(0);
          }
          66% {
            transform: translate(75%, -56px) translateZ(0);
          }
        }

        @keyframes circle-7 {
          33% {
            transform: translate(20%, 28px) translateZ(0);
          }
          66% {
            transform: translate(35%, -60px) translateZ(0);
          }
        }

        @keyframes circle-8 {
          33% {
            transform: translate(55%, -4px) translateZ(0);
          }
          66% {
            transform: translate(65%, -20px) translateZ(0);
          }
        }

        @keyframes circle-9 {
          33% {
            transform: translate(45%, -12px) translateZ(0);
          }
          66% {
            transform: translate(85%, -8px) translateZ(0);
          }
        }

        @keyframes circle-10 {
          33% {
            transform: translate(75%, 20px) translateZ(0);
          }
          66% {
            transform: translate(95%, 28px) translateZ(0);
          }
        }

        @keyframes circle-11 {
          33% {
            transform: translate(10%, 4px) translateZ(0);
          }
          66% {
            transform: translate(70%, 20px) translateZ(0);
          }
        }

        @keyframes circle-12 {
          33% {
            transform: translate(65%, 0px) translateZ(0);
          }
          66% {
            transform: translate(55%, -32px) translateZ(0);
          }
        }
      `}</style>
    </button>
  );
};

export default AnimatedButton;

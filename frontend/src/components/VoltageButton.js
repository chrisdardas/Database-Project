import React from 'react';
import '../styles/Main.css';

const VoltageButton = ({ onClick, className, children }) => {
    return (
        <div className="voltage-button">
            <button onClick={onClick} className={className}>
                {children}
            </button>
            <svg 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg" 
                x="0px" 
                y="0px" 
                viewBox="0 0 234.6 61.3" 
                preserveAspectRatio="none" 
                xmlSpace="preserve"
                className="voltage-svg"
            >
                <filter id="glow">
                    <feGaussianBlur className="blur" result="coloredBlur" stdDeviation="2" />
                    <feTurbulence 
                        type="fractalNoise" 
                        baseFrequency="0.075" 
                        numOctaves="0.3" 
                        result="turbulence" 
                    />
                    <feDisplacementMap 
                        in="SourceGraphic" 
                        in2="turbulence" 
                        scale="30" 
                        xChannelSelector="R" 
                        yChannelSelector="G" 
                        result="displace" 
                    />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="displace" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <path 
                    className="voltage line-1" 
                    d="..." 
                    fill="transparent" 
                    stroke="#fff" 
                />
                <path 
                    className="voltage line-2" 
                    d="..." 
                    fill="transparent" 
                    stroke="#fff" 
                />
            </svg>
            <div className="dots">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <div className="dot dot-4"></div>
                <div className="dot dot-5"></div>
            </div>
        </div>
    );
};

export default VoltageButton;
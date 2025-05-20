import React from 'react';

interface HistoricalShipProps {
  year: number;
  style?: React.CSSProperties;
}

const HistoricalShip: React.FC<HistoricalShipProps> = ({ year, style }) => {
  // Different ship styles based on the historical period
  let shipSvg;
  
  if (year < 1850) {
    // Sailing ship for early 1800s
    shipSvg = (
      <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path fill="#7e5f46" d="M256,64 L320,128 L320,256 L192,256 L192,128 Z" />
        <path fill="#e0c19e" d="M192,128 L160,128 L160,300 L352,300 L352,128 L320,128 L320,256 L192,256 Z" />
        <path fill="#5d8aa8" d="M120,300 L392,300 L392,330 L120,330 Z" />
        <path fill="#fff" d="M256,130 A50,80 0 0 1 256,250 A50,80 0 0 1 256,130 Z" />
        <path fill="#333" d="M247,160 L265,160 L265,285 L247,285 Z" />
      </svg>
    );
  } else if (1850 < year && year < 1900) {
    // Steam ship for industrial revolution
    shipSvg = (
      <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path fill="#333" d="M120,270 L392,270 L392,320 L120,320 Z" />
        <path fill="#444" d="M200,200 L312,200 L312,270 L200,270 Z" />
        <path fill="#555" d="M240,150 L272,150 L272,200 L240,200 Z" />
        <path fill="#666" d="M235,110 L277,110 L277,150 L235,150 Z" />
        <circle cx="256" cy="190" r="15" fill="#777" />
        <path fill="#777" d="M246,190 L246,170 A10,10 0 0 1 266,170 L266,190 Z" />
        <path fill="#5d8aa8" d="M120,320 L392,320 L392,340 L120,340 Z" />
      </svg>
    );
  } else {
    // Modern ship for 20th century
    shipSvg = (
      <svg viewBox="0 0 512 512" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path fill="#444" d="M150,250 L362,250 L362,320 L150,320 Z" />
        <path fill="#555" d="M180,200 L332,200 L332,250 L180,250 Z" />
        <path fill="#666" d="M200,150 L312,150 L312,200 L200,200 Z" />
        <path fill="#777" d="M220,100 L292,100 L292,150 L220,150 Z" />
        <rect x="230" y="70" width="15" height="30" fill="#888" />
        <rect x="267" y="70" width="15" height="30" fill="#888" />
        <path fill="#5d8aa8" d="M120,320 L392,320 L392,340 L120,340 Z" />
      </svg>
    );
  }

  return (
    <div 
      className="historical-ship"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style
      }}
    >
      <div className="w-2/3 h-2/3">
        {shipSvg}
      </div>
    </div>
  );
};

export default HistoricalShip;
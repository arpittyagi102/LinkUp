import React, { useState } from 'react';
import './Button.css';

const Button = () => {
  const [rippleStyle, setRippleStyle] = useState(null);

  const handleClick = (e) => {
    const button = e.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const rippleX = e.clientX - buttonRect.left;
    const rippleY = e.clientY - buttonRect.top;
  
    setRippleStyle({
      top: rippleY + 'px',
      left: rippleX + 'px',
      width: 0,
      height: 0,
    });
  
    setTimeout(() => {
      setRippleStyle(null);
    }, 600);
  };
  

  return (
    <button className="ripple-btn" onClick={handleClick}>
      Click Me
      {rippleStyle && <span className="ripple" style={rippleStyle}></span>}
    </button>
  );
};

export default Button;

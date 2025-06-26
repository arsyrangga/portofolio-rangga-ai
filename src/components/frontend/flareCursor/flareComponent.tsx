"use client";

import React, { useState, useEffect } from "react";

const FlareCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [isPointer, setIsPointer] = useState(false);
  const [shadow, setShadow] = useState(false)

  const handleMouseMove = (e: any) => {
    setShadow(true)
    setPosition({ x: e.clientX, y: e.clientY });

    const target = e.target;

    setTimeout(() => {
        setShadow(false)
    }, 200);

    setIsPointer(
      window.getComputedStyle(target).getPropertyValue("cursor") === "pointer"
    );
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);


    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const flareSize = isPointer ? 0 : 20;

  const cursorStyle = isPointer ? { left: "-100px", top: "-100px" } : {};

  
  return (
    <div
      className={`flare ${isPointer ? "pointer" : ""}`}
      style={{
        ...cursorStyle,
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${flareSize}px`,
        height: `${flareSize}px`,
        boxShadow:  shadow ? "0px 1px 7px #00D1FF" : "none"

      }}
    ></div>
  );
};

export default FlareCursor;
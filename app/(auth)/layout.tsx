"use client";

import Image from "next/image";
import React, { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const targetElement = document.getElementById("autoTypeText");

    if (targetElement) {
      const textToType = "Sign Up or Sign In to start your journey with:";
      const typingSpeed = 50; // Adjust the typing speed as needed

      autoType(targetElement, textToType, typingSpeed);
    }
  }, []);

  function autoType(element: HTMLElement, text: string, speed: number) {
    let index = 0;

    function type() {
      if (index < text.length) {
        element.textContent = text.substring(0, index + 1); // Clear and update content
        index++;
        setTimeout(type, speed);
      }
    }

    type();
  }

  return (
    <div className="flex flex-col lg:h-full lg:flex-row">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-full lg:w-[50%] h-[700px] lg:h-full">
        <Image width="120" height="120" src="/Icon.png" alt="Logo" />
        <p
          id="autoTypeText"
          className="text-white text-[30px] font-bold lg:flex lg:items-center lg:justify-center md:items-center md:justify-center mt-[150px] ml-2"
        ></p>
        <h1 className="text-[60px] font-bold underline flex items-center justify-center lg:mt-[260px] mt-[150px]">
          MirroMind
        </h1>
      </div>
      <div className="flex justify-center items-center w-full lg:w-[50%] p-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

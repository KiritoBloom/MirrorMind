"use client";

import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between items-center shadow-lg rounded-b-lg">
        <div className="flex items-center">
          <Image
            width={50}
            height={50}
            src="/Icon.png"
            alt="Logo"
            className="mr-2 rounded-full"
          />
          <span className="text-2xl font-bold">MirrorMind</span>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex flex-1 flex-col lg:flex-row p-4 lg:p-8">
        <section className="flex-1 bg-gradient-to-br from-gray-700 to-black text-white p-8 lg:p-16 rounded-lg shadow-lg flex flex-col justify-center items-start mb-4 lg:mb-0 lg:mr-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to MirrorMind</h1>
          <p className="text-xl mb-8">
            Join MirrorMind today! Sign up or log in to get started.
          </p>
        </section>
        <section className="flex-1 bg-white p-8 lg:p-16 rounded-lg shadow-lg flex justify-center items-center">
          {children}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white p-4 text-center rounded-t-lg shadow-lg">
        <p>&copy; 2024 MirrorMind. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;

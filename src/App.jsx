import React from 'react';
import CharacterGenerator from './components/CharacterGenerator';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <CharacterGenerator />
      <footer className="text-center p-4">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          Made on ZAPT
        </a>
      </footer>
    </div>
  );
}
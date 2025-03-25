import React from 'react';
import { FileText } from 'lucide-react';
import { Letter } from '../types/google';

interface LetterListProps {
  letters: Letter[];
  onLetterSelect: (letter: Letter) => void;
}

export function LetterList({ letters, onLetterSelect }: LetterListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Letters</h2>
      <div className="space-y-2">
        {letters.map((letter) => (
          <button
            key={letter.id}
            onClick={() => onLetterSelect(letter)}
            className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3"
          >
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-medium">{letter.title}</h3>
              <p className="text-sm text-gray-500">
                Last modified: {new Date(letter.lastModified).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

 
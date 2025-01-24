import React, { useState } from 'react';
import { Button } from "@/components/ui/button"

interface CharacterUploadProps {
  onCharacterUpload: (character: any) => void;
}

const CharacterUpload: React.FC<CharacterUploadProps> = ({ onCharacterUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      try {
        const content = await file.text();
        const character = JSON.parse(content);
        onCharacterUpload(character);
      } catch (error) {
        console.error('Error parsing character file:', error);
        alert('Error parsing character file. Please ensure it\'s a valid JSON.');
      }
    }
  };

  return (
    <div className="mb-4 p-4 border border-green-500">
      <h2 className="text-xl mb-2">Upload UNC Character File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".json"
        className="mb-2 text-green-500"
        aria-label="Select character file"
      />
      <Button 
        onClick={handleUpload} 
        disabled={!file}
        className="bg-green-700 text-white hover:bg-green-600"
      >
        Upload Character
      </Button>
    </div>
  );
};

export default CharacterUpload;


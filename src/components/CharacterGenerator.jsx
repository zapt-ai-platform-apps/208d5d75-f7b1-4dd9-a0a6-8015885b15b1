import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { createEvent } from '../supabaseClient';
import Model from './Model';

export default function CharacterGenerator() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);
  const [models, setModels] = useState([]);

  const handleGenerate = async () => {
    if (!description) return;
    setLoading(true);
    try {
      // Use createEvent to send a request to generate a 3D model
      const result = await createEvent('generate_3d_model', {
        description,
      });
      // Assume result.modelUrl contains the URL to the generated 3D model
      setModelUrl(result.modelUrl);
      setModels((prevModels) => [...prevModels, { description, modelUrl: result.modelUrl }]);
      setDescription('');
    } catch (error) {
      console.error('Error generating model:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!modelUrl) return;
    // Download the model
    window.open(modelUrl, '_blank');
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">3D Character Generator</h1>
      <textarea
        className="w-full p-2 border box-border rounded mb-4"
        rows="4"
        placeholder="Describe your character..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Character'}
      </button>

      {modelUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Generated Character</h2>
          <div className="w-full h-64 bg-gray-200">
            <Canvas>
              <Suspense fallback={null}>
                <Model url={modelUrl} />
                <OrbitControls />
              </Suspense>
            </Canvas>
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
            onClick={handleDownload}
          >
            Download Character
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded mt-4 ml-2 cursor-pointer"
            onClick={() => {
              // Handle adding animations
              alert('This feature is coming soon!');
            }}
          >
            Add Animations
          </button>
        </div>
      )}

      {models.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Previous Characters</h2>
          <ul className="space-y-2">
            {models.map((model, index) => (
              <li key={index} className="border p-2 rounded">
                <p>{model.description}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2 cursor-pointer"
                  onClick={() => setModelUrl(model.modelUrl)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
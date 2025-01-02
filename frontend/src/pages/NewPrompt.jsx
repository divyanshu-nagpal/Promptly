import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewPrompt() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [aiModel, setAiModel] = useState('');
  const [image, setImage] = useState(null); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);  // Handle image file input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


     const promptData = new FormData();
    promptData.append('title', title);
    promptData.append('tags', tags.split(',').map((tag) => tag.trim()));
    promptData.append('input', input);
    promptData.append('output', output);
    promptData.append('aiModel', aiModel);
    if (image) {
      promptData.append('image', image);  // Append image file
    }

    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      setError('Invalid authentication token. Please login again.');
      navigate('/login');
      return;
    }

    try {
      // const response = await axios.post('api/auth/prompts', promptData, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      const response = await axios.post('api/auth/prompts', promptData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
        },
      });

      setSuccess('Prompt submitted successfully');
      setError('');
      navigate('/');
    } catch (error) {
      setError('Error submitting prompt');
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">Create a New Prompt</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        {/* Input */}
        <div className="mb-4">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700">
            Input
          </label>
          <input
            type="text"
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        {/* Output */}
        <div className="mb-4">
          <label htmlFor="output" className="block text-sm font-medium text-gray-700">
            Output
          </label>
          <input
            type="text"
            id="output"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image (optional)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        {/* Tags */}
        <div className="mb-4">
           <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
             Tags (comma-separated)
           </label>
           <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        {/* AI Model */}
        <div className="mb-4">
          <label htmlFor="aiModel" className="block text-sm font-medium text-gray-700">
            AI Model
          </label>
          <select
            id="aiModel"
            value={aiModel}
            onChange={(e) => setAiModel(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="" disabled>Select an AI Model</option>
            <option value="GPT-4">GPT-4</option>
            <option value="DALL-E">DALL-E</option>
            <option value="Stable Diffusion">Stable Diffusion</option>
          </select>
        </div>
        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewPrompt;

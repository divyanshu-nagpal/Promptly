import { useState } from 'react';
import axios from 'axios';

export default function PromptForm() {
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // only if you're using a <form>
    try {
      const response = await axios.post('/api/prompt', {
        title,
        input
      });
      console.log("Saved:", response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Prompt Text" />
      <button type="submit">Save Prompt</button>
    </form>
  );
}
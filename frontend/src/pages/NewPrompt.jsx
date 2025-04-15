import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
 FileImage, 
 Tags, 
 Terminal, 
 ArrowRight, 
 AlertCircle, 
 Layout, 
 Send,
 MonitorSmartphone,
 BookOpen,
 PlusCircle,
 X,
 CheckCircle2
} from 'lucide-react';

function NewPrompt() {
 const [title, setTitle] = useState('');
 const [tags, setTags] = useState([]);
 const [tagInput, setTagInput] = useState('');
 const [input, setInput] = useState('');
 const [output, setOutput] = useState('');
 const [aiModel, setAiModel] = useState('');
 const [image, setImage] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);
 const [error, setError] = useState('');
 const [success, setSuccess] = useState('');
 const [loading, setLoading] = useState(false);
 const [step, setStep] = useState(1);
 const navigate = useNavigate();

 const handleImageChange = (e) => {
 const file = e.target.files[0];
 if (file) {
 setImage(file);
 const reader = new FileReader();
 reader.onloadend = () => {
 setImagePreview(reader.result);
 };
 reader.readAsDataURL(file);
 }
 };

 const removeImage = () => {
 setImage(null);
 setImagePreview(null);
 };

 const addTag = () => {
 if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
 setTags([...tags, tagInput.trim()]);
 setTagInput('');
 }
 };

 const removeTag = (tagToRemove) => {
 setTags(tags.filter((tag) => tag !== tagToRemove));
 };

 const handleTagKeyDown = (e) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 addTag();
 }
 if (e.key === ',' || e.key === ' ') {
 e.preventDefault();
 addTag();
 }
 };

 const nextStep = () => {
 if (step === 1 && title.trim() === '') {
 setError('Please enter a title before proceeding');
 return;
 }
 if (step === 2 && input.trim() === '') {
 setError('Please enter prompt input before proceeding');
 return;
 }
 if (step === 3 && output.trim() === '') {
 setError('Please enter expected output before proceeding');
 return;
 }
 setError('');
 setStep(step + 1);
 };

 const prevStep = () => {
 setError('');
 setStep(step - 1);
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setError('');

 // Create FormData object
 const promptData = new FormData();
 promptData.append('title', title);
 
 // Fix for tags: Instead of sending as JSON string, send as comma-separated string
 // This will prevent the tags from appearing with quotes and in array format on the community page
 promptData.append('tags', tags.join(','));
 
 promptData.append('input', input);
 promptData.append('output', output);
 promptData.append('aiModel', aiModel);
 if (image) {
 promptData.append('image', image);
 }

 const token = localStorage.getItem('token');
 if (!token || token === 'undefined' || token === 'null') {
 setError('Invalid authentication token. Please login again.');
 setLoading(false);
 navigate('/login');
 return;
 }

 try {
 const response = await axios.post('api/auth/prompts', promptData, {
 headers: { 
 Authorization: `Bearer ${token}`,
 'Content-Type': 'multipart/form-data',
 },
 });

 setSuccess('Prompt submitted successfully');
 setError('');
 setTimeout(() => {
 navigate('/');
 }, 2000);
 } catch (error) {
 setError('Error submitting prompt');
 setSuccess('');
 } finally {
 setLoading(false);
 }
 };

 const renderStepIndicator = () => {
 return (
 <div className="flex justify-center mb-8">
 <div className="flex items-center space-x-4">
 {[1, 2, 3, 4, 5].map((stepNum) => (
 <React.Fragment key={stepNum}>
 <div 
 className={`rounded-full flex items-center justify-center w-10 h-10 ${
 step === stepNum 
 ? 'bg-blue-600 text-white border-2 border-blue-400' 
 : step > stepNum 
 ? 'bg-green-600 text-white' 
 : 'bg-gray-800 text-gray-400 border border-gray-700'
 } transition-all duration-300`}
 >
 {step > stepNum ? (
 <CheckCircle2 className="h-5 w-5" />
 ) : (
 stepNum
 )}
 </div>
 {stepNum < 5 && (
 <div className={`h-1 w-10 ${step > stepNum ? 'bg-green-600' : 'bg-gray-700'}`}></div>
 )}
 </React.Fragment>
 ))}
 </div>
 </div>
 );
 };

 const renderStepTitle = () => {
 const titles = [
 "Name Your Prompt",
 "Define Input",
 "Define Output",
 "Customize",
 "Review & Submit"
 ];
 
 const icons = [
 <Layout key="layout" className="h-6 w-6 mr-2" />,
 <Terminal key="terminal" className="h-6 w-6 mr-2" />,
 <ArrowRight key="arrow" className="h-6 w-6 mr-2" />,
 <MonitorSmartphone key="monitor" className="h-6 w-6 mr-2" />,
 <Send key="send" className="h-6 w-6 mr-2" />
 ];
 
 return (
 <div className="text-center mb-6">
 <h3 className="text-xl font-medium text-white flex items-center justify-center">
 {icons[step-1]}
 {titles[step-1]}
 </h3>
 <div className="mt-2 text-gray-400 text-sm max-w-md mx-auto">
 {step === 1 && "Choose a descriptive title that clearly explains what your prompt does."}
 {step === 2 && "Enter the exact prompt text that users should copy into their AI tool."}
 {step === 3 && "Add an example of what the AI typically outputs with this prompt."}
 {step === 4 && "Select AI model and add tags to help others find your prompt."}
 {step === 5 && "Review all details before submitting your prompt to the community."}
 </div>
 </div>
 );
 };

 const renderStepContent = () => {
 switch (step) {
 case 1:
 return (
 <div className="animate-fade-in">
 <div className="mb-6">
 <label className="block text-sm font-medium text-gray-300 mb-2">Prompt Title</label>
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 className="block w-full px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-500"
 placeholder="Give your prompt a clear, descriptive title"
 autoFocus
 />
 </div>
 <div className="bg-gray-800/50 rounded-lg p-4 text-gray-300 text-sm">
 <p className="flex items-start mb-2">
 <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-blue-400" />
 <span>A good prompt title should:</span>
 </p>
 <ul className="list-disc ml-10 space-y-1">
 <li>Clearly describe what the prompt does</li>
 <li>Be specific enough to stand out</li>
 <li>Help users quickly understand its purpose</li>
 <li>Be between 5-10 words for optimal visibility</li>
 </ul>
 </div>
 </div>
 );
 
 case 2:
 return (
 <div className="animate-fade-in">
 <div className="mb-6">
 <label className="block text-sm font-medium text-gray-300 mb-2">Prompt Input</label>
 <textarea
 value={input}
 onChange={(e) => setInput(e.target.value)}
 rows={6}
 className="block w-full px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-500"
 placeholder="Enter the exact prompt text that should be used..."
 autoFocus
 />
 </div>
 <div className="bg-gray-800/50 rounded-lg p-4 text-gray-300 text-sm">
 <p className="flex items-start mb-2">
 <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-blue-400" />
 <span>Tips for effective prompts:</span>
 </p>
 <ul className="list-disc ml-10 space-y-1">
 <li>Be specific about what you want the AI to do</li>
 <li>Include context and formatting instructions</li>
 <li>Break complex requests into steps</li>
 <li>Use clear, concise language</li>
 </ul>
 </div>
 </div>
 );
 
 case 3:
 return (
 <div className="animate-fade-in">
 <div className="mb-6">
 <label className="block text-sm font-medium text-gray-300 mb-2">Expected Output</label>
 <textarea
 value={output}
 onChange={(e) => setOutput(e.target.value)}
 rows={6}
 className="block w-full px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-500"
 placeholder="Provide an example of the expected output from this prompt..."
 autoFocus
 />
 </div>
 <div className="bg-gray-800/50 rounded-lg p-4 text-gray-300 text-sm">
 <p className="flex items-start mb-2">
 <BookOpen className="h-5 w-5 mr-2 mt-0.5 text-blue-400" />
 <span>Why output examples matter:</span>
 </p>
 <ul className="list-disc ml-10 space-y-1">
 <li>Shows others what to expect from the prompt</li>
 <li>Helps users understand if this prompt suits their needs</li>
 <li>Demonstrates the prompt's effectiveness</li>
 <li>Provides context for how the prompt should be used</li>
 </ul>
 </div>
 </div>
 );
 
 case 4:
 return (
 <div className="animate-fade-in">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">AI Model</label>
 <select
 value={aiModel}
 onChange={(e) => setAiModel(e.target.value)}
 className="block w-full px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
 autoFocus
 >
 <option value="" disabled>Select an AI Model</option>
 <option value="GPT-4">GPT-4</option>
 <option value="GPT-3.5">GPT-3.5</option>
 <option value="Claude">Claude</option>
 <option value="DALL-E">DALL-E</option>
 <option value="Stable Diffusion">Stable Diffusion</option>
 <option value="Midjourney">Midjourney</option>
 <option value="Gemini">Gemini</option>
 <option value="Other">Other</option>
 </select>
 </div>
 
 <div>
 <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
 <div className="flex items-center">
 <input
 type="text"
 value={tagInput}
 onChange={(e) => setTagInput(e.target.value)}
 onKeyDown={handleTagKeyDown}
 className="flex-grow px-4 py-4 bg-gray-800 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-500"
 placeholder="Add tags (press Enter or comma to add)"
 />
 <button
 type="button"
 onClick={addTag}
 className="ml-2 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
 >
 <PlusCircle className="h-5 w-5" />
 </button>
 </div>
 </div>
 </div>
 
 {/* Tags display */}
 <div className="mt-4">
 <div className="flex flex-wrap gap-2 mt-2">
 {tags.map((tag, index) => (
 <div key={index} className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-900/50 text-blue-300 text-sm border border-blue-800/50">
 <span>{tag}</span>
 <button 
 type="button" 
 onClick={() => removeTag(tag)}
 className="ml-1.5 hover:text-blue-100"
 >
 <X className="h-3.5 w-3.5" />
 </button>
 </div>
 ))}
 {tags.length === 0 && (
 <span className="text-gray-500 text-sm italic">No tags added yet</span>
 )}
 </div>
 </div>
 
 {/* Image upload */}
 <div className="mt-6">
 <label className="block text-sm font-medium text-gray-300 mb-2">Image (optional)</label>
 {!imagePreview ? (
 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-gray-500 transition-colors cursor-pointer bg-gray-800/50" onClick={() => document.getElementById('file-upload').click()}>
 <div className="space-y-2 text-center">
 <FileImage className="mx-auto h-12 w-12 text-gray-400" />
 <div className="flex text-sm text-gray-400">
 <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300">
 <span>Upload an image</span>
 <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
 </label>
 <p className="pl-1">or drag and drop</p>
 </div>
 <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
 </div>
 </div>
 ) : (
 <div className="relative rounded-lg overflow-hidden mt-2">
 <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
 <button
 type="button"
 onClick={removeImage}
 className="absolute top-2 right-2 bg-red-600 hover:bg-red-500 p-1.5 rounded-full text-white transition-colors"
 >
 <X className="h-4 w-4" />
 </button>
 </div>
 )}
 </div>
 </div>
 );
 
 case 5:
 return (
 <div className="animate-fade-in">
 <div className="bg-gray-800/40 rounded-lg p-6 mb-6 border border-gray-700">
 <h4 className="text-xl font-medium text-white mb-4">Review Your Prompt</h4>
 
 <div className="space-y-4">
 <div className="grid grid-cols-3 gap-4">
 <div className="col-span-1 text-gray-400">Title:</div>
 <div className="col-span-2 text-white font-medium">{title}</div>
 </div>
 
 <div className="grid grid-cols-3 gap-4">
 <div className="col-span-1 text-gray-400">AI Model:</div>
 <div className="col-span-2 text-white">{aiModel || "Not selected"}</div>
 </div>
 
 <div className="grid grid-cols-3 gap-4">
 <div className="col-span-1 text-gray-400">Tags:</div>
 <div className="col-span-2">
 <div className="flex flex-wrap gap-1.5">
 {tags.length > 0 ? tags.map((tag, index) => (
 <span key={index} className="inline-flex items-center px-2 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs">
 {tag}
 </span>
 )) : <span className="text-gray-500 italic">No tags</span>}
 </div>
 </div>
 </div>
 
 <div>
 <div className="text-gray-400 mb-1">Input Prompt:</div>
 <div className="bg-gray-900 p-3 rounded text-white text-sm overflow-auto max-h-32">
 {input}
 </div>
 </div>
 
 <div>
 <div className="text-gray-400 mb-1">Expected Output:</div>
 <div className="bg-gray-900 p-3 rounded text-white text-sm overflow-auto max-h-32">
 {output}
 </div>
 </div>
 
 {imagePreview && (
 <div>
 <div className="text-gray-400 mb-1">Image:</div>
 <div className="bg-gray-900 p-2 rounded">
 <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 );
 default:
 return null;
 }
 };

 return (
 <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
 {/* Background elements */}
 <div className="absolute inset-0 bg-gray-950">
 <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(circle_at_30%_20%,#2563eb,transparent_40%)]"></div>
 <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_70%_80%,#8b5cf6,transparent_40%)]"></div>
 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 bg-[radial-gradient(circle_at_50%_50%,#ffffff,transparent_70%)]"></div>
 </div>
 
 {/* Grid pattern overlay */}
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6TTAgMGgzMHYzMEgweiIgZmlsbD0iIzIwMjAyMCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>

 <div className="max-w-5xl mx-auto relative z-10">
 <div className="flex justify-center">
 <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/30 text-blue-400 text-sm mb-6 border border-blue-800/50">
 <span>Create New Prompt</span>
 </div>
 </div>
 <h2 className="text-center text-4xl font-bold text-white mb-2">
 Share Your AI Prompt
 </h2>
 <p className="text-center text-gray-400 mb-8">
 Help others unleash the full potential of AI models with your creative prompts
 </p>

 {renderStepIndicator()}

 <div className="relative group">
 <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
 <div className="relative bg-gray-900 py-8 px-6 md:px-10 shadow-lg rounded-xl border border-gray-800 backdrop-blur-sm">
 {/* Important change: Only use onSubmit handler for the final step - changed from: (step === 5 ? handleSubmit : (e) => e.preventDefault()) */}
 <form onSubmit={(e) => e.preventDefault()}>
 {renderStepTitle()}
 
 {/* Error Message */}
 {error && (
 <div className="rounded-md bg-red-900/30 border border-red-800 p-4 mb-6 animate-fade-in">
 <div className="flex">
 <div className="flex-shrink-0">
 <AlertCircle className="h-5 w-5 text-red-400" />
 </div>
 <div className="ml-3">
 <h3 className="text-sm font-medium text-red-400">{error}</h3>
 </div>
 </div>
 </div>
 )}

 {/* Success Message */}
 {success && (
 <div className="rounded-md bg-green-900/30 border border-green-800 p-4 mb-6 animate-fade-in">
 <div className="flex">
 <div className="flex-shrink-0">
 </div>
 <div className="ml-3">
 <h3 className="text-sm font-medium text-green-400">{success}</h3>
 </div>
 </div>
 </div>
 )}
 
 {renderStepContent()}
 
 <div className="flex justify-between mt-8">
 <button
 type="button"
 onClick={prevStep}
 className={`px-6 py-3 rounded-md text-sm font-medium transition-colors
 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'}`}
 >
 Back
 </button>
 
 {step < 5 ? (
 <button
 type="button"
 onClick={nextStep}
 className="px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-500 transition-colors"
 >
 Continue
 </button>
 ) : (
 // On step 5, use a button that calls handleSubmit directly rather than relying on form submission
 <button
 type="button"
 onClick={handleSubmit}
 disabled={loading}
 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
 >
 {loading ? "Submitting..." : "Submit Prompt"}
 {!loading && <Send className="ml-2 h-4 w-4" />}
 </button>
 )}
 </div>
 </form>
 </div>
 </div>
 </div>

 {/* Custom animation styles */}
 <style jsx global>{`
 .animate-fade-in {
 animation: fadeIn 0.6s ease-out forwards;
 }
 
 @keyframes fadeIn {
 from {
 opacity: 0;
 transform: translateY(10px);
 }
 to {
 opacity: 1;
 transform: translateY(0);
 }
 }
 `}</style>
 </div>
 );
}

export default NewPrompt;
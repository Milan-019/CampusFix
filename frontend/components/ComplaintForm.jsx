import React, { useState, useRef } from 'react';
import { IssueType, IssuePriority } from '../types';
import { Button } from './Button';
import { analyzeComplaint } from '../services/geminiService';
import { Camera, MapPin, Upload, Wand2, X } from 'lucide-react';

export const ComplaintForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState(IssueType.OTHER);
  const [priority, setPriority] = useState(IssuePriority.MEDIUM);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalyze = async () => {
    if (!description && !image) return;
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeComplaint(description, image || undefined);
      setType(result.suggestedType);
      setPriority(result.suggestedPriority);
      setAiAnalysis(result.technicalSummary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      location,
      type,
      priority,
      imageUrl: image || undefined,
      aiAnalysis
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-lg w-full mx-auto border border-slate-200 transform hover:scale-102 transition-all duration-300">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50">
        <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Raise a Complaint</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-red-500 transform hover:scale-110 transition-all duration-200">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-emerald-500" />
            Location
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all hover:border-emerald-300 bg-gradient-to-r from-white to-emerald-50"
            placeholder="e.g. Block A, 1st Floor, Room 204"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all hover:border-teal-300 bg-gradient-to-r from-white to-teal-50"
            placeholder="e.g. Broken Fan"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all hover:border-cyan-300 h-24 resize-none bg-gradient-to-r from-white to-cyan-50"
            placeholder="Describe the problem..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Photo Evidence</label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-rose-50 hover:border-orange-400 text-slate-600 text-sm font-medium transition-all hover:text-orange-700 transform hover:scale-105"
            >
              <Camera className="w-4 h-4 mr-2" />
              Upload Photo
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {image && (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-emerald-300 shadow-md transform hover:scale-110 transition-transform">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-0 right-0 bg-red-500 text-white p-0.5 hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Smart Analyze Button */}
        {(description.length > 5 || image) && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border-2 border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:shadow-md transition-all">
            <div className="text-xs text-indigo-800">
              <span className="font-bold">✨ Gemini AI:</span> Use AI to auto-detect category & priority.
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleAIAnalyze} 
              isLoading={isAnalyzing}
              className="text-xs py-1 h-8 bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-900 hover:from-indigo-300 hover:to-purple-300 w-full sm:w-auto"
            >
              <Wand2 className="w-3 h-3 mr-1.5" />
              Auto-Fill Details
            </Button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none bg-gradient-to-r from-white to-violet-50 hover:border-violet-300 transition-all"
            >
              {Object.values(IssueType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none bg-gradient-to-r from-white to-rose-50 hover:border-rose-300 transition-all"
            >
              {Object.values(IssuePriority).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {aiAnalysis && (
            <div className="text-xs text-slate-700 bg-gradient-to-r from-slate-50 to-blue-50 p-3 rounded border-2 border-blue-200 hover:shadow-md transition-all">
                <strong>🔧 Tech Summary:</strong> {aiAnalysis}
            </div>
        )}

        <div className="pt-2 flex gap-3">
          <Button type="submit" className="w-full flex-1">Submit Complaint</Button>
        </div>
      </form>
    </div>
  );
};
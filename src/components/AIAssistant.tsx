import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Bot, User, Image as ImageIcon, Loader2, SendHorizontal } from 'lucide-react';
import { chatWithAI, ChatMessage, analyzePropertyImage } from '@/lib/ai-service';

interface AIAssistantProps {
  initialMessage?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ initialMessage = "Hello! I'm your real estate AI assistant powered by Gemini 1.5 Pro. How can I help you with your property search today?" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: initialMessage },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (loading) return;
    
    if (!input.trim() && !imageFile) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let responseText = '';
      
      if (imageFile) {
        // Handle image analysis
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64Image = base64data.split(',')[1];
          
          try {
            responseText = await analyzePropertyImage(base64Image);
            
            setMessages(prev => [
              ...prev, 
              { role: 'model', content: responseText }
            ]);
          } catch (error) {
            console.error("Error analyzing image:", error);
            setMessages(prev => [
              ...prev, 
              { role: 'model', content: "I'm sorry, I couldn't analyze that image. Please try again or send a different image." }
            ]);
          } finally {
            setLoading(false);
            setImageFile(null);
            setImagePreview(null);
          }
        };
      } else {
        // Regular text chat
        responseText = await chatWithAI(messages, input);
        
        setMessages(prev => [
          ...prev, 
          { role: 'model', content: responseText }
        ]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in AI response:", error);
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: "I'm sorry, I encountered an error processing your request. Please try again." }
      ]);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image and not too large (e.g., < 10MB)
      if (file.type.startsWith('image/') && file.size < 10 * 1024 * 1024) {
        setImageFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select an image file under 10MB");
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full h-[600px] bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div className="bg-electric p-4 flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-semibold">Real Estate AI Assistant</h2>
          <p className="text-white/80 text-sm">Powered by Gemini 1.5 Pro</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === 'user' 
                  ? 'bg-electric text-white rounded-tr-none' 
                  : 'bg-neutral-100 text-neutral-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {message.role === 'user' ? (
                  <>
                    <span className="font-medium">You</span>
                    <User className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 text-electric" />
                    <span className="font-medium">AI Assistant</span>
                  </>
                )}
              </div>
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] p-4 rounded-2xl bg-neutral-100 text-neutral-800 rounded-tl-none">
              <div className="flex items-center space-x-2 mb-1">
                <Bot className="h-4 w-4 text-electric" />
                <span className="font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-electric" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {imagePreview && (
        <div className="px-4 pb-2">
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Property to analyze" 
              className="h-20 rounded-lg border border-neutral-300" 
            />
            <button 
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-neutral-800 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-end space-x-2">
          <button
            onClick={triggerImageUpload}
            className="p-2 text-neutral-500 hover:text-electric transition-colors rounded-full hover:bg-neutral-100"
            title="Upload property image for analysis"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about properties, neighborhoods, or investment advice..."
              className="w-full border border-neutral-300 rounded-2xl py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-electric focus:border-transparent resize-none overflow-hidden min-h-[56px] max-h-32"
              rows={1}
              style={{ height: Math.min(input.split('\n').length * 24 + 24, 128) }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || (!input.trim() && !imageFile)}
              className={`absolute right-3 bottom-3 p-1.5 rounded-full ${
                loading || (!input.trim() && !imageFile)
                  ? 'bg-neutral-200 text-neutral-400'
                  : 'bg-electric text-white hover:bg-electric-light'
              }`}
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-neutral-500">
            This AI assistant provides information about real estate. For important decisions, consult a licensed professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 
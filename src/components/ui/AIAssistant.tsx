import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Mic, Send, Play, Pause, Bot, User, Copy, ThumbsUp, ThumbsDown, Image, PanelRightOpen, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAI, ChatMessage, analyzePropertyImage } from '@/lib/ai-service';

// Interface for conversation messages
interface Message {
  role: 'assistant' | 'user';
  message: string;
  timestamp: Date;
  attachments?: string[];
  isAudioMessage?: boolean;
  isProcessing?: boolean;
}

// Sample predefined responses
const predefinedResponses = {
  'price': 'Based on current market trends, 2 BHK apartments in OMR range from ₹70L to ₹95L depending on the location, amenities, and developer. The Sholinganallur area tends to be priced higher due to better connectivity.',
  'location': 'The best locations in OMR for 2 BHK apartments are Sholinganallur, Perungudi, and Navalur. Each has different advantages - Sholinganallur offers better connectivity, while Navalur has newer developments with more amenities.',
  'amenities': 'Most premium 2 BHK apartments in OMR come with amenities like swimming pools, gyms, children\'s play areas, and 24/7 security. Some newer developments also include smart home features, coworking spaces, and EV charging points.',
  'investment': 'OMR is one of the best areas for real estate investment in Chennai, with an average annual appreciation of 8-10%. Areas closer to the upcoming metro stations are expected to see higher appreciation in the next 3-5 years.',
  'default': 'I can help you with details about 2 BHK properties in OMR including prices, locations, amenities, and investment potential. What specific information are you looking for?'
};

// Suggested questions
const suggestedQuestions = [
  "What's the average price of 2 BHK in Sholinganallur?",
  "Which areas in OMR have the best connectivity?",
  "How is the appreciation potential in Navalur?",
  "What are the premium amenities to look for?",
  "Compare Sholinganallur vs Navalur for a 2 BHK"
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailView, setIsDetailView] = useState(false);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const assistantRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // For tracking chat history in Gemini format
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', content: 'Hello! I\'m your AI real estate assistant powered by Gemini 1.5 Pro. How can I help you with finding the perfect property today?' },
  ]);
  
  // Example conversation history
  const [conversation, setConversation] = useState<Message[]>([
    { 
      role: 'assistant', 
      message: 'Hello! I\'m your AI real estate assistant powered by Gemini 1.5 Pro. How can I help you with finding the perfect property today?', 
      timestamp: new Date() 
    },
  ]);
  
  const toggleAssistant = () => {
    setIsOpen(!isOpen);
    setIsAnimating(true);
  };
  
  const handleSend = async () => {
    if (message.trim() === '' && !imageFile) return;
    
    // Add user message to conversation
    const newConversation: Message[] = [
      ...conversation,
      { role: 'user', message, timestamp: new Date() }
    ];
    
    setConversation(newConversation);
    setMessage('');
    
    // Add a "typing" indicator for the AI
    setConversation([
      ...newConversation,
      { role: 'assistant', message: '', timestamp: new Date(), isProcessing: true }
    ]);
    
    try {
      // Simulate some delay for typing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now use a hardcoded response until the API is fixed
      const fakeResponse = "I'd be happy to help with your real estate search! Currently in OMR area, 2 and 3 BHK apartments range from ₹75L to ₹1.2Cr depending on the location and amenities. Popular areas include Thoraipakkam, Navalur, and Siruseri. Would you like me to suggest some properties based on your budget or preferred location?";
      
      setConversation(prev => {
        const newConv = [...prev];
        // Replace the processing message with the actual response
        newConv[newConv.length - 1] = { 
          role: 'assistant', 
          message: fakeResponse, 
          timestamp: new Date()
        };
        return newConv;
      });
    } catch (error) {
      console.error("Error in conversation:", error);
      
      setConversation(prev => {
        const newConv = [...prev];
        // Replace the processing message with an error
        newConv[newConv.length - 1] = { 
          role: 'assistant', 
          message: "I'm sorry, I encountered an error. Please try again.", 
          timestamp: new Date()
        };
        return newConv;
      });
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    
    // If starting recording, simulate listening
    if (!isRecording) {
      // After "listening", simulate sending a voice message
      setTimeout(() => {
        setIsRecording(false);
        
        // Add user voice message to conversation
        const updatedConversation: Message[] = [
          ...conversation,
          { 
            role: 'user', 
            message: 'Tell me about prices of 2 BHK flats in OMR', 
            timestamp: new Date(),
            isAudioMessage: true
          }
        ];
        setConversation(updatedConversation);
        
        // Simulate AI response after a short delay
        setTimeout(() => {
          setConversation([
            ...updatedConversation,
            { role: 'assistant', message: '', timestamp: new Date(), isProcessing: true }
          ]);
          
          setTimeout(() => {
            setConversation(prevConv => {
              const newConv = [...prevConv];
              // Replace the processing message with the actual response
              newConv[newConv.length - 1] = { 
                role: 'assistant', 
                message: predefinedResponses.price, 
                timestamp: new Date()
              };
              return newConv;
            });
          }, 1500);
        }, 500);
      }, 3000);
    }
  };
  
  const handleSuggestedQuestion = async (question: string) => {
    // Set the message first
    setMessage(question);
    
    // Simulate a button click after a brief delay
    setTimeout(() => {
      handleSend();
    }, 100);
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

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
        // Could show a toast notification here
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  // Sample AI responses based on user input
  const getAIResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('price') || lowerCaseMessage.includes('cost')) {
      return predefinedResponses.price;
    }
    
    if (lowerCaseMessage.includes('location') || lowerCaseMessage.includes('area')) {
      return predefinedResponses.location;
    }
    
    if (lowerCaseMessage.includes('amenities') || lowerCaseMessage.includes('facilities')) {
      return predefinedResponses.amenities;
    }
    
    if (lowerCaseMessage.includes('investment') || lowerCaseMessage.includes('roi')) {
      return predefinedResponses.investment;
    }
    
    return predefinedResponses.default;
  };
  
  // Animation for voice visualization
  useEffect(() => {
    let animationFrame: number;
    
    if (isRecording) {
      const bars = document.querySelectorAll('.voice-bar');
      const animateBars = () => {
        bars.forEach((bar) => {
          const height = Math.random() * 100;
          (bar as HTMLElement).style.height = `${height}%`;
        });
        animationFrame = requestAnimationFrame(animateBars);
      };
      
      animateBars();
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRecording]);
  
  // Auto-scroll conversation to bottom
  useEffect(() => {
    if (autoScroll && messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, autoScroll]);
  
  // Handle click outside to close assistant
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (assistantRef.current && !assistantRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle animation end
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  // Render message with formatting
  const renderMessageContent = (text: string) => {
    // This is a simple implementation. For a more robust solution, you'd use a markdown parser
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Add event listeners to the AIAssistant component
  useEffect(() => {
    // Event handler for opening the AI Assistant
    const handleOpenAIAssistant = (event: CustomEvent) => {
      setIsOpen(true);
      if (event.detail?.initialMessage) {
        // Add user message to conversation
        const newConversation: Message[] = [
          ...conversation,
          { role: 'user', message: event.detail.initialMessage, timestamp: new Date() }
        ];
        
        setConversation(newConversation);
        
        // Add a "typing" indicator for the AI
        setTimeout(() => {
          setConversation([
            ...newConversation,
            { role: 'assistant', message: '', timestamp: new Date(), isProcessing: true }
          ]);
          
          // Simulate AI response
          setTimeout(() => {
            // Generate a response based on the location mentioned
            let aiResponse = "I'd be happy to help with your real estate search! What specific information would you like to know?";
            
            // Check if the message is about a specific location
            const locationMatch = event.detail.initialMessage.match(/about\s+(.+)$/i);
            if (locationMatch && locationMatch[1]) {
              const location = locationMatch[1];
              aiResponse = `${location} is an excellent neighborhood with great connectivity and amenities. The average property prices range from ₹75L to ₹1.2Cr depending on size and amenities. Would you like to know more about schools, hospitals, or investment potential in this area?`;
            }
            
            setConversation(prev => {
              const newConv = [...prev];
              // Replace the processing message with the actual response
              newConv[newConv.length - 1] = { 
                role: 'assistant', 
                message: aiResponse, 
                timestamp: new Date()
              };
              return newConv;
            });
          }, 1500);
        }, 500);
      }
    };
    
    // Event handler for closing the AI Assistant
    const handleCloseAIAssistant = () => {
      setIsOpen(false);
    };
    
    // Event handler for sending messages to the AI Assistant
    const handleSendToAIAssistant = (event: CustomEvent) => {
      if (event.detail?.message) {
        // Set the message first
        setMessage(event.detail.message);
        
        // Simulate a button click after a brief delay
        setTimeout(() => {
          handleSend();
        }, 100);
      }
    };
    
    // Add event listeners
    window.addEventListener('openAIAssistant', handleOpenAIAssistant as EventListener);
    window.addEventListener('closeAIAssistant', handleCloseAIAssistant as EventListener);
    window.addEventListener('sendToAIAssistant', handleSendToAIAssistant as EventListener);
    
    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('openAIAssistant', handleOpenAIAssistant as EventListener);
      window.removeEventListener('closeAIAssistant', handleCloseAIAssistant as EventListener);
      window.removeEventListener('sendToAIAssistant', handleSendToAIAssistant as EventListener);
    };
  }, [conversation]);

  return (
    <>
      {/* Assistant button */}
      <div 
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ease-spring ${
          isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <button
          onClick={toggleAssistant}
          className="relative bg-electric hover:bg-electric-dark text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg transition-all duration-300 group"
        >
          <div className="absolute inset-0 bg-electric-light rounded-full animate-ping opacity-30 group-hover:opacity-50"></div>
          <MessageSquare className="h-6 w-6" />
        </button>
      </div>
      
      {/* AI Assistant Panel */}
      <div 
        ref={assistantRef}
        className={`fixed bottom-6 right-6 z-50 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ease-spring bg-white
          ${isDetailView ? 'w-[800px] h-[600px]' : 'w-[380px] h-[500px]'}
          ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
          ${isAnimating ? 'animate-scale-up' : ''}
        `}
      >
        {/* Header - fix opacity and color */}
        <div className="bg-electric shadow-md text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Real Estate AI Assistant</h3>
                <p className="text-xs text-white/90">Powered by Gemini 1.5 Pro</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsDetailView(!isDetailView)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                title={isDetailView ? "Compact View" : "Expanded View"}
              >
                <PanelRightOpen className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className={`flex ${isDetailView ? 'h-[calc(600px-64px)]' : 'h-[400px]'}`}>
          {/* Main chat area */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-800">
            {/* Conversation */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none"
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                const isScrolledToBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
                setAutoScroll(isScrolledToBottom);
              }}
            >
              {conversation.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  {item.role === 'assistant' && !item.isProcessing && (
                    <div className="w-8 h-8 rounded-full bg-estate-100 dark:bg-estate-900/30 text-estate-600 dark:text-estate-400 flex items-center justify-center mr-2 flex-shrink-0 self-end mb-1">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div 
                    className={`
                      relative max-w-[80%] rounded-2xl px-4 py-3 
                      ${item.role === 'user' 
                        ? 'bg-estate-500 text-white rounded-tr-none' 
                        : item.isProcessing 
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 animate-pulse' 
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }
                    `}
                  >
                    {item.isProcessing ? (
                      <div className="flex space-x-1 items-center py-1 px-2">
                        <div className="w-2 h-2 rounded-full bg-estate-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-estate-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-estate-400 animate-bounce" style={{ animationDelay: "600ms" }}></div>
                      </div>
                    ) : (
                      <>
                        {item.isAudioMessage && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Play className="h-4 w-4 text-estate-400" />
                            <div className="h-4 flex items-center space-x-0.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div 
                                  key={i}
                                  className={`w-0.5 bg-estate-400 rounded-full ${
                                    item.role === 'user' ? 'bg-white' : ''
                                  }`}
                                  style={{ 
                                    height: `${Math.max(3, Math.min(16, Math.random() * 16))}px`,
                                  }}
                                ></div>
                              ))}
                            </div>
                            <span className="text-xs text-estate-400">(00:12)</span>
                          </div>
                        )}
                        
                        <p className="text-sm whitespace-pre-line">{renderMessageContent(item.message)}</p>
                        
                        {/* Attachments if any */}
                        {item.attachments && item.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {item.attachments.map((attachment, i) => (
                              <img 
                                key={i} 
                                src={attachment} 
                                alt="Attachment" 
                                className="max-w-full rounded-lg border border-slate-200 dark:border-slate-600" 
                              />
                            ))}
                          </div>
                        )}
                        
                        <div 
                          className={`text-xs mt-1 ${
                            item.role === 'user' ? 'text-estate-100' : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase()}
                        </div>
                        
                        {/* Action buttons for assistant messages */}
                        {item.role === 'assistant' && !item.isProcessing && (
                          <div className="absolute top-0 right-0 translate-y-2 translate-x-2 bg-white dark:bg-slate-800 shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-0.5 flex space-x-0.5">
                            <button 
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-estate-500 transition-colors"
                              onClick={() => copyToClipboard(item.message)}
                              title="Copy to clipboard"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-green-500 transition-colors"
                              title="Helpful"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-red-500 transition-colors"
                              title="Not helpful"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {item.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center ml-2 flex-shrink-0 self-end mb-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            
            {/* Suggested questions */}
            {conversation.length < 3 && (
              <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                  Suggested Questions
                </div>
                <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs whitespace-nowrap bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-estate-100 hover:text-estate-700 dark:hover:bg-estate-900/30 dark:hover:text-estate-300 transition-colors"
                      onClick={() => handleSuggestedQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Voice recording UI */}
            {isRecording && (
              <div className="bg-estate-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Listening...</div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={toggleRecording}
                      className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                    >
                      <Pause className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setIsRecording(false)}
                      className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Voice visualization */}
                <div className="mt-3 flex items-end justify-center h-12 space-x-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div 
                      key={i}
                      className="voice-bar bg-white/80 w-1 rounded-full transition-all duration-150"
                      style={{ height: `${Math.random() * 100}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Image preview */}
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
            
            {/* Input area */}
            {!isRecording && (
              <div className="bg-white dark:bg-slate-800 p-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center">
                  <button 
                    className="text-slate-400 hover:text-estate-500 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    onClick={triggerImageUpload}
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div className="flex-1 mx-2 relative">
                    <textarea
                      placeholder="Ask me anything about real estate..."
                      className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg pl-3 pr-10 py-2 resize-none max-h-20 text-sm outline-none focus:ring-2 focus:ring-estate-500/30"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      style={{ minHeight: '40px' }}
                    />
                    <button 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-estate-500 p-1 hover:bg-estate-100 dark:hover:bg-estate-900/20 rounded-full transition-colors"
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleSend}
                    className={`p-2 rounded-full ${
                      message.trim() === '' && !imageFile
                        ? 'text-slate-300 cursor-not-allowed' 
                        : 'text-white bg-estate-500 hover:bg-estate-600'
                    } transition-colors duration-300`}
                    disabled={message.trim() === '' && !imageFile}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Knowledge pane (only in detail view) */}
          {isDetailView && (
            <div className="w-72 border-l border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">About OMR</h3>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2">
                  <p>Old Mahabalipuram Road (OMR) is a major IT corridor in Chennai, Tamil Nadu.</p>
                  <p>It hosts many tech parks and residential developments, making it a prime real estate location.</p>
                  <img 
                    src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHw%3D&w=600&q=80" 
                    alt="OMR Chennai" 
                    className="rounded-lg mt-2"
                  />
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Popular Areas</h3>
                  <div className="space-y-2">
                    {['Sholinganallur', 'Navalur', 'Siruseri', 'Padur', 'Kelambakkam'].map((area, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{area}</span>
                        <div className="h-2 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-estate-500" 
                            style={{ width: `${90 - index * 10}%` }} 
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">Price Trends</h3>
                  <div className="h-36 bg-white dark:bg-slate-800 rounded-lg p-2 flex items-end space-x-1">
                    {[65, 70, 68, 75, 78, 80, 85, 82, 90, 95, 92, 97].map((value, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-estate-500 rounded-t"
                          style={{ height: `${value * 0.7}%` }}
                        ></div>
                        {index % 3 === 0 && (
                          <div className="text-[8px] text-slate-500 mt-1">
                            {`'${21 + Math.floor(index / 3)}`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 text-center">Price trend for 2 BHK in OMR (in Lakhs)</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
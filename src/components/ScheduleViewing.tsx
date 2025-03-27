import React, { useState } from 'react';
import { X, Calendar, Clock, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScheduleViewingProps {
  onClose: () => void;
}

const ScheduleViewing: React.FC<ScheduleViewingProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const generateDates = () => {
    const today = new Date();
    const dates = [];
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const availableDates = generateDates();
  
  const timeSlots = [
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Reset form after successful submission
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 1500);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 overflow-y-auto">
      <div className="min-h-screen py-10 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-electric mr-2" />
              <h2 className="text-xl font-medium text-neutral-900">Schedule Property Viewing</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
          
          {!success ? (
            <div className="p-6">
              <div className="flex items-center justify-center mb-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-500'}`}>1</div>
                <div className={`w-16 h-1 ${step >= 2 ? 'bg-electric' : 'bg-neutral-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-500'}`}>2</div>
                <div className={`w-16 h-1 ${step >= 3 ? 'bg-electric' : 'bg-neutral-200'}`}></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-electric text-white' : 'bg-neutral-200 text-neutral-500'}`}>3</div>
              </div>
              
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Select a Date</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {availableDates.map((availableDate, index) => (
                      <div 
                        key={index}
                        onClick={() => setDate(formatDate(availableDate))}
                        className={`p-4 border rounded-lg text-center cursor-pointer transition-all ${date === formatDate(availableDate) ? 'border-electric bg-electric/5 ring-1 ring-electric' : 'border-neutral-200 hover:border-electric/50'}`}
                      >
                        <div className="text-sm font-medium">{availableDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xl font-semibold my-1">{availableDate.getDate()}</div>
                        <div className="text-sm text-neutral-500">{availableDate.toLocaleDateString('en-US', { month: 'short' })}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!date}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${date ? 'bg-electric text-white hover:bg-electric-dark' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Select a Time</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {timeSlots.map((timeSlot, index) => (
                      <div 
                        key={index}
                        onClick={() => setTime(timeSlot)}
                        className={`p-4 border rounded-lg text-center cursor-pointer transition-all ${time === timeSlot ? 'border-electric bg-electric/5 ring-1 ring-electric' : 'border-neutral-200 hover:border-electric/50'}`}
                      >
                        <Clock className="w-5 h-5 mx-auto mb-2 text-neutral-500" />
                        <div className="text-sm font-medium">{timeSlot}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-lg text-neutral-700 font-medium bg-neutral-100 hover:bg-neutral-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!time}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${time ? 'bg-electric text-white hover:bg-electric-dark' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium text-neutral-900 mb-4">Your Information</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-electric focus:border-electric outline-none transition-all"
                          placeholder="Your name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-electric focus:border-electric outline-none transition-all"
                            placeholder="Your email"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-electric focus:border-electric outline-none transition-all"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Additional Message (Optional)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-electric focus:border-electric outline-none transition-all resize-none"
                          placeholder="Any specific requirements or questions"
                        ></textarea>
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-neutral-900 mb-2">Appointment Details</h4>
                      <div className="flex items-center text-neutral-700 mb-1">
                        <Calendar className="w-4 h-4 mr-2 text-electric" />
                        <span>{date}</span>
                      </div>
                      <div className="flex items-center text-neutral-700">
                        <Clock className="w-4 h-4 mr-2 text-electric" />
                        <span>{time}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3 rounded-lg text-neutral-700 font-medium bg-neutral-100 hover:bg-neutral-200 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !name || !email || !phone}
                        className="px-6 py-3 bg-electric text-white rounded-lg font-medium hover:bg-electric-dark transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed flex items-center"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          'Confirm Appointment'
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-medium text-neutral-900 mb-2">Appointment Scheduled!</h3>
              <p className="text-neutral-600 mb-6">
                Your viewing appointment has been confirmed for <span className="font-medium">{date}</span> at <span className="font-medium">{time}</span>. 
                We've sent a confirmation email to <span className="font-medium">{email}</span>.
              </p>
              <p className="text-neutral-500 text-sm mb-6">
                One of our representatives will contact you shortly to confirm the details.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-electric text-white rounded-lg font-medium hover:bg-electric-dark transition-colors mx-auto"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ScheduleViewing;

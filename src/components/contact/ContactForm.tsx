import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiMessageSquare, FiSend, FiCheck, FiAlertCircle } from 'react-icons/fi';

interface ContactFormProps {
  accentColor: string;
  theme: string;
}

type FormField = {
  value: string;
  error: string | null;
  touched: boolean;
};

type FormState = {
  name: FormField;
  email: FormField;
  message: FormField;
};

const ContactForm: React.FC<ContactFormProps> = ({ accentColor, theme }) => {
  const [formState, setFormState] = useState<FormState>({
    name: { value: '', error: null, touched: false },
    email: { value: '', error: null, touched: false },
    message: { value: '', error: null, touched: false }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Validate email format
  const validateEmail = (email: string): boolean => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  
  // Validate form field
  const validateField = (name: string, value: string): string | null => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : null;
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email address' : null;
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : null;
      default:
        return null;
    }
  };
  
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormState(prev => ({
      ...prev,
      [name]: { 
        ...prev[name as keyof FormState], 
        value, 
        error,
        touched: true
      }
    }));
  };
  
  // Handle input focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocusedField(e.target.name);
  };
  
  // Handle input blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setFormState(prev => ({
      ...prev,
      [name]: { 
        ...prev[name as keyof FormState], 
        error,
        touched: true
      }
    }));
    
    setFocusedField(null);
  };
  
  // Validate all form fields
  const validateForm = (): boolean => {
    let isValid = true;
    const newFormState = { ...formState };
    
    // Validate each field
    (Object.keys(formState) as Array<keyof FormState>).forEach(field => {
      const error = validateField(field, formState[field].value);
      newFormState[field] = {
        ...newFormState[field],
        error,
        touched: true
      };
      
      if (error) isValid = false;
    });
    
    setFormState(newFormState);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate form
    if (!validateForm()) {
      setFormError('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form
      setFormState({
        name: { value: '', error: null, touched: false },
        email: { value: '', error: null, touched: false },
        message: { value: '', error: null, touched: false }
      });
      
      setIsSubmitted(true);
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      setFormError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Input field styles
  const getInputStyle = (field: FormField, fieldName: string) => ({
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: `1px solid ${field.touched && field.error ? 'rgba(239, 68, 68, 0.5)' : 
      focusedField === fieldName ? accentColor : `${accentColor}30`}`,
    boxShadow: field.touched && field.error ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 
      focusedField === fieldName ? `0 0 0 2px ${accentColor}40` : 'none'
  });
  
  return (
    <div className="h-full flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-6 text-center">Send a Message</h3>
      
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            key="success"
          >
            <motion.div 
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${accentColor}20` }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <FiCheck size={32} style={{ color: accentColor }} />
            </motion.div>
            <motion.h4 
              className="text-xl font-semibold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Message Sent!
            </motion.h4>
            <motion.p 
              className="opacity-70"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Thank you for reaching out. I'll get back to you soon.
            </motion.p>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="form"
            className="space-y-5 w-full max-w-md mx-auto"
          >
            {formError && (
              <motion.div 
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="text-red-500" />
                  <span>{formError}</span>
                </div>
              </motion.div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 text-center">Your Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50">
                  <FiUser />
                </div>
                <input 
                  type="text" 
                  name="name"
                  value={formState.name.value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  className="w-full px-10 py-3 rounded-lg focus:outline-none transition-all duration-300 bg-white/10 backdrop-blur-sm text-center"
                  style={{
                    ...getInputStyle(formState.name, 'name'),
                    borderRadius: '8px',
                    border: `1px solid ${accentColor}30`
                  }}
                  placeholder="John Doe"
                />
                <AnimatePresence>
                  {formState.name.touched && formState.name.error && (
                    <motion.div 
                      className="text-red-500 text-xs mt-1 ml-1 text-center"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {formState.name.error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 text-center">Email Address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50">
                  <FiMail />
                </div>
                <input 
                  type="email" 
                  name="email"
                  value={formState.email.value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  className="w-full px-10 py-3 rounded-lg focus:outline-none transition-all duration-300 bg-white/10 backdrop-blur-sm text-center"
                  style={{
                    ...getInputStyle(formState.email, 'email'),
                    borderRadius: '8px',
                    border: `1px solid ${accentColor}30`
                  }}
                  placeholder="your@email.com"
                />
                <AnimatePresence>
                  {formState.email.touched && formState.email.error && (
                    <motion.div 
                      className="text-red-500 text-xs text-center mt-1 ml-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {formState.email.error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80 text-center">Your Message</label>
              <div className="relative">
                <div className="absolute left-3 top-4 opacity-50">
                  <FiMessageSquare />
                </div>
                <textarea 
                  name="message"
                  value={formState.message.value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  rows={5}
                  className="w-full px-10 py-3 rounded-lg focus:outline-none transition-all duration-300 resize-none bg-white/10 backdrop-blur-sm text-center"
                  style={{
                    ...getInputStyle(formState.message, 'message'),
                    borderRadius: '8px',
                    border: `1px solid ${accentColor}30`
                  }}
                  placeholder="Hello, I'd like to discuss a project..."
                />
                <AnimatePresence>
                  {formState.message.touched && formState.message.error && (
                    <motion.div 
                      className="text-red-500 text-xs mt-1 text-center ml-1"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {formState.message.error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <motion.button
              type="submit"
              className="w-full py-3 px-6 rounded-lg font-medium mt-6 flex items-center justify-center gap-2 transition-all duration-300"
              style={{ 
                backgroundColor: accentColor,
                boxShadow: `0 4px 14px ${accentColor}50`,
                borderRadius: '8px'
              }}
              whileHover={{ 
                y: -2,
                boxShadow: `0 6px 20px ${accentColor}70`
              }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactForm;

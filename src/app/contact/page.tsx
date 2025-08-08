"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
             Need a chinese meal? This is where we are and when we open!
            </p>
          </div>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 flex-1">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Location</h3>
              <p className="text-gray-600 mb-1">4 Selby Avenue</p>
              <p className="text-gray-600 mb-4">Leeds, LS9 0HL</p>
              
              <div className="bg-gray-100 rounded-lg h-64 w-full">
                {/* This would be replaced with an actual map in a real application */}
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  Map placeholder
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Opening Hours</h3>
              <div className="space-y-2">
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 1 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 1 ? 'text-red-700' : 'text-gray-700'}`}>Monday</span>
                  <span className="text-gray-600">17:00 - 23:00</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 2 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 2 ? 'text-red-700' : 'text-gray-700'}`}>Tuesday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 3 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 3 ? 'text-red-700' : 'text-gray-700'}`}>Wednesday</span>
                  <span className="text-gray-600">17:00       - 23:00</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 4 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 4 ? 'text-red-700' : 'text-gray-700'}`}>Thursday</span>
                  <span className="text-gray-600">17:00 - 23:00</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 5 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 5 ? 'text-red-700' : 'text-gray-700'}`}>Friday</span>
                  <span className="text-gray-600">17:00 - 23:00</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 6 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 6 ? 'text-red-700' : 'text-gray-700'}`}>Saturday</span>
                  <span className="text-gray-600">17:00 - 23:00</span>
                </div>
                <div className={`flex justify-between items-center p-2 rounded-md ${new Date().getDay() === 0 ? 'bg-red-50 border-l-4 border-red-600' : ''}`}>
                  <span className={`font-medium ${new Date().getDay() === 0 ? 'text-red-700' : 'text-gray-700'}`}>Sunday</span>
                  <span className="text-gray-600">17:00 - 23:00</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Details</h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Phone:</span> 0113 248 3487
              </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

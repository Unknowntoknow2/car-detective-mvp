
import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">Please fill out the form below to get in touch with our team.</p>
      
      <form className="max-w-lg space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Your email"
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea
            id="message"
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Your message"
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary/90 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactPage;


import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface LiveChatCTAProps {
  className?: string;
}

export const LiveChatCTA: React.FC<LiveChatCTAProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      toast.success('Message sent! Our team will get back to you soon.');
      setMessage('');
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg ${
            isOpen ? 'bg-gray-500 hover:bg-gray-600' : 'bg-primary hover:bg-primary/90'
          }`}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96"
          >
            <Card className="shadow-xl border-border">
              <CardHeader className="bg-primary text-white p-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Need help choosing a plan?</h3>
                <p className="text-sm text-white/80">Our team is here to answer your questions</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm font-medium">Hi there! 👋</p>
                    <p className="text-sm mt-1">How can we help you choose the right plan for your dealership?</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <form onSubmit={handleSubmit} className="w-full space-y-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full"
                  />
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

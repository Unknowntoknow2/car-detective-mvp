
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAINStore } from '@/stores/useAINStore';
import AIAssistant from './AIAssistant';

interface AINFloatingChatProps {
  contextualGreeting?: string;
}

export const AINFloatingChat: React.FC<AINFloatingChatProps> = ({
  contextualGreeting
}) => {
  const { isOpen, isMinimized, setOpen, setMinimized } = useAINStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="fixed bottom-24 right-6 z-50 w-96 h-[600px] max-h-[80vh]"
      >
        <Card className="w-full h-full flex flex-col shadow-2xl border-2 border-primary/20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-blue-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm font-bold">AIN</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AIN Assistant</h3>
                <p className="text-xs text-muted-foreground">Auto Intelligence Network</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <AIAssistant className="flex-1" />
            </motion.div>
          )}

          {/* Minimized state */}
          {isMinimized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 text-center"
            >
              <p className="text-sm text-muted-foreground">Chat minimized</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMinimized(false)}
                className="mt-2"
              >
                Restore Chat
              </Button>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AINFloatingChat;

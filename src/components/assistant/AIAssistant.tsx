
import { useState, useRef, useEffect } from 'react'
import { askAIN } from '@/api/askAI'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Loader2, RefreshCw, Send, MessageCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm AIN, your Auto Intelligence Network assistant. Ask me anything about vehicle valuations!",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    }
    
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await askAIN([...messages, userMsg])
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: res.reply,
        timestamp: new Date()
      }])
    } catch (err: any) {
      console.error('AI Assistant error:', err)
      let errorMessage = 'Something went wrong. Please try again.'
      
      // Handle specific error types
      if (err.message?.includes('401')) {
        errorMessage = 'Authentication failed. Please check your API key.'
      } else if (err.message?.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (err.message?.includes('500')) {
        errorMessage = 'Server error. Please try again in a moment.'
      } else if (err.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your connection.'
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const retry = async () => {
    if (loading) return
    
    setLoading(true)
    setError(null)

    try {
      const res = await askAIN(messages)
      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: res.reply,
        timestamp: new Date()
      }])
    } catch (err: any) {
      console.error('Retry error:', err)
      setError(err.message || 'Retry failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[600px] bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-card">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">AIN Assistant</h3>
          <p className="text-xs text-muted-foreground">Auto Intelligence Network</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="max-w-[85%]">
              <div
                className={`rounded-2xl px-4 py-2 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-auto'
                    : 'bg-card border text-card-foreground'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </div>
              </div>
              <div className={`text-xs text-muted-foreground mt-1 px-1 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-card border rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm">AIN is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error display */}
      {error && (
        <div className="px-4 pb-2">
          <Card className="border-destructive bg-destructive/10">
            <div className="p-3 flex items-center justify-between text-sm">
              <span className="text-destructive">{error}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={retry}
                disabled={loading}
                className="text-destructive hover:bg-destructive/20"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t bg-card">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about car values, market trends..."
            disabled={loading}
            className="flex-1 rounded-full border-muted-foreground/20 focus-visible:ring-primary"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            size="icon"
            className="rounded-full shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

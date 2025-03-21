'use client';
import { useState, useRef, useEffect } from 'react';
import { 
  Container, 
  ChatContainer, 
  MessageList, 
  InputArea, 
  InputBox, 
  SendButton,
  Message,
  VideoEmbed,
  LoadingIndicator
} from './styles';

// API base URL - adjust to match your Flask server location
const API_BASE_URL = 'http://localhost:5000/api';

type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  videoUrl?: string;
  jobId?: string;
  solution?: string;
  code?: string;
  status?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [jobPolling, setJobPolling] = useState<{[key: string]: NodeJS.Timeout}>({});

  const generateRandomId = () => Math.random().toString(36).substring(2, 9);

  // Cleanup polling intervals on unmount
  useEffect(() => {
    return () => {
      Object.values(jobPolling).forEach(interval => clearInterval(interval));
    };
  }, [jobPolling]);

  // Poll for job status
  const pollJobStatus = (jobId: string, messageId: string) => {
    // Clear any existing polling for this job
    if (jobPolling[jobId]) {
      clearInterval(jobPolling[jobId]);
    }
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/status/${jobId}`);
        const data = await response.json();
        
        if (data.status === 'failed') {
          clearInterval(jobPolling[jobId]);
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? 
            {...msg, content: `Error generating visualization: ${data.error || 'Unknown error'}`, status: 'failed'} : 
            msg
          ));
          setIsLoading(false);
          
          // Remove from polling object
          setJobPolling(prev => {
            const newPolling = { ...prev };
            delete newPolling[jobId];
            return newPolling;
          });
        } 
        else if (data.status === 'completed') {
          clearInterval(jobPolling[jobId]);
          
          // Fetch solution and code
          const [solutionRes, codeRes] = await Promise.all([
            fetch(`${API_BASE_URL}/solution/${jobId}`),
            fetch(`${API_BASE_URL}/code/${jobId}`)
          ]);
          
          const solutionData = await solutionRes.json();
          const codeData = await codeRes.json();
          
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? 
            {
              ...msg, 
              content: 'Your visualization is ready! Here\'s what I found:',
              videoUrl: `${API_BASE_URL}/video/${jobId}`,
              solution: solutionData.solution,
              code: codeData.manim_code,
              status: 'completed'
            } : 
            msg
          ));
          setIsLoading(false);
          
          // Remove from polling object
          setJobPolling(prev => {
            const newPolling = { ...prev };
            delete newPolling[jobId];
            return newPolling;
          });
        }
        else {
          // Update the status message
          setMessages(prev => prev.map(msg => 
            msg.id === messageId ? 
            {...msg, content: `Generating visualization: ${data.status.replace(/_/g, ' ')}...`, status: data.status} : 
            msg
          ));
        }
      } catch (error) {
        console.error('Error polling job status:', error);
      }
    }, 2000);
    
    // Save the interval ID
    setJobPolling(prev => ({...prev, [jobId]: interval}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: generateRandomId(),
      content: inputValue,
      sender: 'user',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Create initial assistant message
    const assistantMessageId = generateRandomId(); // corrected: now calling the function
    const assistantMessage: MessageType = {
      id: assistantMessageId,
      content: 'Processing your request...',
      sender: 'assistant',
      status: 'processing'
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    try {
      // Send request to backend
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update assistant message with job ID
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? 
          {...msg, jobId: data.job_id, content: 'Generating solution...'} : 
          msg
        ));
        
        // Start polling for job status
        pollJobStatus(data.job_id, assistantMessageId);
      } else {
        // Handle error
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? 
          {...msg, content: `Error: ${data.error || 'Failed to generate visualization'}`} : 
          msg
        ));
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      // Update assistant message with error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId ? 
        {...msg, content: 'Sorry, there was an error processing your request. Please try again.'} : 
        msg
      ));
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Container>
      <ChatContainer>
        <MessageList>
          {messages.map((message) => (
            <Message key={message.id} sender={message.sender}>
              <div className="content">{message.content}</div>
              
              {message.videoUrl && (
                <VideoEmbed>
                  <iframe
                    src={message.videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </VideoEmbed>
              )}
              
              {message.solution && (
                <div className="solution">
                  <h3>Solution Explanation</h3>
                  <pre>{message.solution}</pre>
                </div>
              )}
              
              {message.code && (
                <div className="code">
                  <h3>Visualization Code</h3>
                  <pre>{message.code}</pre>
                </div>
              )}
              
              {message.status === 'processing' && (
                <LoadingIndicator>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </LoadingIndicator>
              )}
            </Message>
          ))}
          
          <div ref={messagesEndRef} />
        </MessageList>
        
        <form onSubmit={handleSubmit}>
          <InputArea>
            <InputBox
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a problem to visualize (e.g., 'binary search algorithm')"
              disabled={isLoading}
            />
            <SendButton 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SendButton>
          </InputArea>
        </form>
      </ChatContainer>
    </Container>
  );
}

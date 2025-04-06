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

  const generateRandomId = () => Math.random().toString(36).substring(2, 9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: MessageType = {
      id: generateRandomId(),
      content: inputValue,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const assistantMessageId = generateRandomId();
    const initialAssistantMsg: MessageType = {
      id: assistantMessageId,
      content: 'Understanding the question...',
      sender: 'assistant',
      status: 'processing'
    };

    setMessages(prev => [...prev, initialAssistantMsg]);

    // Step 1: Understanding the question
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, content: 'Generating Manim code...' }
          : msg
      ));

      // Step 2: Generating Manim code
      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Generating Manim visualization...' }
            : msg
        ));

        // Step 3: Final output
        setTimeout(() => {
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  content: "Your visualization is ready! Here's what I found:",
                  videoUrl: "/videos/linkedlist.mp4",
                  solution: `To reverse a singly linked list:
1. Initialize three pointers: prev (null), current (head), and next (null).
2. Traverse the list, and for each node:
   - Store the next node in 'next'
   - Point current.next to 'prev'
   - Move 'prev' to current
   - Move 'current' to next
3. When current becomes null, 'prev' will point to the new head.`,
                  code: `
from manim import *

class ReverseLinkedList(Scene):
    def construct(self):
        title = Text("Reversing a Linked List").scale(0.8)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))

        nodes = [Circle(radius=0.4, color=BLUE).set_fill(BLUE, opacity=0.5) for _ in range(5)]
        labels = [Text(str(i)) for i in range(1, 6)]

        for i, node in enumerate(nodes):
            node.move_to(LEFT * 4 + RIGHT * i * 2)
            labels[i].move_to(node.get_center())

        arrows = [Arrow(nodes[i].get_right(), nodes[i+1].get_left(), buff=0.1) for i in range(4)]

        self.play(*[FadeIn(node) for node in nodes], *[FadeIn(label) for label in labels])
        self.play(*[GrowArrow(arrow) for arrow in arrows])
        self.wait(1)

        self.play(Write(Text("Reversing...", font_size=36).next_to(nodes[2], DOWN)))
        self.wait(1)
        # Add reversal animation here
                  `,
                  status: 'completed'
                }
              : msg
          ));
          setIsLoading(false);
        }, 5000); // Manim Visualization generation

      }, 5000); // Manim Code generation

    }, 5000); // Understanding the question
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
                  <video controls width="100%">
  <source src={message.videoUrl} type="video/mp4" />
  Your browser does not support the video tag.
</video>

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
              placeholder="Enter a problem to visualize (e.g., 'reverse a linked list')"
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

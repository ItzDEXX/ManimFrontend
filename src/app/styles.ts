// styles.ts - Updated with black color scheme and green buttons

import styled from 'styled-components';

// Color palette
const colors = {
  primary: '#1a5336', // Dark green for buttons
  secondary: '#2d7a4f', // Lighter green for button hover
  dark: '#121212', // Very dark black for backgrounds
  darker: '#0a0a0a', // Even darker black for contrasting elements
  light: '#e6e6e6', // Light color for text on dark backgrounds
  userMessage: '#1e1e1e', // User message background (dark gray)
  assistantMessage: '#0f0f0f', // Assistant message background (very dark gray)
  inputBg: '#1e1e1e', // Input box background
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  background-color: ${colors.dark};
  color: ${colors.light};
  padding: 1rem;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  height: 90vh;
  background-color: ${colors.dark};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.dark};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.primary};
    border-radius: 4px;
  }
`;

export const Message = styled.div<{ sender: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 80%;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${props => props.sender === 'user' ? colors.userMessage : colors.assistantMessage};
  align-self: ${props => props.sender === 'user' ? 'flex-end' : 'flex-start'};
  
  .content {
    color: ${colors.light};
  }
  
  .solution, .code {
    margin-top: 0.5rem;
    background-color: rgba(0, 0, 0, 0.2);
    padding: 0.75rem;
    border-radius: 6px;
    
    h3 {
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: ${colors.light};
    }
    
    pre {
      margin: 0;
      white-space: pre-wrap;
      font-size: 0.85rem;
      overflow-x: auto;
      color: ${colors.light};
    }
  }
`;

export const VideoEmbed = styled.div`
  width: 100%;
  margin: 0.5rem 0;
  
  iframe {
    width: 100%;
    height: 240px;
    border-radius: 6px;
  }
`;

export const InputArea = styled.div`
  display: flex;
  padding: 1rem;
  background-color: ${colors.darker};
  border-top: 1px solid ${colors.darker};
  align-items: center;
  gap: 0.5rem;
`;

export const InputBox = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 24px;
  border: 1px solid #333;
  background-color: ${colors.inputBg};
  color: ${colors.light};
  font-size: 1rem;
  outline: none;
  
  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px rgba(26, 83, 54, 0.2);
  }
  
  &::placeholder {
    color: rgba(230, 230, 230, 0.6);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

// Updated SendButton style to be a beveled square instead of circular

// Updated SendButton style to be a shorter beveled square

export const SendButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 6px; // Slightly reduced for the smaller size
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: ${colors.primary};
  color: ${colors.light};
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  
  // Add beveled effect with box-shadow
  box-shadow: 
    inset 1px 1px 0px rgba(255, 255, 255, 0.2),
    inset -1px -1px 0px rgba(0, 0, 0, 0.2),
    2px 2px 4px rgba(0, 0, 0, 0.3);
  
  &:hover:not(:disabled) {
    background-color: ${colors.secondary};
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 
      inset 1px 1px 0px rgba(255, 255, 255, 0.1),
      inset -1px -1px 0px rgba(0, 0, 0, 0.1),
      1px 1px 2px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px; // Reduced from 20px
    height: 16px; // Reduced from 20px
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  gap: 6px;
  padding: 0.25rem 0;
  align-items: center;
  
  .dot {
    width: 8px;
    height: 8px;
    background-color: ${colors.primary};
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
    
    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
  }
  
  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;
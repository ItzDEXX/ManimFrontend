import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #343541;
  color: #ECECF1;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 768px;
  width: 100%;a
  margin: 0 auto;
  height: 100%;
  padding: 1rem;
`;

export const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 1rem;
  gap: 1.5rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 20px;
  }
`;

export const Message = styled.div<{ sender: 'user' | 'assistant' }>`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 0.5rem;
  max-width: 100%;
  line-height: 1.5;
  gap: 1rem;
  
  background-color: ${props => props.sender === 'user' ? '#343541' : '#444654'};
  
  .content {
    white-space: pre-wrap;
  }
`;

export const VideoEmbed = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  
  iframe {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const InputArea = styled.div`
  display: flex;
  background-color: #40414F;
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-top: auto;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const InputBox = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #ECECF1;
  font-size: 1rem;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  background: transparent;
  border: none;
  color: #ECECF1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #ECECF1;
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
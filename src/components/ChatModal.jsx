import React, { useState, useRef, useEffect } from 'react';
import './CustomerModal.css';

const COMMANDS = [
  'Hello, [name]!',
  'Thank you for your order, [name].',
  'How can I help you today, [name]?',
  'Your order is being processed.',
  'We appreciate your business!'
];

const ChatModal = ({ customer, messages, onSend, onClose }) => {
  const [input, setInput] = useState('');
  const [selectedCommand, setSelectedCommand] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend({ sender: 'Admin', text: input, time: new Date().toLocaleTimeString() });
      setInput('');
      setSelectedCommand('');
    }
  };

  const handleCommandChange = (e) => {
    const cmd = e.target.value;
    setSelectedCommand(cmd);
    if (cmd) {
      setInput(cmd.replace('[name]', customer.name));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ maxWidth: 400 }}>
        <div className="modal-header">
          <h2>Chat with {customer.name}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div style={{ height: 260, overflowY: 'auto', width: '100%', background: '#FDFAF6', borderRadius: 8, padding: 10, marginBottom: 12 }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 8, textAlign: msg.sender === 'Admin' ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', background: msg.sender === 'Admin' ? '#99BC85' : '#E4EFE7', color: msg.sender === 'Admin' ? '#fff' : '#222', borderRadius: 8, padding: '6px 12px', maxWidth: 220 }}>
                <span>{msg.text}</span>
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{msg.time}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
          <select value={selectedCommand} onChange={handleCommandChange} style={{ marginBottom: 6, padding: 6, borderRadius: 6, border: '1px solid #E4EFE7', fontSize: 15 }}>
            <option value="">Quick Command...</option>
            {COMMANDS.map((cmd, idx) => (
              <option key={idx} value={cmd}>{cmd.replace('[name]', customer.name)}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #E4EFE7', fontSize: 15 }}
            />
            <button type="submit" className="save-btn">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal; 
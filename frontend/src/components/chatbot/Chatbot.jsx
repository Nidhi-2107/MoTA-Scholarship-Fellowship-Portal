import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { chatbotApi } from '../../api';

const WELCOME = "Namaste! 🙏 I'm PARAKH Assistant, your AI guide for MoTA scholarship and fellowship queries. How can I help you today?\n\nYou can ask me about eligibility, required documents, application status, deadlines, or any specific scheme.";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: WELCOME }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).slice(2));
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await chatbotApi.query(input, sessionId);
      const data = res.data.data;
      setMessages(m => [...m,
        { id: Date.now() + 1, role: 'bot', text: data.answer },
        ...(data.suggestedActions?.length ? [{
          id: Date.now() + 2, role: 'actions', actions: data.suggestedActions
        }] : [])
      ]);
    } catch {
      setMessages(m => [...m, {
        id: Date.now() + 1, role: 'bot',
        text: 'Sorry, I am unable to respond right now. Please try again or contact helpdesk at 1800-180-6700.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'What documents are needed?',
    'Check my eligibility',
    'National Fellowship details',
    'How to file a grievance?',
  ];

  return (
    <>
      {/* FAB */}
      <button className="chatbot-fab" onClick={() => setOpen(o => !o)} aria-label="Open AI Assistant">
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF6B00, #C9A84C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Bot size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>PARAKH Assistant</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>AI-powered scholarship guide</div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map(msg => {
              if (msg.role === 'actions') return (
                <div key={msg.id} style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {msg.actions.map(a => (
                    <button key={a}
                      onClick={() => { setInput(a); }}
                      style={{
                        background: 'var(--bg-subtle)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-full)', padding: '4px 12px',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        color: 'var(--india-blue)', transition: 'all 150ms'
                      }}>
                      {a}
                    </button>
                  ))}
                </div>
              );
              return (
                <div key={msg.id} className={`chat-msg ${msg.role === 'user' ? 'chat-msg-user' : 'chat-msg-bot'}`}>
                  {msg.text}
                </div>
              );
            })}
            {loading && (
              <div className="chat-msg chat-msg-bot" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2, color: 'var(--text-muted)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Thinking...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 var(--space-4) var(--space-2)', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {quickQuestions.map(q => (
                <button key={q} onClick={() => setInput(q)}
                  style={{
                    background: 'var(--info-bg)', border: '1px solid var(--info)',
                    borderRadius: 'var(--radius-full)', padding: '3px 10px',
                    fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
                    color: 'var(--info)'
                  }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-input" onSubmit={sendMessage}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about scholarships..."
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary btn-icon" disabled={!input.trim() || loading}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

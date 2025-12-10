import React, { useState, useRef, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   Ultra-Modern Chatbot with Apple-inspired UI + Website Knowledge Grounding
   - Pure inline styles (no Tailwind required)
   - Extracts page content and grounds answers strictly in visible text
   - Minimal, glassy, smooth animations
───────────────────────────────────────────────────────────────────────────── */

export default function ModernChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: '👋 Hi! I can answer questions about what\'s on this page. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoverOrb, setHoverOrb] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 300);
    }
  }, [open]);

  /* ── Page Content Extraction ─────────────────────────────────────────────── */
  const extractPageContent = () => {
    const sections = [];
    let currentHeading = 'Page Content';
    let currentText = [];

    const walk = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) currentText.push(text);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = node.tagName.toLowerCase();
        const style = window.getComputedStyle(node);
        
        // Skip hidden elements and the chatbot itself
        if (style.display === 'none' || style.visibility === 'hidden' || 
            node.closest('[data-chatbot]')) return;

        // Check for headings
        if (/^h[1-6]$/.test(tag)) {
          if (currentText.length > 0) {
            sections.push({ heading: currentHeading, content: currentText.join(' ') });
            currentText = [];
          }
          currentHeading = node.textContent.trim() || 'Section';
        }

        // Process children
        node.childNodes.forEach(walk);
      }
    };

    walk(document.body);
    
    if (currentText.length > 0) {
      sections.push({ heading: currentHeading, content: currentText.join(' ') });
    }

    return sections;
  };

  /* ── Text Normalization ──────────────────────────────────────────────────── */
  const normalize = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  /* ── Keyword Extraction ──────────────────────────────────────────────────── */
  const extractKeywords = (question) => {
    const stopWords = new Set([
      'what', 'where', 'when', 'how', 'why', 'who', 'which', 'is', 'are', 'was', 'were',
      'do', 'does', 'did', 'can', 'could', 'would', 'should', 'will', 'the', 'a', 'an',
      'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'this', 'that', 'these',
      'those', 'it', 'its', 'be', 'been', 'being', 'have', 'has', 'had', 'about', 'me',
      'tell', 'show', 'find', 'get', 'give', 'please', 'i', 'you', 'we', 'they', 'my'
    ]);

    return normalize(question)
      .split(' ')
      .filter(word => word.length > 2 && !stopWords.has(word));
  };

  /* ── Sentence Scoring ────────────────────────────────────────────────────── */
  const scoreSentence = (sentence, keywords, heading) => {
    const normalizedSentence = normalize(sentence);
    const normalizedHeading = normalize(heading);
    let score = 0;

    keywords.forEach(keyword => {
      // Exact word match (higher score)
      const wordBoundary = new RegExp(`\\b${keyword}\\b`, 'i');
      if (wordBoundary.test(normalizedSentence)) {
        score += 3;
      }
      // Partial match
      else if (normalizedSentence.includes(keyword)) {
        score += 1;
      }
      // Heading match bonus
      if (normalizedHeading.includes(keyword)) {
        score += 2;
      }
    });

    return score;
  };

  /* ── Generate Grounded Answer ────────────────────────────────────────────── */
  const generateAnswer = (question) => {
    const sections = extractPageContent();
    const keywords = extractKeywords(question);

    if (keywords.length === 0) {
      return "I can help you find information on this page. Could you be more specific about what you're looking for?";
    }

    // Score all sentences
    const scoredSentences = [];
    sections.forEach(section => {
      const sentences = section.content
        .split(/[.!?]+/)
        .map(s => s.trim())
        .filter(s => s.length > 15);

      sentences.forEach(sentence => {
        const score = scoreSentence(sentence, keywords, section.heading);
        if (score > 0) {
          scoredSentences.push({ sentence, score, heading: section.heading });
        }
      });
    });

    // Sort by score
    scoredSentences.sort((a, b) => b.score - a.score);

    // No matches found
    if (scoredSentences.length === 0) {
      return `I couldn't find information about "${keywords.join(', ')}" on this page. This might not be covered in the current page content.`;
    }

    // Build response from top matches
    const topMatches = scoredSentences.slice(0, 3);
    const uniqueHeadings = [...new Set(topMatches.map(m => m.heading))];
    
    let response = '';
    
    if (uniqueHeadings.length === 1 && uniqueHeadings[0] !== 'Page Content') {
      response += `From "${uniqueHeadings[0]}":\n\n`;
    }

    topMatches.forEach((match) => {
      response += `• ${match.sentence}.\n`;
    });

    return response.trim();
  };

  /* ── Send Message Handler ────────────────────────────────────────────────── */
  const sendMessage = () => {
    if (!input.trim() || loading) return;
    
    const userQuestion = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userQuestion }]);
    setInput('');
    setLoading(true);

    // Simulate slight delay for natural feel
    setTimeout(() => {
      const answer = generateAnswer(userQuestion);
      setMessages(prev => [...prev, { role: 'bot', content: answer }]);
      setLoading(false);
    }, 400);
  };

  /* ── Styles ──────────────────────────────────────────────────────────────── */
  const styles = {
    // Floating orb button
    orb: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      boxShadow: hoverOrb 
        ? '0 20px 40px rgba(124, 58, 237, 0.4), 0 0 0 4px rgba(124, 58, 237, 0.2)'
        : '0 10px 30px rgba(124, 58, 237, 0.3)',
      border: 'none',
      cursor: 'pointer',
      display: open ? 'none' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2147483647,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: hoverOrb ? 'scale(1.1)' : 'scale(1)',
    },
    orbIcon: {
      width: '28px',
      height: '28px',
      color: 'white',
    },

    // Chat window container
    container: {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '380px',
      maxWidth: 'calc(100vw - 48px)',
      height: '600px',
      maxHeight: 'calc(100vh - 100px)',
      zIndex: 2147483646,
      opacity: open ? 1 : 0,
      transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      pointerEvents: open ? 'auto' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Main window
    window: {
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },

    // Header
    header: {
      padding: '20px',
      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    },
    avatar: {
      width: '44px',
      height: '44px',
      borderRadius: '14px',
      background: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: '700',
    },
    headerText: {
      display: 'flex',
      flexDirection: 'column',
    },
    headerTitle: {
      fontSize: '16px',
      fontWeight: '600',
      margin: 0,
    },
    headerSub: {
      fontSize: '12px',
      opacity: 0.85,
      margin: 0,
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.15)',
      border: 'none',
      color: 'white',
      fontSize: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.2s',
    },

    // Messages area
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    messageRow: (isUser) => ({
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }),
    messageBubble: (isUser) => ({
      maxWidth: '85%',
      padding: '14px 18px',
      borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
      background: isUser 
        ? 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
        : 'rgba(255, 255, 255, 0.9)',
      color: isUser ? 'white' : '#1f2937',
      boxShadow: isUser
        ? '0 4px 15px rgba(124, 58, 237, 0.3)'
        : '0 2px 10px rgba(0, 0, 0, 0.08)',
      fontSize: '14px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
    }),

    // Loading indicator
    loadingContainer: {
      display: 'flex',
      gap: '6px',
      padding: '14px 18px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '20px 20px 20px 6px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      width: 'fit-content',
    },
    loadingDot: (delay) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#9ca3af',
      animation: `bounce 1s infinite ${delay}s`,
    }),

    // Input area
    inputArea: {
      padding: '16px 20px 20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderTop: '1px solid rgba(0, 0, 0, 0.05)',
    },
    inputContainer: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-end',
    },
    textarea: {
      flex: 1,
      padding: '14px 16px',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.8)',
      fontSize: '14px',
      lineHeight: '1.4',
      resize: 'none',
      outline: 'none',
      fontFamily: 'inherit',
      maxHeight: '120px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    sendBtn: (disabled) => ({
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      background: disabled 
        ? '#d1d5db' 
        : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: disabled ? 'none' : '0 4px 15px rgba(124, 58, 237, 0.3)',
      transition: 'all 0.2s',
      flexShrink: 0,
    }),
    sendIcon: {
      width: '20px',
      height: '20px',
      color: 'white',
      marginLeft: '2px',
    },
    footerText: {
      textAlign: 'center',
      fontSize: '11px',
      color: '#9ca3af',
      marginTop: '12px',
    },
  };

  return (
    <div data-chatbot="true">
      {/* Floating Orb Button */}
      <button
        style={styles.orb}
        onClick={() => setOpen(true)}
        onMouseEnter={() => setHoverOrb(true)}
        onMouseLeave={() => setHoverOrb(false)}
        aria-label="Open chat assistant"
      >
        <svg style={styles.orbIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat Window */}
      <div style={styles.container}>
        <div style={styles.window}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>AI</div>
              <div style={styles.headerText}>
                <h3 style={styles.headerTitle}>Page Assistant</h3>
                <p style={styles.headerSub}>Answers based on this page</p>
              </div>
            </div>
            <button
              style={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesArea}>
            {messages.map((msg, idx) => (
              <div key={idx} style={styles.messageRow(msg.role === 'user')}>
                <div style={styles.messageBubble(msg.role === 'user')}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div style={styles.messageRow(false)}>
                <div style={styles.loadingContainer}>
                  <span style={styles.loadingDot(-0.3)} />
                  <span style={styles.loadingDot(-0.15)} />
                  <span style={styles.loadingDot(0)} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputArea}>
            <div style={styles.inputContainer}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about this page..."
                style={styles.textarea}
                rows={1}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                style={styles.sendBtn(!input.trim() || loading)}
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <svg style={styles.sendIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
            <p style={styles.footerText}>
              Answers grounded in page content only
            </p>
          </div>
        </div>
      </div>

      {/* Global animation styles */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

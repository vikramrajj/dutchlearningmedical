// ============================================================
//  Dutch AI Voice Tutor
//  - Voice INPUT  via Web Speech API (SpeechRecognition)
//  - Voice OUTPUT via Web Speech API (SpeechSynthesis)
//  - Text input as secondary fallback
//  - AI powered by Gemini 2.0 Flash via secure /api/chat proxy
// ============================================================

const API_PROXY = '/api/chat';

// ---- States ----
const STATE = {
    IDLE: 'idle',
    LISTENING: 'listening',
    THINKING: 'thinking',
    SPEAKING: 'speaking'
};

class DutchAIChat {
    constructor() {
        this.conversationHistory = [];
        this.isOpen = false;
        this.state = STATE.IDLE;
        this.recognition = null;
        this.currentUtterance = null;
        this.interimTranscript = '';

        this.buildUI();
        this.bindEvents();
        this.initSpeechRecognition();
        this.preloadVoices();
    }

    // ============================================================
    //  UI Construction
    // ============================================================
    buildUI() {
        // ---- FAB ----
        const fab = document.createElement('button');
        fab.id = 'chatFab';
        fab.className = 'chat-fab';
        fab.setAttribute('aria-label', 'Open Dutch AI Voice Tutor');
        fab.title = 'Dutch AI Voice Tutor';
        fab.innerHTML = `
            <span class="chat-fab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                     stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="2" width="6" height="11" rx="3"/>
                    <path d="M5 10a7 7 0 0 0 14 0"/>
                    <line x1="12" y1="19" x2="12" y2="23"/>
                    <line x1="8"  y1="23" x2="16" y2="23"/>
                </svg>
            </span>
            <span class="chat-fab-label">AI Tutor</span>
            <span class="chat-unread-dot hidden" id="chatUnreadDot"></span>
        `;

        // ---- Panel ----
        const panel = document.createElement('div');
        panel.id = 'chatPanel';
        panel.className = 'chat-panel';
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = `
            <!-- Header -->
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar" id="chatAvatar">🤖</div>
                    <div>
                        <div class="chat-name">Dutch AI Tutor</div>
                        <div class="chat-status" id="chatStatus">Tap the mic to begin</div>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-clear-btn" id="chatClearBtn" title="Clear chat">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                        </svg>
                    </button>
                    <button class="chat-close-btn" id="chatCloseBtn" title="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6"  y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Conversation log (always visible) -->
            <div class="chat-messages" id="chatMessages">
                <div class="chat-welcome">
                    <p>Stel een vraag in het <strong>Nederlands</strong> of Engels:</p>
                    <div class="chat-suggestions">
                        <button class="suggestion-chip" data-msg="Wat betekent bloeddruk?">Wat betekent bloeddruk?</button>
                        <button class="suggestion-chip" data-msg="Geef me 5 ziekenhuis uitdrukkingen">5 ziekenhuis-uitdrukkingen</button>
                        <button class="suggestion-chip" data-msg="Oefen een gesprek als verpleegkundige">Oefen een gesprek</button>
                    </div>
                </div>
            </div>

            <!-- Live transcript (shown while listening) -->
            <div class="chat-transcript hidden" id="chatTranscript">
                <span class="transcript-dot"></span>
                <span id="transcriptText">Spreek nu...</span>
            </div>

            <!-- Voice controls -->
            <div class="voice-controls">
                <!-- Language toggle -->
                <div class="lang-toggle">
                    <button class="lang-btn active" data-lang="nl-NL" id="langNL">Nederlands</button>
                    <button class="lang-btn" data-lang="en-US" id="langEN">English</button>
                </div>

                <!-- Mic button + label below it -->
                <div class="mic-wrapper">
                    <button class="mic-btn" id="micBtn" aria-label="Tap to speak">
                        <span class="mic-rings"></span>
                        <svg class="mic-icon" viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
                            <rect x="9" y="2" width="6" height="11" rx="3"/>
                            <path d="M5 10a7 7 0 0 0 14 0" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="12" y1="19" x2="12" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="9"  y1="22" x2="15" y2="22" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                    <span class="mic-label-below" id="micLabel">Tap to speak</span>
                </div>

                <!-- Stop button — only shown when AI is speaking -->
                <button class="stop-btn hidden" id="stopBtn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                        <rect x="4" y="4" width="16" height="16" rx="2"/>
                    </svg>
                    Stop speaking
                </button>
            </div>

            <!-- Text input (collapsed by default) -->
            <details class="text-input-details" id="textInputDetails">
                <summary>⌨️ Type instead</summary>
                <div class="chat-input-bar">
                    <textarea id="chatInput" class="chat-input"
                        placeholder="Type your question..." rows="1" maxlength="800"></textarea>
                    <button class="chat-send-btn" id="chatSendBtn" title="Send" disabled>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </details>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        // Cache DOM refs
        this.fab = fab;
        this.panel = panel;
        this.messagesEl = document.getElementById('chatMessages');
        this.statusEl = document.getElementById('chatStatus');
        this.chatAvatar = document.getElementById('chatAvatar');
        this.micBtn = document.getElementById('micBtn');
        this.micLabel = document.getElementById('micLabel');
        this.stopBtn = document.getElementById('stopBtn');
        this.transcriptEl = document.getElementById('chatTranscript');
        this.transcriptText = document.getElementById('transcriptText');
        this.inputEl = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSendBtn');
        this.unreadDot = document.getElementById('chatUnreadDot');
        this.recognitionLang = 'nl-NL';
    }

    // ============================================================
    //  Speech Recognition (input)
    // ============================================================
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.micBtn.disabled = true;
            this.micBtn.title = 'Spraakherkenning niet beschikbaar in deze browser. Gebruik Chrome of Edge.';
            this.micLabel.textContent = 'Gebruik tekst ↓';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'nl-NL';
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
            this.setState(STATE.LISTENING);
        };

        this.recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += t;
                else interim += t;
            }
            this.transcriptText.textContent = final || interim || 'Luisteren...';
            this.interimTranscript = final || interim;
        };

        this.recognition.onend = () => {
            if (this.state !== STATE.LISTENING) return; // was stopped intentionally
            const text = this.interimTranscript.trim();
            this.interimTranscript = '';
            if (text) {
                this.sendMessage(text);
            } else {
                this.setState(STATE.IDLE);
            }
        };

        this.recognition.onerror = (e) => {
            if (e.error === 'no-speech') {
                this.setState(STATE.IDLE);
                return;
            }
            this.setState(STATE.IDLE);
            this.addMessage('ai', `<em style="color:#ef4444">🎤 Spraak fout: ${e.error}. Probeer opnieuw.</em>`);
        };
    }

    // ============================================================
    //  Voice Output (TTS)
    // ============================================================
    preloadVoices() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.getVoices();
            window.speechSynthesis.addEventListener('voiceschanged', () => { });
        }
    }

    getBestDutchVoice() {
        const voices = window.speechSynthesis.getVoices();
        let best = null, bestScore = -1;
        voices.forEach(v => {
            const name = v.name.toLowerCase();
            const lang = v.lang.toLowerCase();
            if (!lang.startsWith('nl')) return;
            let score = 0;
            if (name.includes('google') && name.includes('nederland')) score = 10;
            else if (name.includes('google')) score = 9;
            else if (name.includes('microsoft') && lang === 'nl-nl' && name.includes('online')) score = 8;
            else if (name.includes('microsoft')) score = 7;
            else if (lang === 'nl-nl') score = 5;
            else score = 2;
            if (score > bestScore) { bestScore = score; best = v; }
        });
        return best;
    }

    speak(text) {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        // Strip markdown for cleaner speech
        const clean = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'nl-NL';
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voice = this.getBestDutchVoice();
        if (voice) utterance.voice = voice;

        this.currentUtterance = utterance;
        this.setState(STATE.SPEAKING);

        utterance.onend = () => this.setState(STATE.IDLE);
        utterance.onerror = () => this.setState(STATE.IDLE);

        window.speechSynthesis.speak(utterance);
    }

    stopSpeaking() {
        window.speechSynthesis && window.speechSynthesis.cancel();
        this.setState(STATE.IDLE);
    }

    // ============================================================
    //  State machine
    // ============================================================
    setState(newState) {
        this.state = newState;
        this.micBtn.className = 'mic-btn';
        this.transcriptEl.classList.add('hidden');
        this.stopBtn.classList.add('hidden');

        switch (newState) {
            case STATE.IDLE:
                this.micLabel.textContent = 'Tik om te spreken';
                this.statusEl.textContent = 'Online — klaar om te helpen';
                this.chatAvatar.textContent = '🤖';
                this.micBtn.disabled = false;
                break;

            case STATE.LISTENING:
                this.micBtn.classList.add('mic-listening');
                this.micLabel.textContent = 'Aan het luisteren...';
                this.statusEl.textContent = '🔴 Luisteren...';
                this.chatAvatar.textContent = '👂';
                this.transcriptText.textContent = 'Spreek nu...';
                this.transcriptEl.classList.remove('hidden');
                this.micBtn.disabled = false;
                break;

            case STATE.THINKING:
                this.micBtn.classList.add('mic-thinking');
                this.micLabel.textContent = 'Denken...';
                this.statusEl.textContent = '💭 AI denkt na...';
                this.chatAvatar.textContent = '💭';
                this.micBtn.disabled = true;
                break;

            case STATE.SPEAKING:
                this.micBtn.classList.add('mic-speaking');
                this.micLabel.textContent = 'AI spreekt...';
                this.statusEl.textContent = '🔊 Aan het spreken';
                this.chatAvatar.textContent = '🔊';
                this.stopBtn.classList.remove('hidden');
                this.micBtn.disabled = true;
                break;
        }
    }

    // ============================================================
    //  Event Binding
    // ============================================================
    bindEvents() {
        // FAB
        this.fab.addEventListener('click', () => this.togglePanel());
        document.getElementById('chatCloseBtn').addEventListener('click', () => this.togglePanel(false));
        document.getElementById('chatClearBtn').addEventListener('click', () => this.clearConversation());

        // Mic button — toggle listen/stop
        this.micBtn.addEventListener('click', () => {
            if (this.state === STATE.LISTENING) {
                this.recognition && this.recognition.stop();
                this.setState(STATE.IDLE);
            } else if (this.state === STATE.IDLE) {
                this.startListening();
            }
        });

        // Stop speaking
        document.getElementById('stopBtn').addEventListener('click', () => this.stopSpeaking());

        // Language toggle
        this.panel.addEventListener('click', e => {
            const langBtn = e.target.closest('.lang-btn');
            if (langBtn) {
                this.panel.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
                langBtn.classList.add('active');
                this.recognitionLang = langBtn.dataset.lang;
                if (this.recognition) this.recognition.lang = this.recognitionLang;
            }
        });

        // Suggestion chips
        this.panel.addEventListener('click', e => {
            const chip = e.target.closest('.suggestion-chip');
            if (chip) this.sendMessage(chip.dataset.msg);
        });

        // Text input (secondary)
        this.sendBtn.addEventListener('click', () => {
            const text = this.inputEl.value.trim();
            if (text) { this.inputEl.value = ''; this.inputEl.style.height = 'auto'; this.sendMessage(text); }
        });
        this.inputEl.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const text = this.inputEl.value.trim();
                if (text) { this.inputEl.value = ''; this.inputEl.style.height = 'auto'; this.sendMessage(text); }
            }
        });
        this.inputEl.addEventListener('input', () => {
            this.sendBtn.disabled = !this.inputEl.value.trim();
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 100) + 'px';
        });
    }

    startListening() {
        if (!this.recognition) return;
        this.interimTranscript = '';
        this.recognition.lang = this.recognitionLang;
        try { this.recognition.start(); }
        catch (e) { /* already started */ }
    }

    togglePanel(forceState) {
        this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
        this.panel.classList.toggle('open', this.isOpen);
        this.panel.setAttribute('aria-hidden', String(!this.isOpen));
        this.fab.classList.toggle('panel-open', this.isOpen);
        if (this.isOpen) {
            this.unreadDot.classList.add('hidden');
        }
    }

    clearConversation() {
        this.conversationHistory = [];
        window.speechSynthesis && window.speechSynthesis.cancel();
        this.setState(STATE.IDLE);
        this.messagesEl.innerHTML = `
            <div class="chat-welcome">
                <div class="welcome-emoji">🇳🇱</div>
                <h3>Nieuw gesprek!</h3>
                <p>Druk op de microfoon en begin te praten.</p>
                <div class="chat-suggestions">
                    <button class="suggestion-chip" data-msg="Wat betekent bloeddruk?">Wat betekent bloeddruk?</button>
                    <button class="suggestion-chip" data-msg="Geef me 5 ziekenhuis uitdrukkingen">5 ziekenhuis-uitdrukkingen</button>
                </div>
            </div>`;
    }

    addMessage(role, htmlContent) {
        const welcome = this.messagesEl.querySelector('.chat-welcome');
        if (welcome) welcome.remove();

        const wrapper = document.createElement('div');
        wrapper.className = `chat-msg ${role === 'user' ? 'user-msg' : 'ai-msg'}`;
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.innerHTML = htmlContent;
        wrapper.appendChild(bubble);
        this.messagesEl.appendChild(wrapper);
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    formatText(text) {
        return text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    // ============================================================
    //  Send message (works for both voice & text input)
    // ============================================================
    async sendMessage(text) {
        if (!text || this.state === STATE.THINKING) return;

        // Stop any ongoing speech before processing
        window.speechSynthesis && window.speechSynthesis.cancel();
        this.transcriptEl.classList.add('hidden');

        // Display user message
        this.addMessage('user', this.formatText(text));
        this.conversationHistory.push({ role: 'user', parts: [{ text }] });

        this.setState(STATE.THINKING);

        try {
            const response = await fetch(API_PROXY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.conversationHistory })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || `Server fout ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
                || 'Sorry, ik kon geen antwoord geven.';

            this.conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
            this.addMessage('ai', this.formatText(aiText));

            if (!this.isOpen) this.unreadDot.classList.remove('hidden');

            // 🔊 Auto-speak the AI response
            this.speak(aiText);

        } catch (err) {
            this.addMessage('ai',
                `<span style="color:#ef4444">❌ ${this.formatText(err.message)}</span>`);
            this.setState(STATE.IDLE);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DutchAIChat();
});

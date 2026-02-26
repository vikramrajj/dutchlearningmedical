// ============================================================
//  Dutch AI Tutor — calls our secure /api/chat proxy
//  The Gemini API key lives ONLY in Vercel environment variables.
//  It is NEVER in client-side code or committed to GitHub.
// ============================================================

const API_PROXY = '/api/chat';

class DutchAIChat {
    constructor() {
        this.conversationHistory = [];
        this.isOpen = false;
        this.isLoading = false;

        this.buildUI();
        this.bindEvents();
    }

    // ============================================================
    //  Build the full chat UI dynamically
    // ============================================================
    buildUI() {
        // ---- Floating Action Button ----
        const fab = document.createElement('button');
        fab.id = 'chatFab';
        fab.className = 'chat-fab';
        fab.setAttribute('aria-label', 'Open Dutch AI Tutor');
        fab.setAttribute('title', 'Dutch AI Tutor — praat met mij!');
        fab.innerHTML = `
            <span class="chat-fab-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="14" rx="3"/>
                    <path d="M8 21h8M12 17v4"/>
                    <circle cx="8.5" cy="10" r="1.2" fill="currentColor" stroke="none"/>
                    <circle cx="15.5" cy="10" r="1.2" fill="currentColor" stroke="none"/>
                    <path d="M9 13 Q12 15 15 13" stroke-linecap="round"/>
                </svg>
            </span>
            <span class="chat-fab-label">AI Tutor</span>
            <span class="chat-unread-dot" id="chatUnreadDot" style="display:none"></span>
        `;

        // ---- Chat Panel ----
        const panel = document.createElement('div');
        panel.id = 'chatPanel';
        panel.className = 'chat-panel';
        panel.setAttribute('aria-hidden', 'true');
        panel.innerHTML = `
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">🤖</div>
                    <div>
                        <div class="chat-name">Dutch AI Tutor</div>
                        <div class="chat-status" id="chatStatus">Online — praat met mij!</div>
                    </div>
                </div>
                <div class="chat-header-actions">
                    <button class="chat-clear-btn" id="chatClearBtn" title="Clear conversation">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                        </svg>
                    </button>
                    <button class="chat-close-btn" id="chatCloseBtn" title="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Messages area -->
            <div class="chat-messages" id="chatMessages">
                <div class="chat-welcome">
                    <div class="welcome-emoji">🇳🇱</div>
                    <h3>Goedendag!</h3>
                    <p>Ik ben je persoonlijke Nederlandse taalcoach. Stel me vragen over medische woorden, zorg-communicatie, of gewoon dagelijks Nederlands!</p>
                    <div class="chat-suggestions">
                        <button class="suggestion-chip" data-msg="Wat betekent 'bloeddruk'?">Wat betekent 'bloeddruk'?</button>
                        <button class="suggestion-chip" data-msg="Hoe zeg ik 'The patient is in pain' in het Nederlands?">Hoe zeg ik een zin in het NL?</button>
                        <button class="suggestion-chip" data-msg="Geef me 5 handige uitdrukkingen voor in het ziekenhuis.">5 ziekenhuis-uitdrukkingen</button>
                        <button class="suggestion-chip" data-msg="Oefengesprek: ik ben verpleegkundige en spreek een patiënt aan.">Oefen een gesprek</button>
                    </div>
                </div>
            </div>

            <!-- Typing indicator -->
            <div class="chat-typing hidden" id="chatTyping">
                <span></span><span></span><span></span>
            </div>

            <!-- Input bar -->
            <div class="chat-input-bar">
                <textarea id="chatInput" class="chat-input" placeholder="Stel een vraag of schrijf in het Nederlands..." rows="1" maxlength="800"></textarea>
                <button class="chat-send-btn" id="chatSendBtn" title="Send" disabled>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        // Cache DOM references
        this.fab = fab;
        this.panel = panel;
        this.messagesEl = document.getElementById('chatMessages');
        this.inputEl = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSendBtn');
        this.typingEl = document.getElementById('chatTyping');
        this.statusEl = document.getElementById('chatStatus');
        this.unreadDot = document.getElementById('chatUnreadDot');
    }

    bindEvents() {
        this.fab.addEventListener('click', () => this.togglePanel());
        document.getElementById('chatCloseBtn').addEventListener('click', () => this.togglePanel(false));
        document.getElementById('chatClearBtn').addEventListener('click', () => this.clearConversation());

        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.inputEl.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage(); }
        });

        this.inputEl.addEventListener('input', () => {
            this.sendBtn.disabled = this.inputEl.value.trim().length === 0;
            // Auto-resize textarea
            this.inputEl.style.height = 'auto';
            this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 120) + 'px';
        });

        // Suggestion chips
        this.panel.addEventListener('click', e => {
            const chip = e.target.closest('.suggestion-chip');
            if (chip) {
                this.inputEl.value = chip.dataset.msg;
                this.sendBtn.disabled = false;
                this.sendMessage();
            }
        });
    }

    togglePanel(forceState) {
        this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
        this.panel.classList.toggle('open', this.isOpen);
        this.panel.setAttribute('aria-hidden', !this.isOpen);
        this.fab.classList.toggle('panel-open', this.isOpen);

        if (this.isOpen) {
            this.unreadDot.style.display = 'none';
            setTimeout(() => this.inputEl.focus(), 300);
        }
    }

    clearConversation() {
        this.conversationHistory = [];
        this.messagesEl.innerHTML = `
            <div class="chat-welcome">
                <div class="welcome-emoji">🇳🇱</div>
                <h3>Nieuw gesprek!</h3>
                <p>Wat wil je vandaag leren?</p>
                <div class="chat-suggestions">
                    <button class="suggestion-chip" data-msg="Wat betekent 'bloeddruk'?">Wat betekent 'bloeddruk'?</button>
                    <button class="suggestion-chip" data-msg="Geef me 5 handige uitdrukkingen voor in het ziekenhuis.">5 ziekenhuis-uitdrukkingen</button>
                    <button class="suggestion-chip" data-msg="Oefengesprek: ik ben verpleegkundige en spreek een patiënt aan.">Oefen een gesprek</button>
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

    // Lightweight Markdown → HTML
    formatText(text) {
        return text
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(<p>)?(.+?)(<\/p>)?$/, '<p>$2</p>');
    }

    async sendMessage() {
        const text = this.inputEl.value.trim();
        if (!text || this.isLoading) return;

        this.addMessage('user', this.formatText(text));
        this.conversationHistory.push({ role: 'user', parts: [{ text }] });

        this.inputEl.value = '';
        this.inputEl.style.height = 'auto';
        this.sendBtn.disabled = true;

        this.isLoading = true;
        this.typingEl.classList.remove('hidden');
        this.statusEl.textContent = 'Aan het typen...';
        this.messagesEl.scrollTop = this.messagesEl.scrollHeight;

        try {
            // Call our secure serverless proxy — no API key in browser
            const response = await fetch(API_PROXY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: this.conversationHistory })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || `Server error ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text
                || 'Sorry, ik kon geen antwoord genereren.';

            this.conversationHistory.push({ role: 'model', parts: [{ text: aiText }] });
            this.addMessage('ai', this.formatText(aiText));

            if (!this.isOpen) this.unreadDot.style.display = '';

        } catch (err) {
            this.addMessage('ai',
                `<span style="color:#ef4444">❌ ${err.message}</span><br>
                 <small>Probeer het opnieuw of herlaad de pagina.</small>`
            );
        } finally {
            this.isLoading = false;
            this.typingEl.classList.add('hidden');
            this.statusEl.textContent = 'Online — praat met mij!';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DutchAIChat();
});

import { medicalVocab } from './data.js';

class FlashcardGame {
    constructor() {
        this.vocab = medicalVocab;
        this.filteredVocab = [...this.vocab];
        this.currentIndex = 0;
        this.mode = 'flashcard'; // 'flashcard' | 'spelling' | 'speaking' | 'quiz'

        // Stats
        this.stats = { correct: 0, wrong: 0 };
        this.speakingStats = { correct: 0, wrong: 0 };
        this.quizStats = { correct: 0, wrong: 0 };
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;

        // Speech Recog for speaking test
        this.speakingRecognition = null;
        this.isSpeakingListening = false;

        // DOM — common
        this.levelSelect = document.getElementById('levelSelect');
        this.currentLevelDisplay = document.getElementById('currentLevelDisplay');
        this.progressFill = document.getElementById('progressFill');
        this.progressCount = document.getElementById('progressCount');

        // DOM — flashcard mode
        this.flashcardSection = document.getElementById('flashcardSection');
        this.flashcard = document.getElementById('flashcard');
        this.dutchWord = document.getElementById('dutchWord');
        this.englishWord = document.getElementById('englishWord');
        this.cardCategory = document.getElementById('cardCategory');
        this.englishExplanation = document.getElementById('englishExplanation');
        this.exampleSentence = document.getElementById('exampleSentence');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.speakBtnFront = document.getElementById('speakBtnFront');

        // DOM — spelling mode
        this.spellingSection = document.getElementById('spellingSection');
        this.spellingEnglish = document.getElementById('spellingEnglish');
        this.spellingCategory = document.getElementById('spellingCategory');
        this.spellingInput = document.getElementById('spellingInput');
        this.checkSpellingBtn = document.getElementById('checkSpellingBtn');
        this.spellingFeedback = document.getElementById('spellingFeedback');
        this.feedbackIcon = document.getElementById('feedbackIcon');
        this.feedbackMessage = document.getElementById('feedbackMessage');
        this.correctAnswer = document.getElementById('correctAnswer');
        this.hintLetters = document.getElementById('hintLetters');
        this.spellingHints = document.getElementById('spellingHints');
        this.hintToggleBtn = document.getElementById('hintToggleBtn');
        this.hintShown = false;
        this.spellingPrevBtn = document.getElementById('spellingPrevBtn');
        this.spellingNextBtn = document.getElementById('spellingNextBtn');
        this.spellingShuffleBtn = document.getElementById('spellingShuffleBtn');
        this.speakBtnSpelling = document.getElementById('speakBtnSpelling');
        this.statCorrect = document.getElementById('statCorrect');
        this.statWrong = document.getElementById('statWrong');
        this.statAccuracy = document.getElementById('statAccuracy');
        this.challengeBadge = document.getElementById('challengeBadge');

        // DOM — speaking mode
        this.modeSpeaking = document.getElementById('modeSpeaking');
        this.speakingSection = document.getElementById('speakingSection');
        this.speakingEnglish = document.getElementById('speakingEnglish');
        this.speakingCategory = document.getElementById('speakingCategory');
        this.speakingExplanation = document.getElementById('speakingExplanation');
        this.speakingMicBtn = document.getElementById('speakingMicBtn');
        this.speakingStatusText = document.getElementById('speakingStatusText');
        this.speakingLiveTranscript = document.getElementById('speakingLiveTranscript');
        this.speakingFeedback = document.getElementById('speakingFeedback');
        this.speakingFeedbackIcon = document.getElementById('speakingFeedbackIcon');
        this.speakingFeedbackMessage = document.getElementById('speakingFeedbackMessage');
        this.speakingCorrectAnswer = document.getElementById('speakingCorrectAnswer');
        this.speakingPrevBtn = document.getElementById('speakingPrevBtn');
        this.speakingNextBtn = document.getElementById('speakingNextBtn');
        this.speakingStatCorrect = document.getElementById('speakingStatCorrect');
        this.speakingStatWrong = document.getElementById('speakingStatWrong');
        this.speakBtnSpeakingHint = document.getElementById('speakBtnSpeakingHint');
        this.playbackDutchVoice = document.getElementById('playbackDutchVoice');
        this.retrySpeakingBtn = document.getElementById('retrySpeakingBtn');

        // DOM — quiz mode
        this.modeQuiz = document.getElementById('modeQuiz');
        this.quizSection = document.getElementById('quizSection');
        this.quizCategory = document.getElementById('quizCategory');
        this.quizSentence = document.getElementById('quizSentence');
        this.quizOptionsGrid = document.getElementById('quizOptionsGrid');
        this.quizFeedback = document.getElementById('quizFeedback');
        this.quizFeedbackIcon = document.getElementById('quizFeedbackIcon');
        this.quizFeedbackMessage = document.getElementById('quizFeedbackMessage');
        this.playbackQuizVoice = document.getElementById('playbackQuizVoice');
        this.speakBtnQuizHint = document.getElementById('speakBtnQuizHint');
        this.quizStatCorrect = document.getElementById('quizStatCorrect');
        this.quizStatWrong = document.getElementById('quizStatWrong');
        this.quizStatAccuracy = document.getElementById('quizStatAccuracy');
        this.quizPrevBtn = document.getElementById('quizPrevBtn');
        this.quizNextBtn = document.getElementById('quizNextBtn');
        this.quizShuffleBtn = document.getElementById('quizShuffleBtn');

        // DOM — vul in mode
        this.modeVulIn = document.getElementById('modeVulIn');
        this.vulinSection = document.getElementById('vulinSection');
        this.vulinCategory = document.getElementById('vulinCategory');
        this.vulinSentence = document.getElementById('vulinSentence');
        this.vulinOptionsGrid = document.getElementById('vulinOptionsGrid');
        this.vulinFeedback = document.getElementById('vulinFeedback');
        this.vulinFeedbackIcon = document.getElementById('vulinFeedbackIcon');
        this.vulinFeedbackMessage = document.getElementById('vulinFeedbackMessage');
        this.vulinCorrectAnswer = document.getElementById('vulinCorrectAnswer');
        this.vulinHintBtn = document.getElementById('vulinHintBtn');
        this.vulinHintText = document.getElementById('vulinHintText');
        this.vulinStatCorrect = document.getElementById('vulinStatCorrect');
        this.vulinStatWrong = document.getElementById('vulinStatWrong');
        this.vulinStatAccuracy = document.getElementById('vulinStatAccuracy');
        this.vulinPrevBtn = document.getElementById('vulinPrevBtn');
        this.vulinNextBtn = document.getElementById('vulinNextBtn');
        this.vulinShuffleBtn = document.getElementById('vulinShuffleBtn');
        this.speakBtnVulinSentence = document.getElementById('speakBtnVulinSentence');
        this.vulinStats = { correct: 0, wrong: 0 };

        // DOM — mode toggle
        this.modeFlashcard = document.getElementById('modeFlashcard');
        this.modeSpelling = document.getElementById('modeSpelling');

        this.init();
    }

    init() {
        this.initSpeakingRecognition();

        // ---- Mode toggle ----
        this.modeFlashcard.addEventListener('click', () => this.switchMode('flashcard'));
        this.modeSpelling.addEventListener('click', () => this.switchMode('spelling'));
        this.modeSpeaking.addEventListener('click', () => this.switchMode('speaking'));
        this.modeQuiz.addEventListener('click', () => this.switchMode('quiz'));
        this.modeVulIn.addEventListener('click', () => this.switchMode('vulin'));

        // ---- Level filter ----
        this.levelSelect.addEventListener('change', (e) => this.filterByLevel(e.target.value));

        // ---- Flashcard mode events ----
        this.flashcard.addEventListener('click', () => this.flipCard());
        this.nextBtn.addEventListener('click', (e) => { e.stopPropagation(); this.nextCard(); });
        this.prevBtn.addEventListener('click', (e) => { e.stopPropagation(); this.prevCard(); });
        this.shuffleBtn.addEventListener('click', (e) => { e.stopPropagation(); this.shuffleCards(); });
        this.speakBtnFront.addEventListener('click', (e) => { e.stopPropagation(); this.speakCurrentWord(); });

        // ---- Spelling mode events ----
        this.checkSpellingBtn.addEventListener('click', () => this.checkSpelling());
        this.spellingInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.checkSpelling();
        });
        this.hintToggleBtn.addEventListener('click', () => this.toggleHint());
        this.spellingNextBtn.addEventListener('click', () => this.nextCard());
        this.spellingPrevBtn.addEventListener('click', () => this.prevCard());
        this.spellingShuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.speakBtnSpelling.addEventListener('click', () => this.speakCurrentWord());

        // ---- Speaking mode events ----
        this.speakingNextBtn.addEventListener('click', () => this.nextCard());
        this.speakingPrevBtn.addEventListener('click', () => this.prevCard());
        this.speakingMicBtn.addEventListener('click', () => this.toggleSpeakingTest());
        this.speakBtnSpeakingHint.addEventListener('click', () => this.speakCurrentWordEnglish());
        this.playbackDutchVoice.addEventListener('click', () => this.speakCurrentWord());
        this.retrySpeakingBtn.addEventListener('click', () => this.retrySpeakingTest());

        // ---- Quiz mode events ----
        this.quizNextBtn.addEventListener('click', () => this.nextCard());
        this.quizPrevBtn.addEventListener('click', () => this.prevCard());
        this.quizShuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.speakBtnQuizHint.addEventListener('click', () => this.speakCurrentWordEnglish());
        this.playbackQuizVoice.addEventListener('click', () => this.speakCurrentWord());

        // ---- Vul In mode events ----
        this.vulinNextBtn.addEventListener('click', () => this.nextCard());
        this.vulinPrevBtn.addEventListener('click', () => this.prevCard());
        this.vulinShuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.speakBtnVulinSentence.addEventListener('click', () => this.speakVulinSentence());
        this.vulinHintBtn.addEventListener('click', () => {
            const isHidden = this.vulinHintText.classList.toggle('hidden');
            this.vulinHintBtn.textContent = isHidden ? '💡 Show English hint' : '🙈 Hide hint';
        });

        // ---- Keyboard shortcuts ----
        document.addEventListener('keydown', (e) => {
            if (this.mode === 'flashcard') {
                if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT') {
                    e.preventDefault();
                    this.flipCard();
                } else if (e.code === 'ArrowRight') {
                    this.nextCard();
                } else if (e.code === 'ArrowLeft') {
                    this.prevCard();
                } else if (e.code === 'KeyP') {
                    this.speakCurrentWord();
                }
            }
        });

        this.updateCard();
    }

    // ============================================================
    //  MODE SWITCHING
    // ============================================================
    switchMode(newMode) {
        this.mode = newMode;

        this.modeFlashcard.classList.toggle('active', newMode === 'flashcard');
        this.modeSpelling.classList.toggle('active', newMode === 'spelling');
        this.modeSpeaking.classList.toggle('active', newMode === 'speaking');
        this.modeQuiz.classList.toggle('active', newMode === 'quiz');
        this.modeVulIn.classList.toggle('active', newMode === 'vulin');

        this.flashcardSection.classList.toggle('hidden', newMode !== 'flashcard');
        this.spellingSection.classList.toggle('hidden', newMode !== 'spelling');
        this.speakingSection.classList.toggle('hidden', newMode !== 'speaking');
        this.quizSection.classList.toggle('hidden', newMode !== 'quiz');
        this.vulinSection.classList.toggle('hidden', newMode !== 'vulin');

        // Reset state for new mode
        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        if (this.speakingRecognition && this.isSpeakingListening) {
            this.stopSpeakingTest();
        }
        this.updateCard();
    }

    // ============================================================
    //  FILTERING / SHUFFLING
    // ============================================================
    filterByLevel(level) {
        if (level === 'all') {
            this.filteredVocab = [...this.vocab];
        } else {
            this.filteredVocab = this.vocab.filter(item => item.level === level);
        }
        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.hintShown = false;
        this.updateCard();
        const levelText = level === 'all' ? 'All Levels' : `Level: ${level}`;
        this.currentLevelDisplay.textContent = levelText;
    }

    shuffleCards() {
        for (let i = this.filteredVocab.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredVocab[i], this.filteredVocab[j]] = [this.filteredVocab[j], this.filteredVocab[i]];
        }
        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.hintShown = false;
        this.updateCard();
    }

    // ============================================================
    //  NAVIGATION
    // ============================================================
    nextCard() {
        this.currentIndex = (this.currentIndex < this.filteredVocab.length - 1)
            ? this.currentIndex + 1 : 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        this.updateCard();
    }

    prevCard() {
        this.currentIndex = (this.currentIndex > 0)
            ? this.currentIndex - 1 : this.filteredVocab.length - 1;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.spellingChecked = false;
        this.speakingChecked = false;
        this.quizChecked = false;
        this.vulinChecked = false;
        this.hintShown = false;
        this.updateCard();
    }

    // ============================================================
    //  FLASHCARD MODE — flip
    // ============================================================
    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.flashcard.classList.toggle('is-flipped');
    }

    // ============================================================
    //  UPDATE CARD CONTENT
    // ============================================================
    updateCard() {
        const item = this.filteredVocab[this.currentIndex];

        if (!item) {
            this.dutchWord.textContent = 'No words found';
            this.englishWord.textContent = 'Select another level';
            this.spellingEnglish.textContent = 'No words found';
            this.speakingEnglish.textContent = 'No words found';
            this.quizSentence.textContent = 'No words found';
            this.vulinSentence.textContent = 'No words found';
            this.progressCount.textContent = '0/0';
            this.progressFill.style.width = '0%';
            return;
        }

        // Flashcard mode
        this.dutchWord.textContent = item.dutch;
        this.englishWord.textContent = item.english;
        this.cardCategory.textContent = item.category;
        this.englishExplanation.textContent = item.explanation || 'No explanation available.';
        this.exampleSentence.textContent = item.example || 'No example available.';

        // Speaking mode
        this.speakingEnglish.textContent = item.english;
        this.speakingCategory.textContent = item.category;
        this.speakingExplanation.textContent = item.explanation || 'No explanation available.';
        this.speakingStatusText.textContent = 'Tap to test speaking';
        this.speakingLiveTranscript.textContent = '';
        this.speakingFeedback.classList.add('hidden');
        this.speakingCorrectAnswer.classList.add('hidden');
        this.playbackDutchVoice.style.display = 'none';
        this.retrySpeakingBtn.style.display = 'none';

        // Spelling mode
        this.spellingEnglish.textContent = item.english;
        this.spellingCategory.textContent = item.category;
        this.spellingInput.value = '';
        this.spellingInput.disabled = false;
        this.spellingInput.classList.remove('input-correct', 'input-wrong');
        this.spellingFeedback.classList.add('hidden');
        this.correctAnswer.classList.add('hidden');
        this.hintLetters.innerHTML = '';
        this.checkSpellingBtn.textContent = 'Check';
        this.checkSpellingBtn.disabled = false;

        // 35% chance of a "Challenge" round — no hint available at all
        const isChallenge = Math.random() < 0.35;
        if (isChallenge) {
            this.hintShown = false;
            this.spellingHints.classList.add('hidden');
            this.hintToggleBtn.style.display = 'none';       // hide button entirely
            this.challengeBadge && (this.challengeBadge.style.display = '');
        } else {
            this.hintShown = true;
            this.spellingHints.classList.remove('hidden');
            this.hintToggleBtn.style.display = '';            // show toggle button
            this.hintToggleBtn.textContent = 'Hide hint';
            this.renderHintLetters(item.dutch);
            this.challengeBadge && (this.challengeBadge.style.display = 'none');
        }

        // Auto-focus the input in spelling mode so user can type immediately
        if (this.mode === 'spelling') {
            setTimeout(() => this.spellingInput.focus(), 50);
        }

        // Quiz mode
        this.quizCategory.textContent = item.category;
        this.quizFeedback.classList.add('hidden');
        this.playbackQuizVoice.style.display = 'none';

        // === QUIZ MODE ===
        // Prompt = the full Dutch example sentence (no English hints — that's the challenge!)
        this.quizSentence.textContent = item.example || item.dutch;

        // Build options: each is a Dutch word + its English explanation
        // Correct answer is the word that belongs to the sentence above
        this.quizOptionsGrid.innerHTML = '';

        const buildOptionHTML = (vocabItem) => {
            let engDesc = vocabItem.english;
            if (vocabItem.explanation && vocabItem.explanation.length > 5 && vocabItem.explanation !== 'No explanation available.') {
                engDesc = vocabItem.explanation;
            }
            return `<strong style="display:block; font-size:1.05em; font-weight:700; margin-bottom:5px;">${vocabItem.dutch}</strong>` +
                `<span style="font-size:0.88em; font-weight:400; opacity:0.85; line-height:1.3;">${engDesc}</span>`;
        };

        const optionsItems = [item];
        let attempts = 0;
        while (optionsItems.length < 4 && attempts < 60) {
            attempts++;
            const r = this.filteredVocab[Math.floor(Math.random() * this.filteredVocab.length)];
            if (!optionsItems.find(o => o.dutch === r.dutch)) {
                optionsItems.push(r);
            }
        }
        optionsItems.sort(() => Math.random() - 0.5);

        optionsItems.forEach(optItem => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.innerHTML = buildOptionHTML(optItem);
            btn.dataset.dutch = optItem.dutch;
            btn.addEventListener('click', () => this.checkQuizAnswer(optItem.dutch, btn));
            this.quizOptionsGrid.appendChild(btn);
        });

        // === VUL IN MODE ===
        this.vulinCategory.textContent = item.category;
        this.vulinFeedback.classList.add('hidden');
        this.vulinCorrectAnswer.classList.add('hidden');
        // Reset hint to hidden state
        this.vulinHintText.classList.add('hidden');
        this.vulinHintBtn.textContent = '💡 Show English hint';
        // Set hint text (English word + explanation)
        let hintContent = item.english;
        if (item.explanation && item.explanation.length > 5 && item.explanation !== 'No explanation available.') {
            hintContent += ` — ${item.explanation}`;
        }
        this.vulinHintText.textContent = hintContent;

        // Build sentence with blank: replace the Dutch key word with a blank
        const escapedKey = item.dutch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const blankRegex = new RegExp(`\\b${escapedKey}\\b`, 'i');
        const looseRegex = new RegExp(escapedKey, 'i');
        let sentenceWithBlank = item.example || item.dutch;
        const hasExample = !!item.example;
        if (hasExample && blankRegex.test(item.example)) {
            sentenceWithBlank = item.example.replace(blankRegex,
                `<span class="blank-space"> _____ </span>`);
        } else if (hasExample && looseRegex.test(item.example)) {
            sentenceWithBlank = item.example.replace(looseRegex,
                `<span class="blank-space"> _____ </span>`);
        } else {
            // fallback: show word at start as blank
            sentenceWithBlank = `<span class="blank-space"> _____ </span>: ${item.example || item.dutch}`;
        }
        this.vulinSentence.innerHTML = sentenceWithBlank;

        // Build Dutch-only word options
        this.vulinOptionsGrid.innerHTML = '';
        const vulinItems = [item];
        let vAttempts = 0;
        while (vulinItems.length < 4 && vAttempts < 60) {
            vAttempts++;
            const r = this.filteredVocab[Math.floor(Math.random() * this.filteredVocab.length)];
            if (!vulinItems.find(o => o.dutch === r.dutch)) {
                vulinItems.push(r);
            }
        }
        vulinItems.sort(() => Math.random() - 0.5);
        vulinItems.forEach(optItem => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = optItem.dutch;
            btn.dataset.dutch = optItem.dutch;
            btn.addEventListener('click', () => this.checkVulinAnswer(optItem.dutch, btn));
            this.vulinOptionsGrid.appendChild(btn);
        });

        // Progress
        const total = this.filteredVocab.length;
        const current = this.currentIndex + 1;
        this.progressCount.textContent = `${current}/${total}`;
        this.progressFill.style.width = `${(current / total) * 100}%`;
    }

    // ============================================================
    //  SPELLING MODE — check
    // ============================================================
    checkSpelling() {
        if (this.spellingChecked) {
            // Already checked — move to next
            this.nextCard();
            return;
        }

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        const userAnswer = this.spellingInput.value.trim();
        if (!userAnswer) {
            this.spellingInput.focus();
            return;
        }

        const correct = item.dutch.toLowerCase().trim();
        const isCorrect = userAnswer.toLowerCase() === correct;

        this.spellingChecked = true;
        this.spellingFeedback.classList.remove('hidden');

        if (isCorrect) {
            this.stats.correct++;
            this.feedbackIcon.textContent = '✅';
            this.feedbackMessage.textContent = 'Correct! Well done!';
            this.feedbackMessage.className = 'feedback-message feedback-correct';
            this.spellingInput.classList.add('input-correct');
            this.correctAnswer.classList.add('hidden');
            // Auto-speak correct word
            this.speakCurrentWord();
        } else {
            this.stats.wrong++;
            this.feedbackIcon.textContent = '❌';
            this.feedbackMessage.textContent = 'Not quite — the correct spelling is:';
            this.feedbackMessage.className = 'feedback-message feedback-wrong';
            this.spellingInput.classList.add('input-wrong');
            this.correctAnswer.textContent = item.dutch;
            this.correctAnswer.classList.remove('hidden');
        }

        this.updateStats();
        this.checkSpellingBtn.textContent = 'Next Word →';
        this.spellingInput.disabled = true;
    }

    toggleHint() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        // Allow hiding even after answer checked; only block *showing* after check
        if (this.spellingChecked && !this.hintShown) return;

        this.hintShown = !this.hintShown;

        if (this.hintShown) {
            this.spellingHints.classList.remove('hidden');
            this.hintToggleBtn.textContent = 'Hide hint';
            this.renderHintLetters(item.dutch);
        } else {
            this.spellingHints.classList.add('hidden');
            this.hintToggleBtn.textContent = 'Show hint letters';
        }
    }

    renderHintLetters(word) {
        this.hintLetters.innerHTML = '';
        const letters = word.split('');
        const last = letters.length - 1;

        letters.forEach((char, i) => {
            const span = document.createElement('span');

            if (char === ' ') {
                // Word separator — always show as a gap
                span.className = 'hint-letter hint-space';
                span.textContent = ' ';
            } else if (char === '-' || char === '/' || char === '.') {
                // Punctuation — always reveal
                span.className = 'hint-letter revealed';
                span.textContent = char;
            } else {
                span.className = 'hint-letter';
                // Reveal: first letter, every 3rd letter, and last letter
                // e.g. "Fractuur" → F r _ _ t _ _ r  (positions 0, 3, 6, 7)
                const shouldReveal = (i === 0) || (i === last) || (i % 3 === 0);
                if (shouldReveal) {
                    span.textContent = char;
                    span.classList.add('revealed');
                } else {
                    span.textContent = '_';
                }
            }
            this.hintLetters.appendChild(span);
        });

        // Word length badge
        const lengthBadge = document.createElement('span');
        lengthBadge.className = 'hint-length';
        lengthBadge.textContent = `${word.length} letters`;
        this.hintLetters.appendChild(lengthBadge);
    }

    updateStats() {
        const total = this.stats.correct + this.stats.wrong;
        this.statCorrect.textContent = this.stats.correct;
        this.statWrong.textContent = this.stats.wrong;
        this.statAccuracy.textContent = total > 0
            ? `${Math.round((this.stats.correct / total) * 100)}%` : '–';
    }

    // ============================================================
    //  TEXT-TO-SPEECH — Best available Dutch voice
    // ============================================================

    /**
     * Score all available voices and return the most natural Dutch one.
     * Priority (highest wins):
     *   10 – "Google Nederlands"           (Chrome neural, very natural)
     *    9 – Any other Google nl voice
     *    8 – Microsoft nl-NL Online        (Edge neural, very natural)
     *    7 – Any other Microsoft nl voice
     *    5 – System nl-NL voice
     *    2 – Any nl-* voice
     */
    getBestDutchVoice() {
        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return null;

        let best = null;
        let bestScore = -1;

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

    speakCurrentWord() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();

        let activeBtn = this.speakBtnFront;
        if (this.mode === 'spelling') activeBtn = this.speakBtnSpelling;
        if (this.mode === 'speaking') activeBtn = this.playbackDutchVoice;

        const doSpeak = () => {
            const utterance = new SpeechSynthesisUtterance(item.dutch);
            utterance.lang = 'nl-NL';
            utterance.rate = 0.82;   // Slightly slower — better for learners
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            const voice = this.getBestDutchVoice();
            if (voice) {
                utterance.voice = voice;
                // Show which voice is active in the tooltip
                activeBtn.title = `\uD83D\uDD0A ${voice.name}`;
            }

            activeBtn.classList.add('speaking');
            utterance.onend = () => activeBtn.classList.remove('speaking');
            utterance.onerror = () => activeBtn.classList.remove('speaking');
            window.speechSynthesis.speak(utterance);
        };

        // Voices may not be loaded yet on first visit — wait if needed
        if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', doSpeak, { once: true });
        } else {
            doSpeak();
        }
    }

    // ============================================================
    //  SPEAKING TEST MODE
    // ============================================================
    initSpeakingRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Speech Recognition API not supported in this browser.');
            return;
        }

        this.speakingRecognition = new SpeechRecognition();
        this.speakingRecognition.lang = 'nl-NL';
        this.speakingRecognition.continuous = true;
        this.speakingRecognition.interimResults = true;

        this.speakingRecognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            this.speakingLiveTranscript.textContent = finalTranscript || interimTranscript;

            if (finalTranscript) {
                this.checkSpeakingFormat(finalTranscript);
            }
        };

        this.speakingRecognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.speakingStatusText.textContent = 'Error: ' + event.error;
            this.speakingMicBtn.classList.remove('listening');
        };

        this.speakingRecognition.onend = () => {
            if (this.isSpeakingListening && !this.speakingChecked) {
                // If we are still supposed to be listening but it ended, restart
                try {
                    this.speakingRecognition.start();
                } catch (e) {
                    console.log('Already started');
                }
            } else if (!this.speakingChecked) {
                this.speakingMicBtn.classList.remove('listening');
                this.speakingStatusText.textContent = 'Tap to test speaking';
            }
        };
    }

    toggleSpeakingTest() {
        if (this.isSpeakingListening) {
            this.stopSpeakingTest();
        } else {
            this.startSpeakingTest();
        }
    }

    startSpeakingTest() {
        if (!this.speakingRecognition) {
            alert("Your browser does not support Speech Recognition. Please try Chrome.");
            return;
        }

        const item = this.filteredVocab[this.currentIndex];
        if (!item || this.speakingChecked) return;

        this.speakingFeedback.classList.add('hidden');
        this.speakingCorrectAnswer.classList.add('hidden');
        this.playbackDutchVoice.style.display = 'none';
        this.retrySpeakingBtn.style.display = 'none';

        this.isSpeakingListening = true;
        this.speakingLiveTranscript.textContent = '...';
        this.speakingStatusText.textContent = 'Listening... (speak Dutch)';
        this.speakingMicBtn.classList.add('listening');

        // Stop TTS if it's currently speaking
        window.speechSynthesis.cancel();

        try {
            this.speakingRecognition.start();
        } catch (e) {
            // Already started
        }
    }

    stopSpeakingTest() {
        if (!this.speakingRecognition || !this.isSpeakingListening) return;
        this.isSpeakingListening = false;
        this.speakingRecognition.stop();
        this.speakingMicBtn.classList.remove('listening');
        this.speakingStatusText.textContent = 'Processing...';

        // Give it a short delay to see if parsing caught the final result
        setTimeout(() => {
            if (!this.speakingChecked) {
                const text = this.speakingLiveTranscript.textContent;
                if (text && text !== '...') {
                    this.checkSpeakingFormat(text);
                } else {
                    this.speakingStatusText.textContent = 'Tap to test speaking';
                }
            }
        }, 800);
    }

    checkSpeakingFormat(transcript) {
        if (this.speakingChecked) return;

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        // Clean both strings: lower case, remove punctuation
        const cleanStr = (s) => s.toLowerCase().replace(/[^a-z0-9àáâäçèéêëìíîïñòóôöùúûüýÿ]/gi, '').trim();

        const transcriptClean = cleanStr(transcript);
        const dutchClean = cleanStr(item.dutch);

        // Simple fuzzy match: does transcript contain the correct word, or does the correct word contain the transcript (if long enough)
        const isCorrect = transcriptClean.includes(dutchClean) || (transcriptClean.length > 3 && dutchClean.includes(transcriptClean));

        // Mark as checked so it doesn't trigger multiple times per word
        if (isCorrect || !this.isSpeakingListening) {
            this.speakingChecked = true;
            this.isSpeakingListening = false;
            try { this.speakingRecognition.stop(); } catch (e) { }
            this.speakingMicBtn.classList.remove('listening');

            this.speakingFeedback.classList.remove('hidden');
            this.speakingStatusText.textContent = 'Test Complete';

            if (isCorrect) {
                this.speakingStats.correct++;
                this.speakingFeedback.className = 'spelling-feedback feedback-correct';
                this.speakingFeedbackIcon.innerHTML = '✅';
                this.speakingFeedbackMessage.textContent = 'Excellent pronunciation!';
            } else {
                this.speakingStats.wrong++;
                this.speakingFeedback.className = 'spelling-feedback feedback-wrong';
                this.speakingFeedbackIcon.innerHTML = '❌';
                this.speakingFeedbackMessage.textContent = 'Keep practicing!';
                this.speakingCorrectAnswer.textContent = `It should sound like: ${item.dutch}`;
                this.speakingCorrectAnswer.classList.remove('hidden');
                this.playbackDutchVoice.style.display = 'block';
                this.retrySpeakingBtn.style.display = 'block';
            }

            this.updateSpeakingStats();
        }
    }

    retrySpeakingTest() {
        // Only allow retry if they failed the most recent test
        if (!this.speakingChecked) return;

        // Remove the wrong stat so they can try again
        if (this.speakingStats.wrong > 0) {
            this.speakingStats.wrong--;
        }
        this.updateSpeakingStats();

        // Reset state for the current card
        this.speakingChecked = false;
        this.speakingLiveTranscript.textContent = '';
        this.speakingFeedback.classList.add('hidden');
        this.speakingCorrectAnswer.classList.add('hidden');
        this.playbackDutchVoice.style.display = 'none';
        this.retrySpeakingBtn.style.display = 'none';

        // Immediately start listening again
        this.startSpeakingTest();
    }

    updateSpeakingStats() {
        const total = this.speakingStats.correct + this.speakingStats.wrong;
        this.speakingStatCorrect.textContent = this.speakingStats.correct;
        this.speakingStatWrong.textContent = this.speakingStats.wrong;
        this.speakingStatAccuracy.textContent = total > 0
            ? `${Math.round((this.speakingStats.correct / total) * 100)}%` : '–';
    }

    speakCurrentWordEnglish() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        this.speakBtnSpeakingHint.classList.add('speaking');

        const utterance = new SpeechSynthesisUtterance(item.english);
        utterance.lang = 'en-US';
        utterance.onend = () => this.speakBtnSpeakingHint.classList.remove('speaking');
        utterance.onerror = () => this.speakBtnSpeakingHint.classList.remove('speaking');

        window.speechSynthesis.speak(utterance);
    }

    // ============================================================
    //  QUIZ MODE — LOGIC
    // ============================================================
    checkQuizAnswer(selectedDutch, btn) {
        if (this.quizChecked) return;

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        this.quizChecked = true;

        // Disable all buttons in the grid
        const allBtns = this.quizOptionsGrid.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        const isCorrect = selectedDutch === item.dutch;

        this.quizFeedback.classList.remove('hidden');
        this.playbackQuizVoice.style.display = 'block';

        if (isCorrect) {
            this.quizStats.correct++;
            btn.classList.add('correct');
            this.quizFeedback.className = 'spelling-feedback feedback-correct';
            this.quizFeedbackIcon.innerHTML = '✅';
            this.quizFeedbackMessage.textContent = 'Correct!';
        } else {
            this.quizStats.wrong++;
            btn.classList.add('wrong');

            // Highlight the correct one
            allBtns.forEach(b => {
                if (b.dataset.dutch === item.dutch) {
                    b.classList.add('correct');
                }
            });

            this.quizFeedback.className = 'spelling-feedback feedback-wrong';
            this.quizFeedbackIcon.innerHTML = '❌';
            this.quizFeedbackMessage.textContent = 'Incorrect!';
        }

        this.updateQuizStats();
    }

    updateQuizStats() {
        const total = this.quizStats.correct + this.quizStats.wrong;
        this.quizStatCorrect.textContent = this.quizStats.correct;
        this.quizStatWrong.textContent = this.quizStats.wrong;
        this.quizStatAccuracy.textContent = total > 0
            ? `${Math.round((this.quizStats.correct / total) * 100)}%` : '–';
    }

    // ============================================================
    //  VUL IN MODE — LOGIC
    // ============================================================
    checkVulinAnswer(selectedDutch, btn) {
        if (this.vulinChecked) return;

        const item = this.filteredVocab[this.currentIndex];
        if (!item) return;

        this.vulinChecked = true;

        const allBtns = this.vulinOptionsGrid.querySelectorAll('button');
        allBtns.forEach(b => b.disabled = true);

        const isCorrect = selectedDutch === item.dutch;

        // Fill the blank visually with the selected word
        const blankEl = this.vulinSentence.querySelector('.blank-space');
        if (blankEl) {
            blankEl.textContent = ` ${selectedDutch} `;
            blankEl.style.borderColor = isCorrect ? 'var(--success)' : 'var(--danger)';
            blankEl.style.color = isCorrect ? 'var(--success)' : 'var(--danger)';
        }

        // If wrong, also highlight the correct button green
        if (!isCorrect) {
            allBtns.forEach(b => {
                if (b.dataset.dutch === item.dutch) b.classList.add('correct');
            });
        }

        this.vulinFeedback.classList.remove('hidden');

        if (isCorrect) {
            this.vulinStats.correct++;
            btn.classList.add('correct');
            this.vulinFeedback.className = 'spelling-feedback feedback-correct';
            this.vulinFeedbackIcon.innerHTML = '✅';
            this.vulinFeedbackMessage.textContent = 'Correct! Goed gedaan!';
        } else {
            this.vulinStats.wrong++;
            btn.classList.add('wrong');
            this.vulinFeedback.className = 'spelling-feedback feedback-wrong';
            this.vulinFeedbackIcon.innerHTML = '❌';
            this.vulinFeedbackMessage.textContent = `Incorrect! The answer is: ${item.dutch}`;
        }

        this.updateVulinStats();
    }

    updateVulinStats() {
        const total = this.vulinStats.correct + this.vulinStats.wrong;
        this.vulinStatCorrect.textContent = this.vulinStats.correct;
        this.vulinStatWrong.textContent = this.vulinStats.wrong;
        this.vulinStatAccuracy.textContent = total > 0
            ? `${Math.round((this.vulinStats.correct / total) * 100)}%` : '–';
    }

    speakVulinSentence() {
        const item = this.filteredVocab[this.currentIndex];
        if (!item || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(item.example || item.dutch);
        utterance.lang = 'nl-NL';
        const voices = window.speechSynthesis.getVoices();
        const nlVoice = voices.find(v => v.lang.startsWith('nl'));
        if (nlVoice) utterance.voice = nlVoice;
        window.speechSynthesis.speak(utterance);
    }
}

// Warm-up: trigger voice list load as early as possible so the
// first speaker-button click has no delay.
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', () => { });
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardGame();
});

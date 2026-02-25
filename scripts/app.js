import { medicalVocab } from './data.js';

class FlashcardGame {
    constructor() {
        this.vocab = medicalVocab;
        this.filteredVocab = [...this.vocab];
        this.currentIndex = 0;
        this.isFlipped = false;

        // DOM elements
        this.flashcard = document.getElementById('flashcard');
        this.dutchWord = document.getElementById('dutchWord');
        this.englishWord = document.getElementById('englishWord');
        this.cardCategory = document.getElementById('cardCategory');
        this.englishExplanation = document.getElementById('englishExplanation');
        this.exampleSentence = document.getElementById('exampleSentence');
        this.progressFill = document.getElementById('progressFill');
        this.progressCount = document.getElementById('progressCount');
        this.levelSelect = document.getElementById('levelSelect');
        this.currentLevelDisplay = document.getElementById('currentLevelDisplay');

        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');

        this.init();
    }

    init() {
        // Click on the card to flip it
        this.flashcard.addEventListener('click', () => this.flipCard());

        // Navigation buttons
        this.nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextCard();
        });
        this.prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevCard();
        });
        this.shuffleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.shuffleCards();
        });
        this.levelSelect.addEventListener('change', (e) => this.filterByLevel(e.target.value));

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.flipCard();
            } else if (e.code === 'ArrowRight') {
                this.nextCard();
            } else if (e.code === 'ArrowLeft') {
                this.prevCard();
            }
        });

        this.updateCard();
    }

    filterByLevel(level) {
        if (level === 'all') {
            this.filteredVocab = [...this.vocab];
        } else {
            this.filteredVocab = this.vocab.filter(item => item.level === level);
        }

        this.currentIndex = 0;
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
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
        this.updateCard();
    }

    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.flashcard.classList.toggle('is-flipped');
    }

    nextCard() {
        if (this.currentIndex < this.filteredVocab.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop back
        }
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.updateCard();
    }

    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.filteredVocab.length - 1; // Loop to end
        }
        this.isFlipped = false;
        this.flashcard.classList.remove('is-flipped');
        this.updateCard();
    }

    updateCard() {
        const item = this.filteredVocab[this.currentIndex];

        if (!item) {
            this.dutchWord.textContent = "No words found";
            this.englishWord.textContent = "Select another level";
            return;
        }

        this.dutchWord.textContent = item.dutch;
        this.englishWord.textContent = item.english;
        this.cardCategory.textContent = item.category;
        this.englishExplanation.textContent = item.explanation || "No explanation available.";
        this.exampleSentence.textContent = item.example || "No example available.";

        // Update progress
        const total = this.filteredVocab.length;
        const current = this.currentIndex + 1;
        this.progressCount.textContent = `${current}/${total}`;
        const percentage = (current / total) * 100;
        this.progressFill.style.width = `${percentage}%`;
    }
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    new FlashcardGame();
});

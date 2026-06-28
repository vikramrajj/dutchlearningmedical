#!/usr/bin/env python3
"""Generate fill-in-the-blank Derde Ronde exercises from the correct reading pages.
Extracts only pages matching the official book page ranges.
Creates exercises in the book's style: key content words blanked from meaningful text.
Target: 500-1000 exercises total."""
import json
import random
import re
from pathlib import Path

random.seed(42)

# Official page ranges from the Derde Ronde textbook
CHAPTER_PAGE_RANGES = {
    'chapter_8':  (87, 91),   # Les 8: Vier Hollandse legendes
    'chapter_9':  (97, 100),  # Les 9: Nederland een waterlaboratorium
    'chapter_10': (107, 110), # Les 10: Sinterklaas voor de rechter
    'chapter_11': (116, 121), # Les 11: Van zeehelden tot kolonisators
    'chapter_12': (127, 130), # Les 12: Agendapunt: welk museum?
    'chapter_13': (137, 142), # Les 13: Rondje Delft
    'chapter_14': (148, 153), # Les 14: Dutch design
    'chapter_15': (158, 161), # Les 15: Nederland in 2060
}

# ============================================================
# WORD CATEGORIES FOR BLANKING
# ============================================================

# Tier 0: NEVER blanked — trivial function words
CRITICAL_FUNCTION_WORDS = {
    # Articles & determiners
    'de', 'het', 'een', 'deze', 'dit', 'die', 'dat', 'welke',
    # Core prepositions
    'in', 'op', 'van', 'met', 'voor', 'naar', 'aan', 'bij', 'uit', 'om',
    'na', 'tot', 'door', 'over', 'onder', 'tussen', 'sinds',
    # Basic conjunctions
    'en', 'of', 'maar', 'want', 'dus', 'omdat', 'als',
    # Core auxiliaries & high-frequency verbs
    'is', 'zijn', 'was', 'waren', 'ben', 'worden', 'wordt', 'moet', 'kan',
    'wil', 'zal', 'heb', 'heeft', 'hebben', 'had', 'zou', 'doen', 'doet',
    'komt', 'komen', 'gaat', 'gaan', 'zegt', 'zeggen', 'weet', 'weten',
    # Pronouns
    'ik', 'je', 'u', 'hij', 'zij', 'we', 'wij', 'ze', 'ons', 'hun',
    'hem', 'haar', 'mij', 'me', 'jou', 'hen', 'mijn', 'jouw', 'zijn',
    # Negation
    'niet', 'geen', 'nooit', 'niemand', 'niets',
    # Trivial adverbs
    'heel', 'zeer', 'veel', 'meer', 'minder', 'zo', 'te', 'wel', 'ook',
    'nog', 'al', 'eens', 'net', 'alleen',
    # Question words
    'wat', 'wie', 'waar', 'waarom', 'wanneer', 'hoe', 'hoeveel',
    # Locative/temporal basics
    'hier', 'daar', 'nu', 'toen', 'vandaag', 'gisteren', 'morgen',
    'vorig', 'volgende',
    # Fillers
    'bijvoorbeeld', 'enz', 'enzovoort', 'e.d', 'etc', 'even',
}

# Tier 1: HIGH-VALUE DISCOURSE MARKERS — top priority for blanking
# These are crucial for B1/B2 Dutch: connectors, transition words, stance adverbs
HIGH_VALUE_DISCOURSE_WORDS = {
    # Contrast/concession
    'hoewel', 'terwijl', 'echter', 'toch', 'daarentegen', 'desondanks',
    'niettemin', 'evenwel', 'integendeel', 'enerzijds', 'anderzijds',
    # Cause/result
    'daarom', 'daardoor', 'vanwege', 'wegens', 'dankzij', 'doordat',
    'aangezien', 'derhalve', 'zodoende', 'dientengevolge',
    # Addition/sequence
    'bovendien', 'daarnaast', 'vervolgens', 'tenslotte', 'overigens',
    'tevens', 'eveneens', 'bovendien', 'daarbij', 'daarna',
    # Clarification/specification
    'namelijk', 'inderdaad', 'immers', 'kennelijk', 'blijkbaar',
    'uiteraard', 'vanzelfsprekend', 'feitelijk', 'eigenlijk',
    # Temporal/stance
    'inmiddels', 'ondertussen', 'intussen', 'voorlopig', 'onlangs',
    'onmiddellijk', 'geleidelijk', 'gaandeweg', 'aanvankelijk',
    # Conclusion/summary
    'kortom', 'samenvattend', 'concluderend', 'almet al',
    # Condition
    'indien', 'mits', 'tenzij', 'zodra', 'zolang', 'voordat', 'nadat',
    'totdat', 'zodat', 'opdat',
    # Stance/opinion
    'volgens', 'gezien', 'betreffende', 'aangaande', 'omtrent',
    'ondanks', 'ongeacht', 'afgezien', 'behoudens',
}

# Tier 2: IMPORTANT ADVERBS — valuable B1/B2 vocabulary
IMPORTANT_ADVERBS = {
    'eigenlijk', 'natuurlijk', 'misschien', 'waarschijnlijk', 'zeker',
    'absoluut', 'duidelijk', 'precies', 'ongeveer', 'tenminste',
    'minstens', 'meestal', 'doorgaans', 'gewoonlijk', 'normaliter',
    'herhaaldelijk', 'regelmatig', 'voortdurend', 'onophoudelijk',
    'gelukkig', 'helaas', 'ongelukkigerwijs', 'jammergenoeg',
    'buitengewoon', 'ongelooflijk', 'ontzettend', 'enorm', 'behoorlijk',
    'tamelijk', 'redelijk', 'vrijwel', 'nagenoeg', 'haast',
    'eindelijk', 'uiteindelijk', 'tenminste', 'althans', 'überhaupt',
    'sowieso', 'hoe dan ook', 'in ieder geval', 'ten slotte',
    'grotendeels', 'hoofdzakelijk', 'voornamelijk', 'met name',
    'vooral', 'juist', 'meteen', 'direct', 'onmiddellijk',
}

# Tier 3: COMPOUND EXPRESSIONS — multi-word phrases to blank
COMPOUND_EXPRESSIONS = {
    'met andere woorden', 'met behulp van', 'aan de hand van',
    'in het kader van', 'in verband met', 'ten opzichte van',
    'in tegenstelling tot', 'naar aanleiding van', 'naar mijn mening',
    'in de loop van', 'op basis van', 'in plaats van',
    'met betrekking tot', 'ten behoeve van', 'door middel van',
    'in het bijzonder', 'in het algemeen', 'onder andere',
    'in de praktijk', 'in werkelijkheid', 'in principe',
}

# Tier 4: KEY GRAMMAR TERMS — lidwoorden, uitdrukkingen, etc.
GRAMMAR_TERMS = {
    'lidwoord', 'lidwoorden', 'werkwoord', 'werkwoorden',
    'bijvoeglijk', 'naamwoord', 'zelfstandig', 'voornaamwoord',
    'voorzetsel', 'voorzetsels', 'uitdrukking', 'uitdrukkingen',
    'woordcombinatie', 'combinatie', 'zinsconstructie',
    'tegenwoordige', 'verleden', 'voltooid', 'deelwoord',
}

# Words that CAN be blanked if they appear in a good context
BORDERLINE_WORDS = {
    'groot', 'klein', 'goed', 'slecht', 'oud', 'nieuw', 'hoog', 'laag',
    'sterk', 'zwak', 'warm', 'koud', 'vroeg', 'laat', 'snel', 'langzaam',
    'makkelijk', 'moeilijk', 'simpel', 'ingewikkeld',
    'anders', 'verder', 'weinig', 'genoeg', 'mogelijk',
}

# Combined: words that must NEVER be blanked
DO_NOT_BLANK = CRITICAL_FUNCTION_WORDS

# Words that are excellent blanking targets (high score regardless of other factors)
PRIORITY_BLANK_WORDS = HIGH_VALUE_DISCOURSE_WORDS | IMPORTANT_ADVERBS | GRAMMAR_TERMS

WORD_RE = re.compile(r"[A-Za-zÀ-ÿ''-]+")
EXERCISE_HEADERS_RE = re.compile(
    r'\b(?:SAMENVATTENDE\s+GATENTEKST|ONDER\s+DE\s+LOEP|GRAMMATICA|'
    r'VRAGEN\s+(?:BIJ|OVER)\s+DE\s+TEKST|SCHRIJFOPDRACHT|SPREEKOPDRACHT|'
    r'LUISTEROPDRACHT|LEESOPDRACHT|OEFENING|Opdracht\s+\d+)\b',
    re.IGNORECASE
)


def extract_page_number(text: str) -> int | None:
    m = re.match(r'(\d{1,3})\s', text)
    return int(m.group(1)) if m else None


def extract_correct_pages(raw_text: str, page_start: int, page_end: int) -> str:
    """Extract only the reading pages within the correct page range."""
    pages = raw_text.split('\n\n')
    kept_pages = []
    for page in pages:
        pn = extract_page_number(page)
        if pn is None:
            continue
        if pn < page_start or pn > page_end:
            continue
        # Skip pages that are entirely exercise content
        if EXERCISE_HEADERS_RE.search(page):
            split_point = EXERCISE_HEADERS_RE.search(page).start()
            if split_point > 200:  # substantial reading content before exercises
                page = page[:split_point]
            else:
                continue
        # Remove headers and artifacts
        page = re.sub(r'\d{2,3}\s+Derde Ronde Nederlands voor buitenlanders\s*', '', page)
        page = re.sub(r'^\d{1,3}\s+', '', page)
        page = re.sub(r'\bLes\s+\d+\b.*?(?=[A-Z])', '', page, count=1)
        page = re.sub(r'fig\.?\s*\d+\.\d+\s*[A-Za-z,.\s]*?\.', '', page)
        page = re.sub(r'_{2,}', '', page)
        page = re.sub(r'\b\d{1,3}\s{2,}(?=[A-Z])', '', page)
        page = re.sub(r'\s+', ' ', page)
        page = page.strip()
        if len(page) > 100:
            kept_pages.append(page)
    return ' '.join(kept_pages)


def clean_reading_text(text: str) -> str:
    text = text.replace('\ufb01', 'fi').replace('\ufb02', 'fl')
    text = text.replace('\u01ce', 'fi').replace('\u02ce', 'fl')
    text = re.sub(r'\b\d{2,3}\s+Derde\s+Ronde\b.*?(?=[A-Z])', '', text)
    text = re.sub(r'\bLes\s+\d+\b', '', text)
    text = re.sub(r'fig\.\s*\d+\.\d+\s*', '', text)
    text = re.sub(r'_{2,}', '', text)
    # Remove standalone page numbers (1-2 digits before capitalized words)
    text = re.sub(r'\b\d{1,2}\s+(?=[A-ZÀ-Ö])', '', text)
    # Remove page number sequences like "1 5 10 "
    text = re.sub(r'\b(?:\d{1,2}\s+){2,}(?=[A-ZÀ-Ö])', '', text)
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def split_sentences(text: str, min_len: int = 15) -> list[str]:
    raw = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"\u2018\u201c(])', text)
    return [s.strip() for s in raw if s.strip() and len(s.strip()) >= min_len]


def split_paragraphs(text: str) -> list[str]:
    sentences = split_sentences(text, min_len=10)
    chunks = []
    current = ''
    for s in sentences:
        candidate = f"{current} {s}".strip() if current else s
        if len(candidate) > 400 and current:
            if len(current) >= 50:
                chunks.append(current)
            current = s
        else:
            current = candidate
    if current and len(current) >= 40:
        chunks.append(current)
    return chunks


def build_sentence_groups(sentences: list[str], group_size: int) -> list[str]:
    if len(sentences) < group_size:
        return []
    groups = []
    for i in range(len(sentences) - group_size + 1):
        group = ' '.join(sentences[i:i + group_size])
        if 40 <= len(group) <= 400:
            groups.append(group)
    return groups


def tokenize(text: str) -> list[str]:
    return re.findall(r"[A-Za-zÀ-ÿ''-]+|[^A-Za-zÀ-ÿ''-]+", text)


QUOTE_CHARS = "'\u2018\u2019\u201c\u201d\u02bc\u201a\u201b"
STRIP_CHARS = QUOTE_CHARS + "-.,;:!?()[]\""

def is_content_word(word: str) -> bool:
    """Check if word is suitable for blanking: discourse markers, adverbs, proper nouns, key vocabulary."""
    cleaned = word.strip(STRIP_CHARS)
    
    # Too short or numbers
    if len(cleaned) < 4:
        return False
    if re.fullmatch(r'\d+', cleaned):
        return False
    if cleaned.isupper() and len(cleaned) <= 3:
        return False
    
    # NEVER blank critical function words
    if cleaned.lower() in CRITICAL_FUNCTION_WORDS:
        return False
    
    # ALWAYS allow priority words (discourse markers, adverbs, grammar terms)
    if cleaned.lower() in PRIORITY_BLANK_WORDS:
        return True
    
    # Borderline words: allow if capitalized or long enough
    if cleaned.lower() in BORDERLINE_WORDS:
        if cleaned[0].isupper() and len(cleaned) >= 5:
            return True
        if len(cleaned) >= 6:
            return True
        return False
    
    return True


def score_word_for_blanking(word: str, position: int, total_tokens: int,
                            used_words: set = None) -> float:
    """Score a word for how good it is as a blank answer.
    Tiers: Discourse markers (70+) > Adverbs (50+) > Proper nouns (35+) > Regular content (5-30)."""
    cleaned = word.strip(STRIP_CHARS)
    lower = cleaned.lower()
    score = 0.0
    word_len = len(cleaned)
    
    # ============================================================
    # TIER 1: DISCOURSE MARKERS — HIGHEST PRIORITY (base 60-80)
    # ============================================================
    if lower in HIGH_VALUE_DISCOURSE_WORDS:
        score += 70  # base
        # Extra for longer, more impressive markers
        if word_len >= 8:
            score += 10
        if word_len >= 10:
            score += 5
        # Position bonus: discourse markers in mid-sentence are ideal
        if 3 < position < total_tokens - 3:
            score += 5
    
    # ============================================================
    # TIER 2: IMPORTANT ADVERBS (base 45-60)
    # ============================================================
    elif lower in IMPORTANT_ADVERBS:
        score += 50
        if word_len >= 7:
            score += 8
        if word_len >= 10:
            score += 5
    
    # ============================================================
    # TIER 3: GRAMMAR TERMS (base 40-50)
    # ============================================================
    elif lower in GRAMMAR_TERMS:
        score += 45
        if word_len >= 8:
            score += 5
    
    # ============================================================
    # TIER 4: PROPER NOUNS / CAPITALIZED (base 30-40)
    # ============================================================
    elif cleaned[0].isupper():
        score += 30
        # Longer proper nouns are more interesting
        if 6 <= word_len <= 12:
            score += 8
        elif word_len > 12:
            score += 5
        # Dutch-specific letters (ij, oe, ui) indicate valuable vocabulary
        if 'ij' in lower or 'oe' in lower:
            score += 4
    
    # ============================================================
    # TIER 5: REGULAR CONTENT WORDS (base 5-25)
    # ============================================================
    else:
        # Length preference: 6-12 chars is optimal
        if 6 <= word_len <= 12:
            score += 15
        elif 5 <= word_len <= 14:
            score += 10
        elif word_len > 14:
            score += 6
        else:
            score += 3
        
        # Dutch letter combinations indicate authentic vocabulary
        if 'ij' in lower or 'oe' in lower:
            score += 5
        if 'ui' in lower or 'ei' in lower:
            score += 3
        if 'sch' in lower or 'cht' in lower:
            score += 3
        
        # Mid-sentence words have better context
        if 3 < position < total_tokens - 3:
            score += 3
    
    # ============================================================
    # DIVERSITY BONUS / PENALTY
    # ============================================================
    if used_words is not None:
        if lower in used_words:
            # Heavy penalty for words already used in this chapter
            score -= 50
        # Bonus for words that haven't been used yet
        else:
            score += 8
    
    # ============================================================
    # DISCOURAGE OVERLY COMMON PATTERNS
    # ============================================================
    common_suffixes = {'ing', 'lijk', 'heid', 'tie', 'ment', 'atie'}
    for suffix in common_suffixes:
        if lower.endswith(suffix):
            score -= 3
            break
    
    # Avoid words that look like English cognates (less valuable)
    if re.match(r'^[a-z]+(tion|sion|ical|able|ible)$', lower):
        score -= 5
    
    return max(0, score)


def select_blanks(tokens: list[str], n_blanks: int,
                  used_words: set = None,
                  avoid_positions: set = None) -> list[int]:
    """Select the best positions to blank based on semantic value + diversity."""
    if avoid_positions is None:
        avoid_positions = set()
    if used_words is None:
        used_words = set()
    
    candidates = []
    for i, token in enumerate(tokens):
        if i in avoid_positions:
            continue
        if WORD_RE.fullmatch(token) and is_content_word(token):
            word = token.strip(STRIP_CHARS)
            score = score_word_for_blanking(word, i, len(tokens), used_words)
            candidates.append((score, i, word))
    
    if len(candidates) < n_blanks:
        return []
    
    # Sort by score (highest first)
    candidates.sort(key=lambda x: -x[0])
    
    # Select top candidates ensuring minimum spacing and word diversity
    chosen = []
    chosen_words = set()
    for score, idx, word in candidates:
        # Ensure words aren't too close together (need context between blanks)
        if any(abs(idx - prev) < 4 for prev in chosen):
            continue
        # Enforce word diversity: don't blank the same word twice in one exercise
        word_lower = word.lower()
        if word_lower in chosen_words:
            continue
        chosen.append(idx)
        chosen_words.add(word_lower)
        if len(chosen) >= n_blanks:
            break
    
    return sorted(chosen)


def build_exercise(text: str, blank_indices: list[int]) -> dict | None:
    tokens = tokenize(text)
    answers = []
    for idx in blank_indices:
        if idx >= len(tokens):
            return None
        word = tokens[idx].strip(STRIP_CHARS)
        if not word:
            return None
        answers.append(word)
        tokens[idx] = '_____'
    text_lower = text.lower()
    for a in answers:
        if a.lower() not in text_lower:
            return None
    blanked = ''.join(tokens)
    hints = [
        f"Begint met '{a[0].upper()}' — {len(a)} letters"
        for a in answers
    ]
    return {
        'paragraph': text,
        'blanked': blanked,
        'answers': answers,
        'hints': hints,
    }


def generate_exercises(reading_text: str, target_count: int) -> list[dict]:
    """Generate comprehensive reading comprehension exercises with 6-8 strategic blanks per passage.
    Focus: discourse markers, adverbs, grammar terms, and key vocabulary.
    Diversity: avoid repeating the same words across exercises."""
    text = clean_reading_text(reading_text)
    if len(text) < 500:
        return [], {}
    
    all_exercises = []
    seen_answers = set()
    used_words = set()  # Track words already blanked in this chapter
    sentences = split_sentences(text)
    
    if len(sentences) < 5:
        return [], {}
    
    # Stats tracking
    stats = {
        'discourse_markers_used': set(),
        'adverbs_used': set(),
        'grammar_terms_used': set(),
        'proper_nouns_used': set(),
        'total_attempts': 0,
    }

    # Strategy: Create longer passages with 6-8 blanks each
    attempts = 0
    max_attempts = len(sentences) * 5  # More attempts needed for diversity
    
    while len(all_exercises) < target_count and attempts < max_attempts:
        attempts += 1
        stats['total_attempts'] += 1
        
        # Random sentence group size: 4-6 sentences per exercise
        group_size = random.randint(4, 6)
        start_idx = random.randint(0, len(sentences) - group_size)
        group_sentences = sentences[start_idx:start_idx + group_size]
        passage = ' '.join(group_sentences)
        
        # Ensure passage is long enough
        if len(passage) < 300:
            continue
        
        tokens = tokenize(passage)
        
        # Count how many content words we can blank
        n_candidates = sum(1 for i, t in enumerate(tokens)
                          if WORD_RE.fullmatch(t) and is_content_word(t))
        
        # Need at least 16 candidates to blank 6-8 safely
        if n_candidates < 16:
            continue
        
        # Target 6-8 blanks for comprehensive reading exercises
        for n_blanks in [7, 6, 8]:
            if n_candidates < n_blanks * 2:
                continue
            
            for _ in range(3):
                idxs = select_blanks(tokens, n_blanks, used_words)
                if not idxs or len(idxs) < n_blanks:
                    continue
                
                ex = build_exercise(passage, idxs)
                if not ex:
                    continue
                
                # Deduplication by answer set
                key = '|'.join(sorted(a.lower() for a in ex['answers']))
                if key in seen_answers:
                    continue
                
                # Track used words and stats
                for a in ex['answers']:
                    al = a.lower()
                    used_words.add(al)
                    if al in HIGH_VALUE_DISCOURSE_WORDS:
                        stats['discourse_markers_used'].add(al)
                    elif al in IMPORTANT_ADVERBS:
                        stats['adverbs_used'].add(al)
                    elif al in GRAMMAR_TERMS:
                        stats['grammar_terms_used'].add(al)
                    elif a[0].isupper():
                        stats['proper_nouns_used'].add(al)
                
                seen_answers.add(key)
                all_exercises.append(ex)
                break
        
        if len(all_exercises) >= target_count:
            break

    # Source 2: If we need more, also create exercises from multi-sentence groups
    if len(all_exercises) < target_count * 0.8:
        for group_size in [5, 4]:
            if len(all_exercises) >= target_count:
                break
            groups = build_sentence_groups(sentences, group_size)
            
            for group in groups:
                if len(all_exercises) >= target_count:
                    break
                
                tokens = tokenize(group)
                n_candidates = sum(1 for i, t in enumerate(tokens)
                                  if WORD_RE.fullmatch(t) and is_content_word(t))
                
                if n_candidates < 12:
                    continue
                
                for n_blanks in [6, 5]:
                    if n_candidates < n_blanks * 2:
                        continue
                    
                    for _ in range(2):
                        idxs = select_blanks(tokens, n_blanks, used_words)
                        if not idxs or len(idxs) < n_blanks:
                            continue
                        
                        ex = build_exercise(group, idxs)
                        if not ex:
                            continue
                        
                        key = '|'.join(sorted(a.lower() for a in ex['answers']))
                        if key in seen_answers:
                            continue
                        
                        for a in ex['answers']:
                            al = a.lower()
                            used_words.add(al)
                            if al in HIGH_VALUE_DISCOURSE_WORDS:
                                stats['discourse_markers_used'].add(al)
                            elif al in IMPORTANT_ADVERBS:
                                stats['adverbs_used'].add(al)
                            elif al in GRAMMAR_TERMS:
                                stats['grammar_terms_used'].add(al)
                        
                        seen_answers.add(key)
                        all_exercises.append(ex)
                        break

    # Quality filtering & validation
    filtered = []
    for ex in all_exercises:
        para = ex['paragraph']
        answers = ex['answers']
        blanked = ex['blanked']
        
        if len(para) < 20:
            continue
        if len(set(a.lower() for a in answers)) < len(answers):
            continue
        if re.search(r'(?<!\w)\d{1,3}(?!\w)', para) and len(para) < 80:
            continue
        if blanked.count('_____') != len(answers):
            continue
        para_lower = para.lower()
        if not all(a.lower() in para_lower for a in answers):
            continue
        
        filtered.append(ex)
    
    random.shuffle(filtered)
    return filtered[:target_count], stats


def main() -> None:
    src = Path('scripts/derdeRondeData.js')
    dst = Path('scripts/derdeRondeVulinData.js')
    content = src.read_text(encoding='utf-8')
    start = content.index('{')
    end = content.rindex('}')
    data = json.loads(content[start:end + 1])
    all_exercises = {}
    all_stats = {}
    
    # Targets: Comprehensive reading exercises with discourse markers + adverbs focus
    chapter_targets = {
        'chapter_8': 35,   # Les 8: Vier Hollandse legendes (5 pages)
        'chapter_9': 35,   # Les 9: Nederland waterlaboratorium (4 pages)
        'chapter_10': 30,  # Les 10: Sinterklaas (4 pages)
        'chapter_11': 40,  # Les 11: Zeehelden (6 pages, content-rich)
        'chapter_12': 35,  # Les 12: Museums (4 pages)
        'chapter_13': 35,  # Les 13: Rondje Delft (6 pages)
        'chapter_14': 35,  # Les 14: Dutch design (6 pages)
        'chapter_15': 35,  # Les 15: Nederland 2060 (4 pages)
    }
    
    total_generated = 0
    print("=" * 70)
    print("DERDE RONDE — QUALITY EXERCISE GENERATOR v3")
    print("Focus: Discourse markers, adverbs, grammar terms, diverse vocabulary")
    print("=" * 70)
    
    for ch_key in sorted(data.keys(), key=lambda x: int(x.split('_')[1])):
        ch = data[ch_key]
        if ch_key not in CHAPTER_PAGE_RANGES:
            print(f"\n{ch_key}: SKIPPED (no page range defined)")
            continue
        
        page_start, page_end = CHAPTER_PAGE_RANGES[ch_key]
        clean_text = extract_correct_pages(ch['text'], page_start, page_end)
        target = chapter_targets.get(ch_key, 35)
        
        exercises, stats = generate_exercises(clean_text, target)
        all_stats[ch_key] = stats
        
        # Print quality breakdown
        n_disc = len(stats.get('discourse_markers_used', set()))
        n_adv = len(stats.get('adverbs_used', set()))
        n_gram = len(stats.get('grammar_terms_used', set()))
        n_prop = len(stats.get('proper_nouns_used', set()))
        
        print(f"\n{ch_key} ({ch['title']}):")
        print(f"  Pages {page_start}-{page_end} → {len(clean_text)} chars")
        print(f"  Generated: {len(exercises)} exercises (target {target})")
        print(f"  Quality breakdown:")
        print(f"    Discourse markers: {n_disc} unique  (hoewel, terwijl, daarom, etc.)")
        print(f"    Key adverbs:      {n_adv} unique  (eigenlijk, inmiddels, etc.)")
        print(f"    Grammar terms:    {n_gram} unique  (lidwoord, uitdrukkingen, etc.)")
        print(f"    Proper nouns:     {n_prop} unique  (names, places, brands)")
        
        total_generated += len(exercises)
        all_exercises[ch_key] = {
            'title': ch['title'],
            'exercises': exercises,
        }
    
    print(f"\n{'=' * 70}")
    print(f"TOTAL: {total_generated} exercises across {len(all_exercises)} chapters")
    print(f"{'=' * 70}")
    
    out = []
    out.append('// Auto-generated comprehensive reading comprehension exercises v3')
    out.append('// Extracted from Derde Ronde chapters 8-15 (correct page ranges)')
    out.append('// Format: Full paragraphs (4-6 sentences) with 6-8 strategic blanks each')
    out.append('// Focus: Discourse markers (hoewel, terwijl, daarom), key adverbs (eigenlijk, inmiddels),')
    out.append('//        grammar terms (lidwoord, uitdrukkingen), and diverse proper nouns')
    out.append(f'// Total exercises: {total_generated}')
    out.append('export const derdeRondeVulinData = {')
    chapters = sorted(all_exercises.keys(), key=lambda x: int(x.split('_')[1]))
    for ci, ch_key in enumerate(chapters):
        ch = all_exercises[ch_key]
        comma = ',' if ci < len(chapters) - 1 else ''
        out.append(f'  "{ch_key}": {{')
        out.append(f'    "title": "{ch["title"]}",')
        out.append('    "exercises": [')
        for ei, ex in enumerate(ch['exercises']):
            ec = ',' if ei < len(ch['exercises']) - 1 else ''
            out.append('      {')
            out.append(f'        "paragraph": {json.dumps(ex["paragraph"], ensure_ascii=False)},')
            out.append(f'        "blanked": {json.dumps(ex["blanked"], ensure_ascii=False)},')
            out.append(f'        "answers": {json.dumps(ex["answers"], ensure_ascii=False)},')
            out.append(f'        "hints": {json.dumps(ex["hints"], ensure_ascii=False)}')
            out.append(f'      }}{ec}')
        out.append('    ]')
        out.append(f'  }}{comma}')
    out.append('};')
    dst.write_text('\n'.join(out) + '\n', encoding='utf-8')
    print(f'\nWrote {dst} with {total_generated} total exercises')


if __name__ == '__main__':
    main()

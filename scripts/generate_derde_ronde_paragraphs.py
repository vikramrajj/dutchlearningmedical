#!/usr/bin/env python3
"""Generate multi-blank Derde Ronde exercises from raw chapter text.
Extracts both paragraph-level (2-4 blanks) and sentence-level (1-2 blanks) exercises.
Target: 32 exercises per chapter."""
import json
import random
import re
from pathlib import Path

random.seed(42)

SECTION_HEADERS = [
    'ONDER DE LOEP', 'GRAMMATICA', 'SAMENVATTENDE', 'GATENTEKST',
    'VRAGEN BIJ DE TEKST', 'SCHRIJFOPDRACHT', 'SPREEKOPDRACHT',
    'LUISTEROPDRACHT', 'LEESOPDRACHT', 'OEFENING'
]

DO_NOT_BLANK = {
    'de', 'het', 'een', 'en', 'van', 'in', 'op', 'met', 'voor', 'dat', 'die',
    'dit', 'niet', 'is', 'was', 'aan', 'als', 'om', 'naar', 'wordt', 'zijn',
    'we', 'wij', 'ik', 'je', 'u', 'hij', 'zij', 'ze', 'jullie', 'ons', 'hun',
    'hen', 'hem', 'haar', 'me', 'mij', 'jou', 'uit', 'maar', 'of', 'door',
    'bij', 'na', 'tot', 'dan', 'nog', 'wel', 'er', 'zo', 'nu', 'toen', 'al',
    'mijn', 'jouw', 'haar', 'zijn', 'geen', 'veel', 'meer', 'minder', 'groot',
    'klein', 'goed', 'slecht', 'oud', 'nieuw', 'gaat', 'gaan', 'komt', 'komen',
    'kunt', 'kunnen', 'zullen', 'moet', 'moeten', 'zegt', 'ziet', 'heb', 'heeft',
    'hebben', 'had', 'zou', 'omdat', 'want', 'dus', 'iets', 'iemand', 'alles',
    'iedereen', 'niemand', 'deze', 'die', 'toch', 'net', 'nogal', 'heel', 'zeer',
    'ook', 'dan', 'eens', 'daar', 'hier', 'waar', 'hoe',
    'wat', 'wie', 'welke', 'doen', 'doet', 'deed', 'gedaan', 'kom', 'laat',
    'laten', 'liet', 'krijgt', 'krijgen', 'kreeg', 'maak', 'maakt', 'maakte',
    'gemaakt', 'geeft', 'geven', 'gegeven', 'staat', 'staan', 'stond', 'ligt',
    'liggen', 'lag', 'zit', 'zitten', 'zat', 'loop', 'lopen', 'liep',
}

WORD_RE = re.compile(r"[A-Za-zÀ-ÿ’'-]+")


def clean_text(text: str) -> str:
    text = text.replace('\ufb01', 'fi').replace('\ufb02', 'fl')
    text = text.replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    text = re.sub(r'\d{2,3}\s+Derde Ronde Nederlands voor buitenlanders\s*', '', text)
    text = re.sub(r'\bLes\s+\d+\b', ' ', text)
    text = re.sub(r'(?m)^(?:\s*\d{1,3}){3,}\s*$', '\n', text)
    text = re.sub(r'(?<!\d)(?:\s*\d{1,3}){3,}(?!\d)', ' ', text)
    text = re.sub(r'fig\.?.*?\.', '', text, flags=re.IGNORECASE)
    # Remove standalone page numbers and stray digits at start of text
    text = re.sub(r'^\d{1,3}\s+', '', text)
    text = re.sub(r'\s+\d{1,3}\s+(?=[A-Z])', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def is_exercise_page(text: str) -> bool:
    upper = text.upper()
    if '_____' in text:
        return True
    if any(header in upper for header in SECTION_HEADERS):
        return True
    if re.search(r'Opdracht\s+\d', text):
        return True
    return False


def split_sentences(text: str) -> list[str]:
    """Split text into individual sentences."""
    raw = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“‘’(])', text)
    return [s.strip() for s in raw if s.strip() and len(s.strip()) > 20]


def split_into_chunks(text: str, min_len: int = 50, max_len: int = 500) -> list[str]:
    """Split long text into paragraph-sized chunks at sentence boundaries."""
    sentences = split_sentences(text)
    chunks = []
    current = ''

    for sentence in sentences:
        if current and len(current) + 1 + len(sentence) > max_len:
            if len(current) >= min_len:
                chunks.append(current.strip())
            current = sentence
            continue
        current = f"{current} {sentence}".strip() if current else sentence
        if len(current) >= max_len:
            if len(current) >= min_len:
                chunks.append(current.strip())
            current = ''

    if current.strip() and len(current.strip()) >= min_len:
        if chunks and len(chunks[-1]) + 1 + len(current.strip()) <= max_len:
            chunks[-1] = f"{chunks[-1]} {current.strip()}"
        else:
            chunks.append(current.strip())

    return chunks


def split_paragraphs(page_text: str) -> list[str]:
    """Split a page into paragraphs; break long paragraphs into chunks."""
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', page_text) if p.strip()]
    output = []
    for paragraph in paragraphs:
        if len(paragraph) <= 500:
            output.append(paragraph)
        else:
            output.extend(split_into_chunks(paragraph))
    return output


def tokenize(text: str) -> list[str]:
    return re.findall(r"[A-Za-zÀ-ÿ’'-]+|[^A-Za-zÀ-ÿ’'-]+", text)


def is_candidate_word(word: str, position: int, tokens: list[str]) -> bool:
    cleaned = word.strip("'’-.,;:!?()[]\"“”»«")
    if len(cleaned) < 4:
        return False
    lowered = cleaned.lower()
    if lowered in DO_NOT_BLANK:
        return False
    if re.fullmatch(r'\d+', cleaned):
        return False
    if position == 0 and cleaned[0].isupper():
        return False
    if cleaned.isupper() and len(cleaned) <= 3:
        return False
    return True


def score_candidate(idx: int, word: str, total_tokens: int) -> int:
    """Score a candidate word for blank selection. Higher = better to blank."""
    score = len(re.sub(r"[^A-Za-zÀ-ÿ’'-]", '', word))
    if 5 <= score <= 14:
        score += 3
    # Prefer words in the central 60% of the text
    if total_tokens * 0.2 < idx < total_tokens * 0.8:
        score += 2
    if word[0].isupper():
        score += 1
    return score


def select_blanks(tokens: list[str], min_blanks: int = 1, max_blanks: int = 4) -> list[int]:
    """Select which words to blank out. Returns list of token indices."""
    candidates = []
    for i, token in enumerate(tokens):
        if WORD_RE.fullmatch(token) and is_candidate_word(token, i, tokens):
            candidates.append((i, token))

    if len(candidates) < min_blanks:
        return []

    scored = [(score_candidate(idx, word, len(tokens)), idx, word) for idx, word in candidates]
    scored.sort(key=lambda item: (-item[0], item[1]))

    chosen = []
    used_positions = []
    for _, idx, _ in scored:
        if any(abs(idx - prev) < 3 for prev in used_positions):
            continue
        chosen.append(idx)
        used_positions.append(idx)
        if len(chosen) >= max_blanks:
            break

    if len(chosen) < min_blanks and len(candidates) >= min_blanks:
        chosen = [idx for _, idx, _ in scored[:min_blanks]]
        chosen.sort()

    return sorted(chosen)


def build_blank_exercise(text: str, blanks: list[int]) -> dict | None:
    """Build an exercise dict from text and blank positions."""
    tokens = tokenize(text)
    answers = []
    for idx in blanks:
        word = tokens[idx].strip("'’-.,;:!?()[]\"“”»«")
        if not word:
            return None
        answers.append(word)
        tokens[idx] = '_____'

    blanked_text = ''.join(tokens)
    hints = [
        f"Begint met '{answer[0].upper()}' — {len(answer)} letters"
        for answer in answers
    ]

    return {
        'paragraph': text,
        'blanked': blanked_text,
        'answers': answers,
        'hints': hints,
    }


def build_exercises(text: str, max_per_chapter: int = 32) -> list[dict]:
    """Build all exercises for one chapter from its raw text."""
    pages = text.split('\n\n')

    # --- Source 1: Reading pages → paragraph-level exercises ---
    reading_pages = [clean_text(page) for page in pages if not is_exercise_page(page)]
    paragraphs = []
    for page in reading_pages:
        for paragraph in split_paragraphs(page):
            para = paragraph.strip()
            if len(para) < 50:
                continue
            if para.startswith('Les ') or para.startswith('Derde Ronde'):
                continue
            if para.count(' ') < 8:
                continue
            paragraphs.append(para)

    # Build paragraph-level exercises (2-4 blanks)
    para_exercises = []
    for paragraph in paragraphs:
        tokens = tokenize(paragraph)
        n_candidates = sum(1 for i, t in enumerate(tokens)
                          if WORD_RE.fullmatch(t) and is_candidate_word(t, i, tokens))
        if n_candidates < 2:
            continue
        n_blanks = min(4, max(2, n_candidates // 5))
        blank_idxs = select_blanks(tokens, min_blanks=2, max_blanks=n_blanks)
        if not blank_idxs or len(blank_idxs) < 2:
            continue
        ex = build_blank_exercise(paragraph, blank_idxs)
        if ex and len(ex['answers']) >= 2:
            para_exercises.append(ex)

    # --- Source 2: Individual sentences → 1-2 blank exercises ---
    sentence_exercises = []
    seen_texts = set()
    for page in reading_pages:
        for sentence in split_sentences(page):
            s = sentence.strip()
            if len(s) < 30 or s.count(' ') < 5:
                continue
            if s in seen_texts:
                continue
            seen_texts.add(s)

            tokens = tokenize(s)
            n_candidates = sum(1 for i, t in enumerate(tokens)
                              if WORD_RE.fullmatch(t) and is_candidate_word(t, i, tokens))
            if n_candidates < 1:
                continue
            n_blanks = min(2, n_candidates)
            blank_idxs = select_blanks(tokens, min_blanks=1, max_blanks=n_blanks)
            if not blank_idxs:
                continue
            ex = build_blank_exercise(s, blank_idxs)
            if ex and len(ex['answers']) >= 1:
                sentence_exercises.append(ex)

    # --- Combine & deduplicate ---
    all_exercises = []
    seen_answers = set()

    for ex in para_exercises + sentence_exercises:
        # Quality filters
        para = ex['paragraph']
        if len(para) < 30:
            continue
        if len(set(a.lower() for a in ex['answers'])) < len(ex['answers']):
            continue  # duplicate answers
        if re.search(r'(?<!\w)\d{1,3}(?!\w)', para) and len(para) < 80:
            continue  # short text with stray numbers
        if para.count('_____') == 0 and ex['blanked'].count('_____') < 1:
            continue

        key = '|'.join(sorted(a.lower() for a in ex['answers']))
        if key in seen_answers:
            continue
        seen_answers.add(key)
        all_exercises.append(ex)

    random.shuffle(all_exercises)
    return all_exercises[:max_per_chapter]


def main() -> None:
    src = Path('scripts/derdeRondeData.js')
    dst = Path('scripts/derdeRondeVulinData.js')

    content = src.read_text(encoding='utf-8')
    start = content.index('{')
    end = content.rindex('}')
    data = json.loads(content[start:end+1])

    all_exercises = {}
    for ch_key in sorted(data.keys(), key=lambda x: int(x.split('_')[1])):
        ch = data[ch_key]
        exercises = build_exercises(ch['text'], max_per_chapter=32)
        print(f"{ch_key}: generated {len(exercises)} exercises")
        all_exercises[ch_key] = {
            'title': ch['title'],
            'exercises': exercises,
        }

    out = []
    out.append('// Auto-generated multi-blank fill-in-the-blank exercises')
    out.append('// Extracted from Derde Ronde chapters 8-15')
    out.append('// Target: 32 exercises per chapter')
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
    total = sum(len(ch['exercises']) for ch in all_exercises.values())
    print(f'Wrote {dst} with {total} total exercises')


if __name__ == '__main__':
    main()

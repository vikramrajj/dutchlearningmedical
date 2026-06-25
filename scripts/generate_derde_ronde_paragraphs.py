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

# Words that should never be blanked (function words, common verbs)
DO_NOT_BLANK = {
    'de', 'het', 'een', 'en', 'van', 'in', 'op', 'met', 'voor', 'dat', 'die',
    'dit', 'niet', 'is', 'was', 'aan', 'als', 'om', 'naar', 'wordt', 'zijn',
    'we', 'wij', 'ik', 'je', 'u', 'hij', 'zij', 'ze', 'jullie', 'ons', 'hun',
    'hen', 'hem', 'haar', 'me', 'mij', 'jou', 'uit', 'maar', 'of', 'door',
    'bij', 'na', 'tot', 'dan', 'nog', 'wel', 'er', 'zo', 'nu', 'toen', 'al',
    'mijn', 'jouw', 'zijn', 'geen', 'veel', 'meer', 'minder', 'groot',
    'klein', 'goed', 'slecht', 'oud', 'nieuw', 'gaat', 'gaan', 'komt', 'komen',
    'kunt', 'kunnen', 'zullen', 'moet', 'moeten', 'zegt', 'ziet', 'heb', 'heeft',
    'hebben', 'had', 'zou', 'omdat', 'want', 'dus', 'iets', 'iemand', 'alles',
    'iedereen', 'niemand', 'deze', 'toch', 'net', 'nogal', 'heel', 'zeer',
    'ook', 'dan', 'eens', 'daar', 'hier', 'waar', 'hoe',
    'wat', 'wie', 'welke', 'doen', 'doet', 'deed', 'gedaan', 'kom', 'laat',
    'laten', 'liet', 'krijgt', 'krijgen', 'kreeg', 'maak', 'maakt', 'maakte',
    'gemaakt', 'geeft', 'geven', 'gegeven', 'staat', 'staan', 'stond', 'ligt',
    'liggen', 'lag', 'zit', 'zitten', 'zat', 'loop', 'lopen', 'liep',
    'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien',
    'honderd', 'duizend', 'eerste', 'tweede', 'derde', 'laatste',
    'jaar', 'tijd', 'dag', 'week', 'maand', 'uur', 'minuut',
    'heer', 'mevrouw', 'meneer', 'dank', 'wel', 'alsjeblieft', 'alstublieft',
    'toen', 'daarna', 'vervolgens', 'tenslotte', 'eindelijk',
    'bijvoorbeeld', 'ongeveer', 'precies', 'misschien', 'natuurlijk',
}

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
    cleaned = word.strip(STRIP_CHARS)
    if len(cleaned) < 4:
        return False
    if cleaned.lower() in DO_NOT_BLANK:
        return False
    if re.fullmatch(r'\d+', cleaned):
        return False
    if cleaned.isupper() and len(cleaned) <= 3:
        return False
    return True


def select_blanks(tokens: list[str], n_blanks: int,
                  avoid_positions: set = None) -> list[int]:
    if avoid_positions is None:
        avoid_positions = set()
    candidates = []
    for i, token in enumerate(tokens):
        if i in avoid_positions:
            continue
        if WORD_RE.fullmatch(token) and is_content_word(token):
            word = token.strip(STRIP_CHARS)
            score = len(word)
            if 5 <= len(word) <= 14:
                score += 3
            if word[0].isupper():
                score += 1
            candidates.append((score, i, word))
    if len(candidates) < n_blanks:
        return []
    candidates.sort(key=lambda x: -x[0])
    chosen = []
    for _, idx, _ in candidates:
        if any(abs(idx - prev) < 3 for prev in chosen):
            continue
        chosen.append(idx)
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
    text = clean_reading_text(reading_text)
    if len(text) < 500:
        return []
    all_exercises = []
    seen_answers = set()
    paragraphs = split_paragraphs(text)
    sentences = split_sentences(text)

    # Source 1: Paragraph exercises (2-3 blanks)
    for para in paragraphs:
        if len(para) < 60:
            continue
        tokens = tokenize(para)
        n_candidates = sum(1 for i, t in enumerate(tokens)
                          if WORD_RE.fullmatch(t) and is_content_word(t))
        if n_candidates < 4:
            continue
        for n_blanks in [2, 3]:
            if n_candidates < n_blanks * 2:
                continue
            for _ in range(3):
                idxs = select_blanks(tokens, n_blanks)
                if not idxs:
                    continue
                ex = build_exercise(para, idxs)
                if not ex:
                    continue
                key = '|'.join(sorted(a.lower() for a in ex['answers']))
                if key in seen_answers:
                    continue
                seen_answers.add(key)
                all_exercises.append(ex)
                break

    # Source 2: 2-3 sentence group exercises
    for group_size in [2, 3]:
        groups = build_sentence_groups(sentences, group_size)
        for group in groups:
            tokens = tokenize(group)
            n_candidates = sum(1 for i, t in enumerate(tokens)
                              if WORD_RE.fullmatch(t) and is_content_word(t))
            if n_candidates < 4:
                continue
            n_blanks = 2 if group_size == 2 else 3
            idxs = select_blanks(tokens, min(3, n_blanks))
            if not idxs or len(idxs) < 2:
                continue
            ex = build_exercise(group, idxs)
            if not ex:
                continue
            key = '|'.join(sorted(a.lower() for a in ex['answers']))
            if key in seen_answers:
                continue
            seen_answers.add(key)
            all_exercises.append(ex)

    # Source 3: Single-sentence exercises (1-2 blanks)
    for s in sentences:
        if len(s) < 25:
            continue
        tokens = tokenize(s)
        n_candidates = sum(1 for i, t in enumerate(tokens)
                          if WORD_RE.fullmatch(t) and is_content_word(t))
        if n_candidates < 1:
            continue
        n_blanks = 1 if n_candidates < 3 else 2
        idxs = select_blanks(tokens, n_blanks)
        if not idxs:
            continue
        ex = build_exercise(s, idxs)
        if not ex:
            continue
        key = '|'.join(sorted(a.lower() for a in ex['answers']))
        if key in seen_answers:
            continue
        seen_answers.add(key)
        all_exercises.append(ex)

    # Quality filtering
    filtered = []
    for ex in all_exercises:
        para = ex['paragraph']
        answers = ex['answers']
        if len(para) < 20:
            continue
        if len(set(a.lower() for a in answers)) < len(answers):
            continue
        if re.search(r'(?<!\w)\d{1,3}(?!\w)', para) and len(para) < 80:
            continue
        if ex['blanked'].count('_____') != len(answers):
            continue
        para_lower = para.lower()
        if not all(a.lower() in para_lower for a in answers):
            continue
        filtered.append(ex)
    random.shuffle(filtered)
    return filtered[:target_count]


def main() -> None:
    src = Path('scripts/derdeRondeData.js')
    dst = Path('scripts/derdeRondeVulinData.js')
    content = src.read_text(encoding='utf-8')
    start = content.index('{')
    end = content.rindex('}')
    data = json.loads(content[start:end + 1])
    all_exercises = {}
    for ch_key in sorted(data.keys(), key=lambda x: int(x.split('_')[1])):
        ch = data[ch_key]
        if ch_key not in CHAPTER_PAGE_RANGES:
            print(f"{ch_key}: SKIPPED (no page range defined)")
            continue
        page_start, page_end = CHAPTER_PAGE_RANGES[ch_key]
        num_pages = page_end - page_start + 1
        clean_text = extract_correct_pages(ch['text'], page_start, page_end)
        print(f"{ch_key}: extracted {len(clean_text)} chars from pages {page_start}-{page_end}")
        target = min(135, num_pages * 30)
        exercises = generate_exercises(clean_text, target)
        print(f"{ch_key}: generated {len(exercises)} exercises (target {target})")
        all_exercises[ch_key] = {
            'title': ch['title'],
            'exercises': exercises,
        }
    out = []
    out.append('// Auto-generated fill-in-the-blank exercises')
    out.append('// Extracted from Derde Ronde chapters 8-15 (correct page ranges)')
    out.append('// Based on book-style: key content words blanked from meaningful text')
    out.append(f'// Total exercises: {sum(len(ch["exercises"]) for ch in all_exercises.values())}')
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

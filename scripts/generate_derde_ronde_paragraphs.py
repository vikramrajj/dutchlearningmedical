#!/usr/bin/env python3
"""Generate paragraph-level multi-blank Derde Ronde exercises from raw chapter text."""
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
    'iedereen', 'niemand', 'dat', 'dit', 'een', 'deze', 'die', 'dat', 'toch',
    'net', 'nogal', 'heel', 'heel', 'zeer', 'minder', 'veel', 'meer', 'minder',
}

WORD_RE = re.compile(r"[A-Za-zÀ-ÿ’'-]+")


def clean_text(text: str) -> str:
    text = text.replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    text = re.sub(r'\d{2,3}\s+Derde Ronde Nederlands voor buitenlanders\s*', '', text)
    text = re.sub(r'\bLes\s+\d+\b', ' ', text)
    text = re.sub(r'(?m)^(?:\s*\d{1,3}){3,}\s*$', '\n', text)
    text = re.sub(r'(?<!\d)(?:\s*\d{1,3}){3,}(?!\d)', ' ', text)
    text = re.sub(r'fig\.?.*?\.', '', text, flags=re.IGNORECASE)
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


def split_into_chunks(text: str, min_len: int = 120, max_len: int = 420) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9"“‘’])', text)
    chunks = []
    current = ''

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        if current and len(current) + 1 + len(sentence) > max_len:
            if len(current) >= min_len:
                chunks.append(current.strip())
            current = sentence
            continue
        current = f"{current} {sentence}".strip() if current else sentence
        if len(current) >= max_len:
            chunks.append(current.strip())
            current = ''

    if current.strip():
        if chunks and len(chunks[-1]) + 1 + len(current.strip()) <= max_len:
            chunks[-1] = f"{chunks[-1]} {current.strip()}"
        else:
            chunks.append(current.strip())

    return [chunk for chunk in chunks if len(chunk) >= min_len]


def split_paragraphs(page_text: str) -> list[str]:
    paragraphs = [p.strip() for p in re.split(r'\n\s*\n', page_text) if p.strip()]
    output = []
    for paragraph in paragraphs:
        if len(paragraph) <= 420:
            output.append(paragraph)
        else:
            output.extend(split_into_chunks(paragraph))
    return output


def tokenize(paragraph: str) -> list[str]:
    return re.findall(r"[A-Za-zÀ-ÿ’'-]+|[^A-Za-zÀ-ÿ’'-]+", paragraph)


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


def select_blanks(tokens: list[str], max_blanks: int = 4) -> list[int]:
    candidates = []
    for i, token in enumerate(tokens):
        if WORD_RE.fullmatch(token) and is_candidate_word(token, i, tokens):
            candidates.append((i, token))

    if len(candidates) < 3:
        return []

    # Prefer longer and more central words
    scored = []
    total = len(tokens)
    for idx, word in candidates:
        score = len(re.sub(r"[^A-Za-zÀ-ÿ’'-]", '', word))
        if 4 <= score <= 12:
            score += 2
        if idx > total * 0.3 and idx < total * 0.7:
            score += 2
        if word[0].isupper():
            score += 1
        scored.append((score, idx, word))

    scored.sort(key=lambda item: (-item[0], item[1]))
    chosen = []
    used = []
    for _, idx, _ in scored:
        if any(abs(idx - prev) < 4 for prev in used):
            continue
        chosen.append(idx)
        used.append(idx)
        if len(chosen) >= max_blanks:
            break

    if len(chosen) < 3 and len(candidates) >= 3:
        chosen = [idx for _, idx, _ in scored[:3]]
        chosen.sort()

    return sorted(chosen)


def build_blank_exercise(paragraph: str, blanks: list[int]) -> dict | None:
    tokens = tokenize(paragraph)
    answers = []
    for idx in blanks:
        word = tokens[idx].strip("'’-.,;:!?()[]\"“”»«")
        if not word:
            return None
        answers.append(word)
        tokens[idx] = '_____'

    blanked_text = ''.join(tokens)
    hints = [f"Begint met '{answer[0].upper()}' — {len(answer)} letters" for answer in answers]

    return {
        'paragraph': paragraph,
        'blanked': blanked_text,
        'answers': answers,
        'hints': hints,
    }


def build_exercises(text: str, max_per_chapter: int = 8) -> list[dict]:
    pages = text.split('\n\n')
    reading_pages = [clean_text(page) for page in pages if not is_exercise_page(page)]
    paragraphs = []
    for page in reading_pages:
        for paragraph in split_paragraphs(page):
            if len(paragraph) < 120 or len(paragraph) > 420:
                continue
            if paragraph.startswith('Les ') or paragraph.startswith('Derde Ronde'):
                continue
            if paragraph.count(' ') < 25:
                continue
            paragraphs.append(paragraph)

    exercises = []
    for paragraph in paragraphs:
        tokens = tokenize(paragraph)
        blank_idxs = select_blanks(tokens, max_blanks=4)
        if not blank_idxs:
            continue
        ex = build_blank_exercise(paragraph, blank_idxs)
        if not ex:
            continue
        if len(ex['answers']) < 3:
            continue
        exercises.append(ex)

    random.shuffle(exercises)
    return exercises[:max_per_chapter]


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
        exercises = build_exercises(ch['text'], max_per_chapter=8)
        print(f"{ch_key}: generated {len(exercises)} paragraph exercises")
        all_exercises[ch_key] = {
            'title': ch['title'],
            'exercises': exercises,
        }

    out = []
    out.append('// Auto-generated paragraph-level fill-in-the-blank exercises')
    out.append('// Extracted from Derde Ronde chapters 8-15')
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
    print(f'Wrote {dst} with {total} exercises')


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Generate single-word fill-in-the-blank exercises from Derde Ronde READING passages.
- Skips exercise pages (SAMENVATTENDE GATENTEKST, VRAGEN, SCHRIJFOPDRACHT, etc.)
- Skips sentences already containing _____ blanks
- Blanks ONE meaningful word per sentence
- Output format matches the textbook: sentence with _____, answer listed separately
"""
import json, re, random

random.seed(42)

# ── Words NOT worth blanking (function words, too common) ──
DO_NOT_BLANK = {
    'de', 'het', 'een', 'ik', 'je', 'jij', 'u', 'hij', 'zij', 'ze', 'we', 'wij',
    'jullie', 'me', 'mij', 'jou', 'hem', 'haar', 'ons', 'hen', 'hun',
    'ja', 'nee', 'niet', 'wel', 'ook', 'nog', 'maar', 'of', 'en', 'dat', 'wat',
    'die', 'deze', 'dit', 'daar', 'hier', 'dan', 'toen', 'nu', 'er', 'zo',
    'aan', 'in', 'op', 'uit', 'naar', 'van', 'voor', 'met', 'tot', 'bij',
    'om', 'te', 'al', 'als', 'is', 'zijn', 'was', 'waren', 'wordt', 'worden',
    'heeft', 'hebben', 'had', 'kan', 'kunt', 'kunnen', 'zal', 'zullen', 'moet',
    'doen', 'gaat', 'gaan', 'komt', 'komen', 'laat', 'maken', 'zegt', 'ziet',
    'door', 'over', 'onder', 'tussen', 'zonder', 'tegen', 'na', 'vooral',
    'dan', 'nog', 'wel', 'eens', 'even', 'gewoon', 'helemaal', 'altijd',
    'nooit', 'soms', 'vaak', 'weer', 'toch', 'dus', 'want', 'omdat',
    'word', 'zou', 'geen', 'veel', 'weinig', 'meer', 'minder', 'groot',
    'klein', 'goed', 'slecht', 'oud', 'nieuw', 'hoog', 'laag', 'lang', 'kort',
}

# ── Section header patterns to skip ──
SECTION_HEADERS = [
    'ONDER DE LOEP', 'GRAMMATICA', 'SAMENVATTENDE', 'GATENTEKST',
    'VRAGEN BIJ DE TEKST', 'SCHRIJFOPDRACHT', 'SPREEKOPDRACHT',
    'LUISTEROPDRACHT', 'LEESOPDRACHT',
]

def is_exercise_page(page_text):
    """Check if a page contains exercise content (not reading material)."""
    t = page_text.upper()
    for header in SECTION_HEADERS:
        if header in t:
            return True
    if '_____' in page_text:
        return True
    if re.search(r'Opdracht\s+\d', page_text):
        return True
    return False

def clean_text(text):
    """Remove metadata, page headers, line numbers, figure refs."""
    # Remove "XX Derde Ronde Nederlands voor buitenlanders" headers
    text = re.sub(r'\d{2,3}\s+Derde Ronde Nederlands voor buitenlanders\s*', '', text)
    # Remove line numbers (sequences of spaced digits)
    text = re.sub(r'\b(\d+\s+){3,}\d+\b', '', text)
    # Remove figure references
    text = re.sub(r'ﬁg\.?\s*\d+[a-z]?(\.\d+)?\s*[^.]*?\.', '', text)
    # Fix ligatures
    text = text.replace('ﬁ', 'fi').replace('ﬂ', 'fl')
    # Fix "s c het s en" → "schetsen" type artifacts
    text = re.sub(r'\b(\w)\s+(\w)\s+(\w)\s+(\w)\b', lambda m: m.group(1)+m.group(2)+m.group(3)+m.group(4), text)
    # Collapse multiple spaces
    text = re.sub(r'\s{2,}', ' ', text)
    return text

def is_good_sentence(s):
    """Check if a sentence is a valid reading sentence for blanking."""
    s = s.strip()
    if len(s) < 40 or len(s) > 300:
        return False
    # Skip if it starts with a digit/bullet (question number, list item)
    if re.match(r'^[\d\s•\-–]', s):
        return False
    # Skip if contains _____ (already an exercise)
    if '_____' in s:
        return False
    # Skip section headers
    s_upper = s.upper()
    for header in SECTION_HEADERS:
        if header in s_upper:
            return False
    low = s.lower()[:40]
    skip_starts = ['schrijf', 'opdracht', 'vul de', 'vraag', 'bespreek', 'noteer',
                   'rapporteer', 'discussieer', 'verdeel', 'notulen', 'aanwezig',
                   'agendapunt', 'ingekomen', 'actieve vorm', 'passieve vorm',
                   'constructies', 'let op', 'voorbeeld']
    if any(x in low for x in skip_starts):
        return False
    # Need enough words
    words = s.split()
    if len(words) < 6:
        return False
    # Skip if looks like a page number
    if re.match(r'^\d{2,3}\s', s):
        return False
    return True

def select_word_to_blank(sentence):
    """Select the best single word to blank. Returns (raw_word, position)."""
    words = sentence.split()
    if len(words) < 6:
        return None, None

    candidates = []
    for i, w in enumerate(words):
        w_clean = w.strip('.,;:!?()"\'').lower()

        # Skip function words
        if w_clean in DO_NOT_BLANK:
            continue
        # Skip too short
        if len(w_clean) < 3:
            continue
        # Skip first word if capitalized (usually sentence start)
        if i == 0 and w[0].isupper():
            continue
        # Skip numbers
        if re.match(r'^\d+[.,]?\d*$|^\d{4}$', w):
            continue
        # Skip fragments with ellipsis
        if '…' in w or '...' in w:
            continue
        # Skip words with slashes (e.g., "aardig/knap")
        if '/' in w:
            continue
        # Skip if already partially blanked (from GATENTEKST artifacts)
        if re.match(r'^\w\s+_', w):
            continue

        # Score the word
        score = len(w_clean)
        # Boost capitalized words (Dutch nouns in mid-sentence)
        if i > 0 and w[0].isupper() and w[0].isalpha():
            score += 6
        # Sweet spot: 4-11 letters
        if 4 <= len(w_clean) <= 11:
            score += 3
        # Center positions are better
        if 3 <= i <= len(words) - 3:
            score += 2

        candidates.append((i, w, score))

    if not candidates:
        return None, None

    candidates.sort(key=lambda x: -x[2])
    top_score = candidates[0][2]
    top = [c for c in candidates if c[2] >= top_score - 5]
    chosen = random.choice(top)
    return chosen[1], chosen[0]


def main():
    with open("scripts/derdeRondeData.js") as f:
        content = f.read()
    start = content.index("{")
    end = content.rindex("}")
    data = json.loads(content[start:end+1])

    all_exercises = {}
    seen_norms = set()

    for ch_key in sorted(data.keys()):
        ch_num = int(ch_key.split("_")[1])
        title = data[ch_key]["title"]
        text = data[ch_key]["text"]

        # Split into pages, keep only reading pages
        pages = text.split("\n\n")
        reading_pages = [p for p in pages if not is_exercise_page(p)]

        exercises = []
        for page in reading_pages:
            cleaned = clean_text(page)
            sentences = re.split(r'(?<=[.!?])\s+', cleaned)

            for s in sentences:
                s = s.strip()
                if not is_good_sentence(s):
                    continue

                # Deduplicate
                norm = re.sub(r'\s+', ' ', s).strip().lower()
                if norm in seen_norms:
                    continue
                seen_norms.add(norm)

                word_to_blank, pos = select_word_to_blank(s)
                if word_to_blank is None:
                    continue

                words = s.split()
                answer_raw = words[pos]
                answer = answer_raw.strip('.,;:!?()"\'')

                if len(answer) < 3:
                    continue
                if '/' in answer:
                    continue

                # Build blanked sentence
                words[pos] = '__________'
                blanked = ' '.join(words)
                # Fix punctuation spacing
                blanked = re.sub(r'\s+([.,;:!?)])', r'\1', blanked)
                blanked = re.sub(r'([(])\s+', r'\1', blanked)

                hint = f"Begint met '{answer[0].upper()}' — {len(answer)} letters"

                exercises.append({
                    "sentence": s,
                    "blanked": blanked,
                    "answer": answer,
                    "hint": hint,
                    "chapter": ch_num,
                })

        # Cap per chapter at 32, prefer variety in answer length
        TARGET = 32
        if len(exercises) > TARGET:
            exercises.sort(key=lambda x: len(x['answer']))
            step = max(1, len(exercises) // TARGET)
            exercises = exercises[::step][:TARGET]
            random.shuffle(exercises)

        all_exercises[ch_key] = exercises
        print(f"  {ch_key} ({title}): {len(exercises)} exercises from {len(reading_pages)} reading pages")

    # ── Write JS output ──
    out = []
    out.append("// Auto-generated single-word fill-in-the-blank exercises")
    out.append("// Extracted from Derde Ronde reading passages (chapters 8-15)")
    out.append("// Pattern: one word blanked per sentence, answer at end of line")
    out.append("export const derdeRondeVulinData = {")

    sorted_keys = sorted(all_exercises.keys())
    for idx, ch_key in enumerate(sorted_keys):
        ch = data[ch_key]
        ex_list = all_exercises[ch_key]
        comma = "," if idx < len(sorted_keys) - 1 else ""
        out.append(f'  "{ch_key}": {{')
        out.append(f'    "title": "{ch["title"]}",')
        out.append(f'    "exercises": [')
        for ei, ex in enumerate(ex_list):
            ec = "," if ei < len(ex_list) - 1 else ""
            out.append(f'      {{')
            out.append(f'        "sentence": {json.dumps(ex["sentence"], ensure_ascii=False)},')
            out.append(f'        "blanked": {json.dumps(ex["blanked"], ensure_ascii=False)},')
            out.append(f'        "answer": {json.dumps(ex["answer"], ensure_ascii=False)},')
            out.append(f'        "hint": {json.dumps(ex["hint"], ensure_ascii=False)}')
            out.append(f'      }}{ec}')
        out.append(f'    ]')
        out.append(f'  }}{comma}')
    out.append("};")

    outfile = "scripts/derdeRondeVulinData.js"
    with open(outfile, "w") as f:
        f.write("\n".join(out) + "\n")

    total = sum(len(v) for v in all_exercises.values())
    print(f"\nDone! {total} exercises across {len(all_exercises)} chapters → {outfile}")


if __name__ == "__main__":
    main()

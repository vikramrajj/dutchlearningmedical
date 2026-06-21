#!/usr/bin/env python3
"""Download Derde Ronde SVGs and extract text for chapters 8-15."""
import re, json, urllib.request, sys, time

BASE = "https://svg.issuu.com/220429121522-d7dffa5c727199bd66086e9fbb06e580"

def fetch_svg_text(page_num):
    """Fetch an SVG page and extract text from textPath elements."""
    url = f"{BASE}/page_{page_num}.svg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            svg = resp.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  ERROR page {page_num}: {e}", file=sys.stderr)
        return ""
    
    # Extract textPath content
    texts = re.findall(r'<textPath[^>]*>(.*?)</textPath>', svg, re.DOTALL)
    words = []
    for t in texts:
        t = t.strip()
        if t and not t.isspace():
            words.append(t)
    
    return " ".join(words)

def main():
    # Chapter page ranges (inclusive start, exclusive end)
    chapters = {
        8: range(86, 96),
        9: range(96, 106),
        10: range(106, 116),
        11: range(116, 126),
        12: range(126, 136),
        13: range(136, 148),
        14: range(148, 158),
        15: range(158, 170),
    }
    
    all_data = {}
    total_pages = sum(len(r) for r in chapters.values())
    done = 0
    
    for ch_num, page_range in chapters.items():
        print(f"Chapter {ch_num}: pages {page_range.start}-{page_range.stop - 1}")
        ch_text = []
        for page in page_range:
            done += 1
            print(f"  [{done}/{total_pages}] Page {page}...", end=" ", flush=True)
            text = fetch_svg_text(page)
            if text:
                ch_text.append(text)
                print(f"OK ({len(text)} chars)")
            else:
                print("FAILED")
            time.sleep(0.3)  # be gentle
        
        full_text = "\n\n".join(ch_text)
        all_data[f"chapter_{ch_num}"] = {
            "title": f"Les {ch_num}",
            "pages": f"{page_range.start}-{page_range.stop - 1}",
            "text": full_text
        }
    
    # Write to JSON
    outfile = "scripts/derdeRondeData.js"
    with open(outfile, "w") as f:
        f.write("// Auto-generated from Derde Ronde chapters 8-15\n")
        f.write("export const derdeRondeData = ")
        json.dump(all_data, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    
    print(f"\nDone! Saved to {outfile}")
    print(f"Total chapters: {len(all_data)}")

if __name__ == "__main__":
    main()

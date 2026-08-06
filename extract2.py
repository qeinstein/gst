import zlib
import re
import sys

def parse_pdf(pdf_path):
    with open(pdf_path, 'rb') as f:
        content = f.read()

    streams = re.findall(b'stream\r?\n(.*?)\r?\nendstream', content, re.DOTALL)

    all_blocks = []
    for idx, s in enumerate(streams):
        try:
            decompressed = zlib.decompress(s)
        except Exception:
            continue

        bt_blocks = re.findall(rb'BT(.*?)ET', decompressed, re.DOTALL)
        if not bt_blocks:
            continue
        
        stream_text = []
        for bt in bt_blocks:
            lines = []
            for line in bt.splitlines():
                line = line.strip()
                if not line:
                    continue
                tokens = re.findall(rb'\(((?:[^\(\)\\]|\\[\s\S])*)\)|<([0-9a-fA-F]+)>', line)
                if tokens:
                    parts = []
                    for tok in tokens:
                        if tok[0]:
                            cleaned = tok[0].replace(b'\\(', b'(').replace(b'\\)', b')')
                            parts.append(cleaned.decode('latin1', errors='ignore'))
                        elif tok[1]:
                            try:
                                parts.append(bytes.fromhex(tok[1].decode('ascii')).decode('latin1', errors='ignore'))
                            except Exception:
                                pass
                    if parts:
                        lines.append("".join(parts))
            if lines:
                stream_text.append(" ".join(lines))
        if stream_text:
            all_blocks.append("\n".join(stream_text))

    return "\n--- STREAM ---\n".join(all_blocks)

if __name__ == '__main__':
    pdf_path = 'GST 212 COMBINED (1).pdf'
    res = parse_pdf(pdf_path)
    out_path = 'extracted_combined.txt'
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(res)
    print(f"Extracted {len(res)} chars to {out_path}")

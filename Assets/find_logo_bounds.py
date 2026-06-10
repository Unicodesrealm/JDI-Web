import re
import xml.etree.ElementTree as ET

file_path = "/Users/unimac/Documents/+++Designs/Clients/JDI/Website/Assets/Vectorized Logo Backup.svg"

try:
    tree = ET.parse(file_path)
    root = tree.getroot()
    
    # We want to parse the d attribute of paths, and x, y, width, height of rects, and cx, cy, r of circles
    # namespace helper
    ns = {'svg': 'http://www.w3.org/2000/svg'}
    
    all_x = []
    all_y = []
    
    def parse_path_coords(d):
        # find all numbers in d
        numbers = [float(x) for x in re.findall(r'[-+]?\d*\.\d+|\d+', d)]
        # This is a rough estimation of coordinates since they could be relative,
        # but since illustrator SVGs use absolute coordinates for major points (M, L, C),
        # this will give us a very good range.
        return numbers

    # Parse paths
    for path in root.findall('.//svg:path', ns):
        d = path.attrib.get('d', '')
        coords = parse_path_coords(d)
        # Alternate coordinates: let's assume they are x, y pairs if we filter out commands
        # Let's extract numbers and check their values
        # To be safe, we can parse numbers. We know X coordinates are usually around 500-1400,
        # and Y coordinates are usually around 300-800.
        for idx, val in enumerate(coords):
            # We can distinguish X and Y by parsing the path string properly or by range
            pass
            
    # Let's print all attributes of elements to inspect them manually
    print("--- SVG Elements and their key spatial attributes ---")
    for child in root.iter():
        tag = child.tag.split('}')[-1]
        if tag == "path":
            d = child.attrib.get('d', '')
            # Find all numbers in d
            nums = [float(n) for n in re.findall(r'[-+]?\d*\.\d+|\d+', d)]
            xs = nums[0::2]
            ys = nums[1::2]
            if xs and ys:
                print(f"Path: id={child.attrib.get('id', 'none')}, class={child.attrib.get('class', 'none')}")
                print(f"  X-range: {min(xs):.2f} to {max(xs):.2f} | Y-range: {min(ys):.2f} to {max(ys):.2f}")
        elif tag == "rect":
            x = float(child.attrib.get('x', 0))
            y = float(child.attrib.get('y', 0))
            w = float(child.attrib.get('width', 0))
            h = float(child.attrib.get('height', 0))
            print(f"Rect: x={x}, y={y}, w={w}, h={h} -> X-range: {x:.2f} to {x+w:.2f} | Y-range: {y:.2f} to {y+h:.2f}")
        elif tag == "circle":
            cx = float(child.attrib.get('cx', 0))
            cy = float(child.attrib.get('cy', 0))
            r = float(child.attrib.get('r', 0))
            print(f"Circle: cx={cx}, cy={cy}, r={r} -> X-range: {cx-r:.2f} to {cx+r:.2f} | Y-range: {cy-r:.2f} to {cy+r:.2f}")
        elif tag == "text":
            trans = child.attrib.get('transform', '')
            print(f"Text: transform={trans}")

except Exception as e:
    print(f"Error: {e}")

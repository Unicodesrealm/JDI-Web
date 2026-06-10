import re

d = "M732.24,350.35v165.9-.09c0,32.98-26.73,59.71-59.71,59.71s-59.71-26.73-59.71-59.71,26.73-59.71,59.71-59.71l8.31-.07.21-51.62-6.21.06c-61.78-.42-109.82,49.05-109.82,109.5s49.01,109.46,109.46,109.46,109.46-49.01,109.46-109.46v1.18-120.72,119.53"

# We split by command letters: M, v, c, s, l, v, etc.
# Let's write a simple parser to compute absolute positions.
commands = re.findall(r'([A-Za-z])|([+-]?\d*\.\d+|[+-]?\d+)', d)

# Reconstruction of command sequence
cmd_seq = []
current_cmd = None
args = []

for letter, number in commands:
    if letter:
        if current_cmd:
            cmd_seq.append((current_cmd, args))
            args = []
        current_cmd = letter
    else:
        args.append(float(number))
if current_cmd:
    cmd_seq.append((current_cmd, args))

print("Command sequence:")
for c, a in cmd_seq:
    print(f"  {c}: {a}")

# Now compute coordinates
current_x = 0.0
current_y = 0.0
points = []

for c, a in cmd_seq:
    if c == 'M':
        current_x = a[0]
        current_y = a[1]
        points.append((current_x, current_y))
    elif c == 'v':
        # v can take multiple arguments! e.g., v 165.9 -0.09
        # So we process arguments in a loop
        for val in a:
            current_y += val
            points.append((current_x, current_y))
    elif c == 'c':
        # c takes 6 arguments per bezier curve
        for i in range(0, len(a), 6):
            # relative coordinates:
            # cp1 = current_x + a[i], current_y + a[i+1]
            # cp2 = current_x + a[i+2], current_y + a[i+3]
            # end = current_x + a[i+4], current_y + a[i+5]
            current_x += a[i+4]
            current_y += a[i+5]
            points.append((current_x, current_y))
    elif c == 's':
        # s takes 4 arguments per bezier curve
        for i in range(0, len(a), 4):
            current_x += a[i+2]
            current_y += a[i+3]
            points.append((current_x, current_y))
    elif c == 'l':
        # l takes 2 arguments per line
        for i in range(0, len(a), 2):
            current_x += a[i]
            current_y += a[i+1]
            points.append((current_x, current_y))
    else:
        print(f"Unknown command {c} with args {a}")

xs = [p[0] for p in points]
ys = [p[1] for p in points]
print(f"\nExact parsed bounds:")
print(f"  X-range: {min(xs):.2f} to {max(xs):.2f}")
print(f"  Y-range: {min(ys):.2f} to {max(ys):.2f}")

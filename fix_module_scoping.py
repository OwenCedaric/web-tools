import os
import re

tools_dir = 'tools'
html_files = [f for f in os.listdir(tools_dir) if f.endswith('.html')]

# Regex for event attributes in HTML tags
EVENT_ATTR_REGEX = re.compile(r'\son[a-z]+=["\']\s*([a-zA-Z0-9_$]+)', re.IGNORECASE)

# Regex for function definitions in JS
FUNC_DEF_REGEX = re.compile(r'(?:function|const|let|var)\s+([a-zA-Z0-9_$]+)\s*(?:=\s*(?:async\s*)?\(|\()')

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Find the module script block
    script_match = re.search(r'(<script type="module">)(.*?)(</script>)', content, re.DOTALL)
    if not script_match:
        return False

    header, script_body, footer = script_match.groups()

    # 2. Find all function names used in event attributes
    html_before_script = content[:script_match.start()]
    html_after_script = content[script_match.end():]
    full_html = html_before_script + html_after_script
    
    used_funcs = set(EVENT_ATTR_REGEX.findall(full_html))

    # 3. Find all function/const names defined in the script block
    defined_funcs = set(FUNC_DEF_REGEX.findall(script_body))
    
    # 4. Handle imports
    imports = set(re.findall(r'import\s+\{([^}]+)\}', script_body))
    for imp_group in imports:
        for imp in imp_group.split(','):
            defined_funcs.add(imp.strip().split(' as ')[-1])

    # 5. Intersect: only expose if USED and DEFINED/IMPORTED
    to_expose = used_funcs.intersection(defined_funcs)
    
    # Identify which functions are already exposed
    # We look for "window.funcName =" globally in the script body
    exposed_pattern = re.compile(r'window\.(\w+)\s*=')
    already_exposed = set(exposed_pattern.findall(script_body))
    
    to_add = to_expose - already_exposed
    
    if not to_add:
        return False

    print(f"Fixing {filepath}: exposing {sorted(to_add)}")

    # Generate the exposure lines
    exposure_lines = "\n        // Expose functions to window for onclick handlers\n"
    for func in sorted(to_add):
        exposure_lines += f"        window.{func} = {func};\n"
    
    # The safest place is at the END of the script, before </script>
    # but inside the module scope.
    
    new_script_body = script_body.rstrip() + exposure_lines + "\n    "
    
    new_content = content[:script_match.start(2)] + new_script_body + content[script_match.end(2):]
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    return True

# First, restore to a clean state to avoid double-appending or mess
import subprocess
subprocess.run(['git', 'restore', 'tools/'], cwd=os.getcwd())

for filename in html_files:
    fix_file(os.path.join(tools_dir, filename))

import os
import re

components_dir = 'src/components'
for filename in os.listdir(components_dir):
    if not filename.endswith('.jsx'):
        continue
    filepath = os.path.join(components_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. inputmode -> inputMode, readonly -> readOnly, tabindex -> tabIndex
    content = content.replace('inputmode=', 'inputMode=')
    content = content.replace('readonly', 'readOnly')
    content = content.replace('tabindex=', 'tabIndex=')
    content = content.replace('maxlength=', 'maxLength=')
    content = content.replace('minlength=', 'minLength=')
    content = content.replace('autocomplete=', 'autoComplete=')
    content = content.replace('colspan=', 'colSpan=')
    content = content.replace('rowspan=', 'rowSpan=')

    # 2. value= -> defaultValue= on inputs
    content = re.sub(r'(<input[^>]*?)value=', r'\1defaultValue=', content)
    content = re.sub(r'(<select[^>]*?)value=', r'\1defaultValue=', content)
    content = re.sub(r'(<textarea[^>]*?)value=', r'\1defaultValue=', content)

    # 3. onClick="..." -> onClick={() => {}}
    content = re.sub(r'onClick="([^"]*)"', r'onClick={() => { console.log("\1") }}', content)
    content = re.sub(r"onClick='([^']*)'", r"onClick={() => { console.log('\1') }}", content)
    content = re.sub(r'onChange="([^"]*)"', r'onChange={() => { console.log("\1") }}', content)
    content = re.sub(r"onChange='([^']*)'", r"onChange={() => { console.log('\1') }}", content)
    content = re.sub(r'onSubmit="([^"]*)"', r'onSubmit={(e) => { e.preventDefault(); console.log("\1") }}', content)
    
    # 4. Fix style="..." -> style={{}}
    # A simple regex for style="width: 100px; display: none;"
    def style_replacer(match):
        style_str = match.group(1)
        styles = []
        for prop in style_str.split(';'):
            prop = prop.strip()
            if not prop:
                continue
            if ':' not in prop:
                continue
            key, val = prop.split(':', 1)
            key = key.strip()
            val = val.strip()
            # camelCase the key
            parts = key.split('-')
            camel_key = parts[0] + ''.join(p.capitalize() for p in parts[1:])
            styles.append(f"{camel_key}: '{val}'")
        return 'style={{' + ', '.join(styles) + '}}'

    content = re.sub(r'style="([^"]*)"', style_replacer, content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed JSX files")

import re
import os

with open('index.old.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract sections
sections = re.findall(r'<section id="(tab\d+)"[^>]*>(.*?)</section>', content, re.DOTALL)

os.makedirs('src/components', exist_ok=True)

tab_names = {
    'tab1': 'TabThongTinChung',
    'tab2': 'TabDaoTao',
    'tab3': 'TabGiaDinh',
    'tab4': 'TabKhenKyLuat',
    'tab5': 'TabNhanDang',
    'tab6': 'TabLuong'
}

def html_to_jsx(html):
    html = html.replace('class=', 'className=')
    html = html.replace('for=', 'htmlFor=')
    html = html.replace('onclick=', 'onClick=')
    html = html.replace('onchange=', 'onChange=')
    html = html.replace('onsubmit=', 'onSubmit=')
    html = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', html)
    # Self-closing tags
    html = re.sub(r'<(img|input|br|hr)([^>]*[^/])>', r'<\1\2 />', html)
    return html

for tab_id, tab_content in sections:
    comp_name = tab_names.get(tab_id, tab_id.capitalize())
    jsx_content = f"""import React from 'react';

export default function {comp_name}() {{
    return (
        <section id="{tab_id}" className="tab-pane block">
            {html_to_jsx(tab_content)}
        </section>
    );
}}
"""
    with open(f'src/components/{comp_name}.jsx', 'w', encoding='utf-8') as f:
        f.write(jsx_content)

print("Migration completed")

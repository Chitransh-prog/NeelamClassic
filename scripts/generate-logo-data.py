import base64

with open('public/images/logo-icon.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

data_uri = f"data:image/png;base64,{b64}"

content = f'''// Auto-generated optimized logo base64 URI for PDF rendering and fast offline document generation
export const BRAND_LOGO_BASE64 = "{data_uri}";
export const BRAND_LOGO_SRC = "/images/logo-icon.png";
'''

with open('lib/logo-data.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Generated lib/logo-data.ts successfully")

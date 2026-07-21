# FBISD HR Intelligence — Design System

## Brand Identity
Authoritative HR news portal for Fort Bend ISD and Texas public school administrators. Every visual decision signals credibility, clarity, and institutional trust.

## Color Palette — NO PURPLE EVER
| Token    | Hex     | Use                                   |
|----------|---------|---------------------------------------|
| red      | #7A1515 | Primary brand, headers, CTAs          |
| gold     | #B8923C | Accent, rule lines, badges            |
| charcoal | #1E1E1E | Body text, headlines                  |
| steel    | #4A5568 | Secondary text, metadata              |
| bg       | #F6F4F1 | Page background                       |
| surface  | #FFFFFF | Cards, panels                         |
| border   | #E2E0DC | Dividers                              |
| navy     | #1B3461 | Bill tracker, deep accents            |
| green    | #1A6B3A | Positive indicators, signed law       |

## Typography — REQUIRED (never substitute)
- Headers / Display / Masthead: `Changa One` from Google Fonts
- Body / Paragraphs / UI: `Google Sans Flex` from Google Fonts
- Bill codes / Data: `JetBrains Mono`

## Anti-Patterns — NEVER
- No purple, violet, or indigo
- No purple-to-pink gradients  
- No Inter, Poppins, or DM Sans
- No centered gradient hero with floating stats
- No emoji in section headers

## Quality Gates (check before every release)
1. Zero purple hex values in CSS
2. Changa One applies to all h1–h3 and masthead
3. Google Sans Flex applies to all body text
4. Hero and article images load or show fallback
5. Works at 375px mobile width
6. All external links → target="_blank"
7. API errors → curated fallback, not broken UI
8. No vibe-coded purple gradients

## Typography Update (v2)
- **Story / Article headings (h2, h3 inside ArticleCard)**: `Montserrat` weight 700–800
- **All other headers, labels, section titles, masthead**: `Changa One` (unchanged)
- Logo wordmark uses system `Arial Black` + SVG star polygon — no distorted text elements

# Eventoria Concept B handoff

Work in concept-b/. This is a static HTML/CSS/JavaScript website.
Run from the package root with `python3 -m http.server 4181 --bind 127.0.0.1`.
Preview: http://localhost:4181/concept-b/

## Files
- index.html: page sections and content
- styles.css, typography.css, core.css: styling and type hierarchy
- hero.js: interactive particle logo; starts after preloader entry
- preloader.js: 0–100% loading screen and audio choice
- audio.js: music and pointer interaction sounds
- report.js: live Three.js footer emblem using the local OBJ
- portfolio.js: button-controlled work carousel, no forced scrolling
- expertise.js, process.js, receive.js, social.js: section interactions
- navigation.js, menu.js: sticky header and three-line burger menu
- assets/: all required fonts, media, SVGs, model, and vendor modules

## Design conventions
Primary font Clash Grotesk; secondary Helvetica.
Brand blue #3e92ac, yellow #ffcc33. Preserve the existing design and animations
unless requested. Contact background #1B303C, frosted glass form and process
cards. Footer uses a live 3D emblem enlarged and cropped below its bottom edge.
No Code Chapter was removed; report.js remains necessary for the footer.
Contact form is intentionally a non-sending preview. Do not claim emails send.
Use the current files as the source of truth; some copy and imagery are placeholders.

No package install, API credentials, or external build service is required.

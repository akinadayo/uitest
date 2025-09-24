# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone Japanese visual novel game project "星灯のアルカディア" (Hoshi Akari no Arcadia - Star Light Arcadia). The project consists of a single HTML file with embedded CSS and JavaScript, creating a fully self-contained game start screen with no external dependencies.

## Project Structure

- `novel_game_start_final.html` - Main game file containing all code (HTML, CSS, JavaScript)
- `背景/` - Background images directory containing PNG assets for the game

## Key Technical Details

### No Build Process
This is a static HTML project with no build tools, package managers, or dependencies. Simply open the HTML file in a browser to run.

### Responsive Design
The game implements comprehensive responsive design with breakpoints for:
- Desktop (>768px)
- Tablet (768px)
- Mobile landscape (640px)
- Mobile portrait (480px)
- Small devices (375px, 320px)

### Visual Effects Architecture
The game uses multiple layered visual effects:
1. Background image with fallback gradients
2. Overlay effects for summer atmosphere
3. Animated particle system (bubbles)
4. Button hover and click effects with ripples
5. Orbital rings animation around buttons

### Game Functionality
Current implementation includes:
- Start new game button (初めから)
- Continue game button (続きから)
- Fade transitions between screens
- Alert placeholders for game state changes

## Development Guidelines

### Making Changes
Since this is a single-file project, all modifications should be made directly to `novel_game_start_final.html`. The code follows these conventions:
- CSS is embedded in `<style>` tags
- JavaScript is embedded in `<script>` tags
- No external libraries or frameworks are used
- All animations use CSS keyframes
- Responsive design uses CSS media queries

### Testing
Open the HTML file directly in a browser. Test on different screen sizes using browser developer tools' responsive design mode.

### Asset Management
Background images are stored in the `背景/` directory. The code includes fallback SVG gradients if images fail to load.
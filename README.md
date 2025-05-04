# The Tale of the Lost Forest Light

A vocabulary-focused educational game designed for 8-9 year olds. Players restore a magical forest by answering vocabulary questions about five academic words: Predict, Observe, Compare, Explain, and Support.

![Game Screenshot](./screenshot.png)

## Game Overview

In this game, players:
- Start in a dark forest that gradually brightens as they progress
- Select from five word runes (each representing an academic vocabulary word)
- Answer increasingly difficult challenges for each word
- Restore the forest's light by mastering all five vocabulary words

## Features

- Three challenge levels per word (easy, medium, hard)
- Points system (1 point for easy/medium, 3 points for hard)
- Visual feedback with glowing runes and brightening forest
- Responsive design that works on different screen sizes
- Educational content that reinforces academic vocabulary

## Tech Stack

- React
- TypeScript
- CSS (with some Tailwind CSS classes)
- Vite build system

## Running the Game

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser to the URL displayed in the terminal (usually http://localhost:5173)

## Game Structure

The game consists of three main screens:

1. **StartScreen**: Introduction screen with game title and play button
2. **GameScreen**: Main game area with word runes and challenges
3. **EndScreen**: Completion screen with restored forest

The game's content is defined in `src/data.json`, which includes:
- Word definitions
- Challenge questions and answers
- Game state tracking
- Asset references

## Extending the Game

### Adding New Vocabulary Words

To add new vocabulary words, edit the `data.json` file:

1. Add a new word object to the `words` array
2. Include the word, definition, and color
3. Create three challenges (easy, medium, hard) with choices, feedback, and points

Example:
```json
{
  "word": "Analyze",
  "definition": "To study something carefully to understand its parts.",
  "challenges": [
    {
      "difficulty": "easy",
      "prompt": "Which sentence uses 'analyze' correctly?",
      "choices": [
        "I analyze my shoe to make it bigger.",
        "Let's analyze the story to find the main idea.",
        "I analyze my breakfast every morning.",
        "The dog will analyze the mail."
      ],
      "points": 1,
      "feedback": "Great! 'Analyze' means to study something carefully.",
      "feedback_negative": "Remember, 'analyze' means to study something to understand its parts."
    },
    // Add medium and hard challenges...
  ],
  "power_level": 0,
  "correct_uses": 0,
  "color": "#800080" // Purple
}
```

### Adding Custom Assets

Store custom assets in:
- `src/assets/images/` for images
- `src/assets/audio/` for sound effects

Then update the paths in `data.json` to reference these files.

## License

MIT

## Credits

Created for educational purposes.

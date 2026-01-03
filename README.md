# Bookmark All Windows

A Brave/Chrome extension to bookmark all tabs from all open windows at once into organized folders.

## The Problem

Browsers only let you bookmark tabs from one window at a time. If you have 20+ windows with 30+ tabs each, saving them all becomes a tedious, repetitive task.

## The Solution

One click → All windows → All tabs → Organized into separate folders.

## Features

- 📁 Creates a separate folder for each window
- 🏷️ Customizable folder name prefix
- 📊 Shows window and tab count before saving
- ⏱️ Timestamps in folder names for easy identification
- 🚫 Automatically skips internal browser pages (`chrome://`, `brave://`)

## Installation

1. Clone this repository or download as ZIP
2. Open `brave://extensions` (or `chrome://extensions`)
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the `bookmark-all-windows` folder

## Usage

1. Click the extension icon in your toolbar
2. (Optional) Change the folder name prefix
3. Click **Bookmark All Windows**
4. Find your bookmarks under **Other Bookmarks**:

```
Other Bookmarks/
├── Session_2026-01-03_15-30_Window-1/
│   ├── GitHub - Your Repo
│   ├── Stack Overflow - Question
│   └── ...
├── Session_2026-01-03_15-30_Window-2/
│   ├── YouTube - Video
│   └── ...
└── ...
```

## Permissions

- `tabs` - To read tab URLs and titles
- `bookmarks` - To create bookmark folders and entries

## Compatibility

Works with all Chromium-based browsers:
- Brave
- Google Chrome
- Microsoft Edge
- Vivaldi
- Opera

## License

Licensed under the [AGPL-3.0](LICENSE)


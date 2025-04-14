# Phishing Detection Browser Extension

A browser extension that helps users identify potentially suspicious websites while browsing Google search results. The extension provides real-time visual indicators and warnings to help users make informed decisions about the websites they visit.

## Features

### 1. Real-time URL Analysis
- Analyzes URLs in Google search results
- Identifies potentially suspicious websites
- Maintains a list of trusted domains
- Checks for common phishing patterns

### 2. Visual Indicators
- ✅ Green "Verified" chip for safe websites
- ⚠️ Red "Check URL" chip for suspicious websites
- Clear visual distinction between safe and suspicious links
- Modern, unobtrusive design

### 3. Warning System
- Interactive warning popups for suspicious websites
- Appears before visiting suspicious links
- Two-button choice system:
  - "Continue Anyway" - Proceed to the website
  - "Go Back" - Return to search results
- Clear explanation of potential risks

### 4. Search Result Integration
- Seamlessly integrates with Google search results
- Processes top 10 search results
- Real-time analysis and indicators
- Non-intrusive visual elements

## Installation

1. Clone this repository or download the files
2. Open Chrome/Edge browser and navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Project Structure

### manifest.json
- Extension configuration
- Permissions and resources
- Script declarations
- Icon definitions

### popup.html
- Clean, modern interface
- Responsive design (350px width)
- Scrollable URL list
- Statistics display
- Styled with CSS for better user experience

### popup.js
- Handles popup functionality
- Communicates with background script
- Displays URL list and statistics
- Manages user interactions

### content.js
- Search result processing
- URL analysis
- Visual indicators
- Warning system
- Click event handling

### background.js
- Data management
- URL storage
- State management
- Message handling

## Usage

1. Perform a Google search
2. Look for the status indicators next to search results:
   - ✅ Green "Verified" - Safe to visit
   - ⚠️ Red "Check URL" - Exercise caution
3. When clicking on a suspicious link:
   - A warning popup will appear
   - Choose to continue or go back
   - Make an informed decision

## UI Components

### Popup Interface
- Clean, modern design
- Scrollable list of URLs
- Visual indicators for suspicious sites
- Statistics display
- Responsive layout

### Warning Popup
- Clear warning message
- Two-button choice system
- Modern styling
- Smooth animations

### Status Chips
- Color-coded indicators
- Clear icons (✅/⚠️)
- Hover effects
- Consistent styling

## Technical Details

### URL Analysis
- Pattern matching
- Domain verification
- Structure analysis
- Trusted domain checking

### Security Features
- Pre-visit warnings
- Click interception
- Visual indicators
- User confirmation

## Development

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- Chrome or Edge browser
- Text editor or IDE

### Local Development
1. Make changes to the code
2. Reload the extension in the browser
3. Test the changes
4. Repeat as needed

## Note

This extension is for educational purposes and should be used as part of a comprehensive approach to online security. Always exercise caution when visiting unfamiliar websites. 
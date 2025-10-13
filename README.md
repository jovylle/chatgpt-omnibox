# 🚀 AI Omnibox - Universal AI Search Extension# � AI Omnibox



**The most intelligent Chrome extension for accessing multiple AI services with a single keyword.**A Chrome extension that adds multiple AI services to your browser's omnibox with the `chat` keyword. Choose between ChatGPT, GitHub Copilot, Claude AI, and Perplexity.



Transform your browser's address bar into a powerful AI gateway that learns from your usage patterns and provides intelligent suggestions. Search ChatGPT, Claude, GitHub Copilot, Perplexity, and Google Gemini with smart prefix routing and dynamic recommendations.## ✨ Features



## ✨ Features- **🔍 Universal AI Search**: Type `chat <your question>` in the address bar

- **🤖 Multiple AI Services**: ChatGPT, GitHub Copilot, Claude AI, Perplexity

### 🎯 **Smart AI Routing**- **🖱️ Context Menu**: Right-click selected text and "Search AI for..."

- **Single Keyword**: Type `chat` in address bar to access all AI services- **⚡ Quick Access**: Click extension icon to open your preferred AI service

- **Intelligent Prefixes**: Route to specific AIs with `chat gpt:`, `chat claude:`, `chat copilot:`, etc.- **⚙️ Easy Settings**: Beautiful options page to switch between AI services

- **Smart Defaults**: Automatically uses your most-used AI service when no prefix specified- **🎯 Simple & Fast**: No configuration needed, works immediately

- **Alias Support**: Use shortcuts like `chat c:` for Claude or `chat g:` for ChatGPT

## 🤖 Supported AI Services

### 📊 **Usage Analytics & Learning**

- **Dynamic Suggestions**: Omnibox learns from your search patterns| Service | Icon | Features |

- **Usage Statistics**: Track which AI services you use most|---------|------|----------|

- **Smart Ordering**: Services reorder based on your usage frequency| **ChatGPT** | � | Conversational AI, code generation, creative writing |

- **Recent History**: Quick access to your recent searches| **GitHub Copilot** | 🤖 | Web search integration, real-time info, source citations |

| **Claude AI** | 🧠 | Thoughtful analysis, long-form content, complex reasoning |

### 🎨 **Beautiful Interface**| **Perplexity** | 🔎 | AI-powered search, source citations, current information |

- **Smart Popup**: Shows shortcuts, recent searches, and personalized tips

- **Analytics Dashboard**: Comprehensive statistics and usage insights## �🚀 Usage

- **Modern Design**: Clean, responsive interface with smooth animations

- **Color-Coded Services**: Visual identity for each AI service### Omnibox Search

1. Click in your browser's address bar

### ⚙️ **Advanced Configuration**2. Type `chat` followed by a space or tab

- **Service Toggle**: Enable/disable individual AI services3. Enter your question (e.g., `chat explain quantum computing`)

- **Custom URLs**: Modify AI service endpoints if needed4. Press Enter to open your selected AI service with your query

- **Alias Management**: Customize shortcuts for each service

- **Export/Import**: Backup your settings and statistics### Context Menu

1. Select any text on a webpage

## 🛠️ Installation2. Right-click and choose "Search [AI Service] for '[selected text]'"

3. Your AI service opens in a new tab with your selected text as the query

### Method 1: Developer Mode (Recommended)

1. **Download**: Clone this repository or download as ZIP### Quick Access

   ```bash- Click the extension icon in your toolbar to open your preferred AI service directly

   git clone https://github.com/your-username/chatgpt-omnibox.git

   ```### Settings

- Click the extension icon and select "Settings & AI Selection"

2. **Chrome Extensions**: Navigate to `chrome://extensions/`- Choose your preferred AI service from the beautiful options page

- Settings are automatically saved and synced across your devices

3. **Developer Mode**: Toggle "Developer mode" in the top-right corner

## 📦 Installation

4. **Load Extension**: Click "Load unpacked" and select the extension folder

### From Source (Development)

5. **Ready**: The AI Omnibox is now installed and ready to use!1. Clone or download this repository

2. Open Chrome and go to `chrome://extensions/`

### Method 2: Chrome Web Store3. Enable "Developer mode" (toggle in top-right)

*Coming soon - pending Chrome Web Store review*4. Click "Load unpacked" and select the extension folder

5. The extension is now installed and ready to use!

## 🚀 Usage Guide

### From Chrome Web Store

### Basic Usage*Coming soon - this extension will be published to the Chrome Web Store*

1. **Activate**: Click address bar or press `Ctrl+L` (Windows/Linux) or `Cmd+L` (Mac)

2. **Keyword**: Type `chat` and press Tab or Space## 🛠️ Development

3. **Query**: Enter your search query

4. **Search**: Press Enter to open in new tab### File Structure

```

### Advanced Routingchatgpt-omnibox/

├── manifest.json          # Extension configuration

| Command | AI Service | Example |├── background.js          # Service worker (main logic)

|---------|------------|---------|├── popup.html            # Extension popup interface

| `chat hello world` | *Smart default* | Uses your most-used AI |├── options.html          # Settings page

| `chat gpt: explain quantum computing` | **ChatGPT** | OpenAI's ChatGPT |├── options.js            # Settings page logic

| `chat claude: write a poem` | **Claude** | Anthropic's Claude |├── icons/                # Extension icons

| `chat copilot: debug this code` | **GitHub Copilot** | Microsoft's Copilot Chat |│   ├── icon16.png        # 16x16 toolbar icon

| `chat perplexity: latest AI news` | **Perplexity** | Perplexity AI Search |│   ├── icon48.png        # 48x48 management page icon

| `chat gemini: creative writing` | **Google Gemini** | Google's Gemini |│   └── icon128.png       # 128x128 store icon

└── README.md             # This file

### Alias Shortcuts```

- `chat c:` → Claude

- `chat g:` → ChatGPT  ### New Features Added

- `chat gh:` → GitHub Copilot- ✅ **Multiple AI Services**: Support for 4 popular AI platforms

- `chat p:` → Perplexity- ✅ **Settings Page**: Beautiful options interface with service selection

- `chat gem:` → Google Gemini- ✅ **Storage Sync**: Settings synchronized across devices

- ✅ **Dynamic Context Menu**: Updates based on selected AI service

## 📱 Interface Overview- ✅ **Enhanced Popup**: Shows current AI service and quick access to settings

- ✅ **Professional Icons**: Updated with search-themed magnifying glass icons

### Popup Interface

- **Current Service**: Shows your most-used AI service### Testing

- **Quick Shortcuts**: Click to copy service prefixes1. Load the extension in developer mode

- **Recent Searches**: Replay previous queries with one click2. Test omnibox: type `chat hello world` in address bar

- **Pro Tips**: Personalized usage suggestions3. Test context menu: select text, right-click, choose AI search option

4. Test settings: click extension icon → "Settings & AI Selection"

### Options Dashboard5. Test AI switching: change AI service in settings and verify it works

- **Statistics Grid**: Usage counts and percentages

- **Recent Activity**: Chronological search history## 🤝 Contributing

- **Service Management**: Toggle AI services on/off

- **Settings Export**: Backup your configuration1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

## 🔧 Technical Details3. Commit your changes (`git commit -m 'Add amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)

### Architecture5. Open a Pull Request

- **Manifest V3**: Latest Chrome extension standard

- **Service Worker**: Efficient background processing## 📝 License

- **Storage API**: Sync settings across devices

- **Omnibox API**: Native address bar integrationMIT License - feel free to use this code for your own projects!



### Files Structure## ❓ Why This Extension?

```

📁 AI Omnibox/Instead of manually adding AI services as search engines on every new machine, this extension:

├── 📄 manifest.json       # Extension configuration- ✅ Works immediately after installation

├── 📄 background.js       # Core routing logic & analytics- ✅ Provides consistent `chat` keyword across all your devices  

├── 📄 popup.html          # Popup interface- ✅ Supports multiple AI services with easy switching

├── 📄 popup.js            # Popup functionality- ✅ Includes bonus features like context menu search

├── 📄 options.html        # Settings dashboard- ✅ Maintains your default search engine (Google, Bing, etc.)

├── 📄 options.js          # Options page logic- ✅ Syncs your preferences across all your Chrome installations

└── 📁 icons/              # Extension icons

    ├── 🖼️ icon16.png## 🔗 Links

    ├── 🖼️ icon48.png

    └── 🖼️ icon128.png- [ChatGPT](https://chat.openai.com/)

```- [GitHub Copilot](https://copilot.microsoft.com/)

- [Claude AI](https://claude.ai/)

### Permissions- [Perplexity](https://www.perplexity.ai/)

- `activeTab`: Open new tabs with AI services- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)

- `storage`: Save preferences and statistics- [Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)

- `contextMenus`: Right-click search options

---

## 🧠 Intelligence Features

**Made with ❤️ for productivity and universal AI access**
### Adaptive Learning
- **Usage Patterns**: Tracks which AI services you prefer
- **Smart Suggestions**: Omnibox autocomplete learns from history
- **Dynamic Ordering**: Services reorder by frequency of use
- **Context Awareness**: Suggests relevant AI based on query type

### Analytics Insights
- **Service Distribution**: See your AI usage breakdown
- **Search Trends**: Track your query patterns over time
- **Performance Metrics**: Response times and success rates
- **Export Data**: Download your usage analytics

## 🔒 Privacy & Security

### Data Protection
- ✅ **No External Servers**: All data stored locally in Chrome
- ✅ **No Tracking**: Zero telemetry or analytics sent to developers
- ✅ **Encrypted Storage**: Settings encrypted with Chrome Sync
- ✅ **Open Source**: Full transparency - audit the code yourself

### What We Store
- Your AI service preferences (which services enabled)
- Usage statistics (anonymous counts, no query content)
- Recent search metadata (query text stored locally only)

### What We DON'T Store
- Your actual search queries are never transmitted to our servers
- No personal information or browsing history
- No advertising IDs or tracking cookies

## 🛡️ Content Security Policy
Strict CSP compliance ensures:
- No inline scripts or eval()
- All resources loaded from extension package
- Protection against XSS attacks
- Chrome Web Store security requirements

## 🚀 Future Roadmap

### Planned Features
- 🤖 **More AI Services**: Bing Chat, Poe, Character.ai
- 🔍 **Smart Query Analysis**: Auto-route based on query intent  
- 🎨 **Custom Themes**: Personalize the interface
- 📊 **Advanced Analytics**: Detailed usage insights
- ☁️ **Cloud Sync**: Backup settings across browsers
- 🗣️ **Voice Input**: Speak your queries
- 📱 **Mobile Companion**: Sync with mobile browsers

### Integration Ideas
- IDE integration for coding queries
- Slack/Teams bot for team AI access
- API for external applications
- Browser bookmarklet version

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-username/ai-omnibox.git
cd ai-omnibox

# Install development dependencies
npm install

# Load in Chrome for testing
# Go to chrome://extensions/, enable Developer mode, click "Load unpacked"
```

### Contribution Guidelines
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas for Contribution
- 🐛 **Bug Reports**: Found an issue? Let us know!
- 💡 **Feature Requests**: Ideas for new functionality
- 🎨 **UI/UX Improvements**: Make it even more beautiful
- 📚 **Documentation**: Help improve our docs
- 🌐 **Translations**: Localize for other languages
- 🧪 **Testing**: Help us test on different systems

## 📈 Changelog

### v1.0.0 - "The Dynamic Revolution"
- ✨ **Multi-AI Support**: ChatGPT, Claude, Copilot, Perplexity, Gemini
- 🧠 **Smart Routing**: Intelligent prefix parsing with aliases
- 📊 **Usage Analytics**: Comprehensive tracking and insights
- 🎨 **Dynamic Interface**: Learning popup and statistics dashboard
- 🔒 **Privacy First**: Local storage, no external data transmission
- ⚙️ **Advanced Settings**: Service management and customization

## ❓ FAQ

**Q: Why only one omnibox keyword instead of separate ones for each AI?**
A: Chrome limits extensions to one omnibox keyword each. Our smart prefix routing (`chat gpt:`, `chat claude:`) provides even better UX than multiple keywords!

**Q: Can I add custom AI services?**
A: Currently, the extension supports the five major AI services. Custom service support is planned for a future release.

**Q: Does this extension work with other browsers?**
A: Currently Chrome-only, but Firefox and Edge ports are being considered.

**Q: How do I backup my settings?**
A: Use the Export button in the Options page to download your configuration and statistics.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for ChatGPT
- Anthropic for Claude  
- Microsoft for GitHub Copilot
- Perplexity AI for search capabilities
- Google for Gemini AI
- Chrome Extensions team for the robust API
- All beta testers and contributors

---

**Made with ❤️ for the AI community**

*Transform your browsing experience with the most intelligent AI omnibox extension available.*
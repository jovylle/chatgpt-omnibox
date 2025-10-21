// AI Omnibox Extension - Background Script
// Handles omnibox input and context menu with multiple AI services

// Helper function to escape XML characters for omnibox suggestions
function escapeXML(text) {
  return text.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#39;');
}

// AI Service configurations with enhanced features
const AI_SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chatgpt.com/?q=%s',
    baseUrl: 'https://chatgpt.com/',
    icon: '💬',
    keywords: ['gpt', 'chatgpt', 'openai'],
    aliases: ['g', 'chat', 'gpt4'],
    enabled: true,
    color: '#10a37f',
    description: 'Conversational AI & coding help'
  },
  copilot: {
    name: 'GitHub Copilot',
    url: 'https://copilot.microsoft.com/?q=%s',
    baseUrl: 'https://copilot.microsoft.com/',
    icon: '🤖',
    keywords: ['copilot', 'microsoft', 'bing'],
    aliases: ['co', 'pilot', 'ms'],
    enabled: true,
    color: '#0078d4',
    description: 'Web search & real-time info'
  },
  claude: {
    name: 'Claude AI',
    url: 'https://claude.ai/new?query=%s',
    baseUrl: 'https://claude.ai/',
    icon: '🧠',
    keywords: ['claude', 'anthropic'],
    aliases: ['c', 'ant', 'claude3'],
    enabled: true,
    color: '#cc785c',
    description: 'Thoughtful analysis & reasoning'
  },
  perplexity: {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/search?q=%s',
    baseUrl: 'https://www.perplexity.ai/',
    icon: '🔎',
    keywords: ['perplexity', 'ppl', 'search'],
    aliases: ['p', 'ppl', 'px'],
    enabled: true,
    color: '#20b2aa',
    description: 'AI search with sources'
  }
};

// Enhanced state management
let defaultAI = 'chatgpt';
let contextMenuCreated = false;
let userStats = {
  totalSearches: 0,
  serviceUsage: {},
  recentSearches: [],
  favoriteServices: []
};

// Load saved preferences and user statistics
chrome.storage.sync.get(['defaultAI', 'userStats'], function(result) {
  defaultAI = result.defaultAI || 'chatgpt';
  
  // Load user statistics
  if (result.userStats) {
    userStats = { ...userStats, ...result.userStats };
  }
  
  // Initialize service usage stats if not present
  Object.keys(AI_SERVICES).forEach(serviceId => {
    if (!userStats.serviceUsage[serviceId]) {
      userStats.serviceUsage[serviceId] = 0;
    }
  });
  
  // Only update context menu if it's already been created
  if (contextMenuCreated) {
    updateContextMenu();
  }
  
  // Update extension title
  updateExtensionTitle();
});

// Enhanced parsing with aliases and smart detection
function parseOmniboxInput(text) {
  const trimmedText = text.trim();
  
  // Check for AI service prefixes (keywords and aliases)
  for (const [serviceId, service] of Object.entries(AI_SERVICES)) {
    
    // Check all keywords and aliases
    const allMatchers = [...service.keywords, ...service.aliases];
    
    for (const matcher of allMatchers) {
      const prefix = matcher + ':';
      if (trimmedText.toLowerCase().startsWith(prefix)) {
        const query = trimmedText.substring(prefix.length).trim();
        return {
          service: serviceId,
          query: query || trimmedText,
          matchedKeyword: matcher
        };
      }
    }
  }
  
  // Smart detection for partial matches (e.g., "gpt " or "claude ")
  for (const [serviceId, service] of Object.entries(AI_SERVICES)) {
    
    const allMatchers = [...service.keywords, ...service.aliases];
    
    for (const matcher of allMatchers) {
      if (trimmedText.toLowerCase().startsWith(matcher + ' ')) {
        const query = trimmedText.substring(matcher.length).trim();
        return {
          service: serviceId,
          query: query,
          matchedKeyword: matcher,
          isSpaceSeparated: true
        };
      }
    }
  }
  
  // No prefix found, use default AI service
  return {
    service: defaultAI,
    query: trimmedText,
    isDefault: true
  };
}

// Get sorted AI services by usage frequency
function getSortedAIServices() {
  const allServices = Object.entries(AI_SERVICES)
    .map(([serviceId, service]) => ({
      id: serviceId,
      ...service,
      usage: userStats.serviceUsage[serviceId] || 0
    }));
  
  // Sort by usage (most used first), then alphabetically
  return allServices.sort((a, b) => {
    if (b.usage !== a.usage) {
      return b.usage - a.usage;
    }
    return a.name.localeCompare(b.name);
  });
}

// Track usage statistics
function trackUsage(serviceId, query) {
  userStats.totalSearches++;
  userStats.serviceUsage[serviceId] = (userStats.serviceUsage[serviceId] || 0) + 1;
  
  // Add to recent searches (keep last 10)
  const recentEntry = {
    service: serviceId,
    query: query.substring(0, 50), // Truncate long queries
    timestamp: Date.now()
  };
  
  userStats.recentSearches.unshift(recentEntry);
  userStats.recentSearches = userStats.recentSearches.slice(0, 10);
  
  // Update favorite services (top 3 most used)
  const sortedUsage = Object.entries(userStats.serviceUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([serviceId]) => serviceId);
  
  userStats.favoriteServices = sortedUsage;
  
  // Save stats
  chrome.storage.sync.set({ userStats });
}

// Get current default AI service configuration
function getDefaultAIService() {
  return AI_SERVICES[defaultAI] || AI_SERVICES.chatgpt;
}

// Update context menu title based on default AI
function updateContextMenu() {
  const aiService = getDefaultAIService();
  chrome.contextMenus.update("searchAI", {
    title: `Search ${aiService.name} for '%s'`
  }, function() {
    // Handle potential errors silently
    if (chrome.runtime.lastError) {
      console.log('Context menu update:', chrome.runtime.lastError.message);
    }
  });
}

// Update extension title based on default AI
function updateExtensionTitle() {
  const aiService = getDefaultAIService();
  const serviceId = defaultAI; // ensure we use the actual id string
  chrome.action.setTitle({
    title: `${aiService.icon} ${aiService.name} Omnibox - Type 'chat' in address bar`
  });
  
  // Set a badge to show current AI service
  const badges = {
    'chatgpt': 'GPT',
    'claude': 'CLD', 
    'copilot': 'COP',
    'perplexity': 'PPX'
  };
  
  chrome.action.setBadgeText({
    text: badges[serviceId] || aiService.name.substring(0, 3).toUpperCase()
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: aiService.color || '#10a37f'
  });
}

// Enhanced omnibox event handlers with dynamic suggestions
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if (!text.trim()) {
    suggest([]);
    return;
  }
  
  const parsed = parseOmniboxInput(text);
  const suggestions = [];
  const sortedServices = getSortedAIServices();
  
  // Main suggestion for detected service
  const mainService = AI_SERVICES[parsed.service];
  if (mainService) {
    let description = '';
    if (parsed.isDefault) {
      description = `Search ${mainService.name} (default) for: <match>${parsed.query}</match>`;
    } else if (parsed.matchedKeyword) {
      description = `Search ${mainService.name} for: <match>${parsed.query}</match>`;
    }
    
    suggestions.push({
      content: text,
      description: description
    });
  }
  
  // Add suggestions for other AI services (if no specific service detected)
  if (parsed.isDefault && parsed.query === text.trim()) {
    sortedServices.forEach(service => {
      if (service.id !== defaultAI) {
        // Suggest only colon syntax to avoid duplication
        const colonSyntax = `${service.aliases[0]}: ${text}`;
        
        suggestions.push({
          content: colonSyntax,
          description: `${service.icon} ${service.name}: <match>${text}</match> <dim>(${escapeXML(service.description)})</dim>`
        });
      }
    });
  }
  
  // Add quick service switching suggestions
  if (text.length <= 2 && !parsed.matchedKeyword) {
    sortedServices.forEach(service => {
      if (service.aliases.some(alias => alias.startsWith(text.toLowerCase()))) {
        suggestions.push({
          content: `${service.aliases[0]}: `,
          description: `${service.icon} Switch to ${service.name} <dim>(Type your query after the colon)</dim>`
        });
      }
    });
  }
  
  // Recent searches suggestion
  if (userStats.recentSearches.length > 0 && text.length >= 3) {
    const recentMatch = userStats.recentSearches.find(recent => 
      recent.query.toLowerCase().includes(text.toLowerCase())
    );
    
    if (recentMatch) {
      const recentService = AI_SERVICES[recentMatch.service];
      suggestions.push({
        content: `${recentService.aliases[0]}: ${recentMatch.query}`,
        description: `🕒 Recent: ${recentService.name} - <match>${recentMatch.query}</match>`
      });
    }
  }
  
  suggest(suggestions.slice(0, 6)); // Chrome limits to 6 suggestions
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  // Parse input to determine AI service and query
  const parsed = parseOmniboxInput(text);
  const aiService = AI_SERVICES[parsed.service];
  
  if (!aiService) {
    // Fallback to default AI if service not found
    const fallbackService = getDefaultAIService();
    const query = encodeURIComponent(text.trim());
    const searchUrl = fallbackService.url.replace('%s', query);
    
    trackUsage(defaultAI, text.trim());
    
    if (disposition === 'currentTab') {
      chrome.tabs.update({ url: searchUrl });
    } else {
      chrome.tabs.create({ url: searchUrl });
    }
    return;
  }
  
  // Track usage for analytics
  trackUsage(parsed.service, parsed.query);
  
  // Use the determined AI service
  const query = encodeURIComponent(parsed.query);
  const searchUrl = aiService.url.replace('%s', query);
  
  // Open AI service based on how user activated the omnibox
  if (disposition === 'currentTab') {
    chrome.tabs.update({ url: searchUrl });
  } else {
    chrome.tabs.create({ url: searchUrl });
  }
});

// Context menu for right-click "Search [AI] for..."
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "searchAI",
    title: "Search ChatGPT for '%s'", // Will be updated by updateContextMenu
    contexts: ["selection"]
  }, function() {
    if (chrome.runtime.lastError) {
      console.error('Context menu creation error:', chrome.runtime.lastError);
    } else {
      contextMenuCreated = true;
      updateContextMenu();
      updateExtensionTitle();
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "searchAI" && info.selectionText) {
    const query = encodeURIComponent(info.selectionText.trim());
    const aiService = getDefaultAIService();
    const searchUrl = aiService.url.replace('%s', query);
    chrome.tabs.create({ url: searchUrl });
  }
});

// Handle extension icon click - open default AI service
chrome.action.onClicked.addListener((tab) => {
  const aiService = getDefaultAIService();
  chrome.tabs.create({ url: aiService.baseUrl });
});

// Listen for messages from options page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSettings') {
    if (request.defaultAI) {
      defaultAI = request.defaultAI;
    }
    updateContextMenu();
    updateExtensionTitle();
    sendResponse({ success: true });
  }
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    if (changes.defaultAI) {
      defaultAI = changes.defaultAI.newValue;
      if (contextMenuCreated) {
        updateContextMenu();
      }
      updateExtensionTitle();
    }
  }
});
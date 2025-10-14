// AI Omnibox Extension - Popup Script
// Handles popup interface and user interactions

// AI Service configurations
const AI_SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    baseUrl: 'https://chat.openai.com/',
    icon: '💬',
    keywords: ['gpt', 'chatgpt']
  },
  copilot: {
    name: 'GitHub Copilot',
    baseUrl: 'https://copilot.microsoft.com/',
    icon: '🤖',
    keywords: ['copilot']
  },
  claude: {
    name: 'Claude AI',
    baseUrl: 'https://claude.ai/',
    icon: '🧠',
    keywords: ['claude']
  },
  perplexity: {
    name: 'Perplexity',
    baseUrl: 'https://www.perplexity.ai/',
    icon: '🔎',
    keywords: ['perplexity', 'ppl']
  }
};

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load current AI service and statistics
    const [aiServices, stats, recentData] = await Promise.all([
      chrome.storage.sync.get(['aiServices']),
      chrome.storage.sync.get(['statistics']),
      chrome.storage.sync.get(['recentSearches'])
    ]);
    
    const services = aiServices.aiServices || getDefaultAIServices();
    const statistics = stats.statistics || {};
    const recentSearches = recentData.recentSearches || [];
    
    // Show currently configured service
    const allServices = Object.values(services);
    const currentServiceIconEl = document.getElementById('currentServiceIcon');
    const currentServiceNameEl = document.getElementById('currentServiceName');
    
    // Get the current default service
    chrome.storage.sync.get(['defaultAI'], function(result) {
      const defaultAI = result.defaultAI || 'chatgpt';
      const defaultService = services[defaultAI];
      
      if (defaultService && currentServiceIconEl && currentServiceNameEl) {
        currentServiceIconEl.textContent = defaultService.icon;
        currentServiceNameEl.textContent = defaultService.name;
        
        // Update the open button text
        const openButtonText = document.getElementById('openButtonText');
        if (openButtonText) {
          openButtonText.textContent = `Open ${defaultService.name}`;
        }
        
        // Update the dynamic title and subtitle
        const dynamicTitle = document.getElementById('dynamicTitle');
        const dynamicSubtitle = document.getElementById('dynamicSubtitle');
        if (dynamicTitle) {
          dynamicTitle.textContent = `${defaultService.icon} ${defaultService.name} Omnibox`;
        }
        if (dynamicSubtitle) {
          dynamicSubtitle.textContent = `Type "chat" to search ${defaultService.name}`;
        }
      }
    });
    
    // Populate shortcuts list
    populateShortcutsList(allServices, statistics);
    
    // Populate recent searches
    populateRecentSearches(recentSearches, services);
    
    // Populate pro tips
    populateProTips();
    
    // Settings button
    const settingsBtn = document.getElementById('openSettings');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
      });
    }
    
  } catch (error) {
    console.error('Error loading popup:', error);
  }
});

function populateShortcutsList(services, statistics) {
  const shortcutsList = document.getElementById('shortcutsList');
  
  if (!shortcutsList) return;
  
  // Get all services (not just enabled ones)
  const allServices = Object.values(getDefaultAIServices());
  
  // Sort by usage
  const sortedServices = allServices.sort((a, b) => {
    const aUsage = statistics[a.id]?.usage || 0;
    const bUsage = statistics[b.id]?.usage || 0;
    return bUsage - aUsage;
  });
  
  shortcutsList.innerHTML = sortedServices.map(service => {
    const usage = statistics[service.id]?.usage || 0;
    const usageText = usage === 0 ? 'New' : `${usage} uses`;
    
    return `
      <div class="shortcut-item" data-service="${service.id}" 
           style="border-left-color: ${getServiceColor(service.id)}">
        <div class="shortcut-info">
          <span class="shortcut-icon">${service.icon}</span>
          <span class="shortcut-name">${service.name}</span>
          <span class="shortcut-alias">chat ${service.aliases[0]}:</span>
        </div>
        <span class="shortcut-usage">${usageText}</span>
      </div>
    `;
  }).join('');
  
  // Add click handlers
  shortcutsList.querySelectorAll('.shortcut-item').forEach(item => {
    item.addEventListener('click', () => {
      const serviceId = item.dataset.service;
      const service = services.find(s => s.id === serviceId);
      if (service) {
        // Copy shortcut to clipboard
        const shortcut = `chat ${service.aliases[0]}:`;
        navigator.clipboard.writeText(shortcut).then(() => {
          item.style.background = 'linear-gradient(135deg, #d4edda, #c3e6cb)';
          setTimeout(() => {
            item.style.background = '';
          }, 500);
        });
      }
    });
  });
}

function populateRecentSearches(recentSearches, services) {
  const recentList = document.getElementById('recentSearchesList');
  
  if (!recentList) return;
  
  if (recentSearches.length === 0) {
    recentList.innerHTML = `
      <div style="text-align: center; color: #999; padding: 20px;">
        <div>No recent searches</div>
        <div style="font-size: 11px; margin-top: 4px;">Start using the omnibox to see history</div>
      </div>
    `;
    return;
  }
  
  // Show last 5 searches
  const recentItems = recentSearches.slice(-5).reverse();
  
  recentList.innerHTML = recentItems.map(search => {
    const service = services[search.serviceId] || { icon: '🔍', name: 'Unknown' };
    const timeAgo = getTimeAgo(search.timestamp);
    
    return `
      <div class="recent-item" data-query="${search.query}" data-service="${search.serviceId}">
        <span class="recent-service-icon">${service.icon}</span>
        <span class="recent-query">${search.query}</span>
        <span class="recent-time">${timeAgo}</span>
      </div>
    `;
  }).join('');
  
  // Add click handlers to repeat searches
  recentList.querySelectorAll('.recent-item').forEach(item => {
    item.addEventListener('click', () => {
      const query = item.dataset.query;
      const serviceId = item.dataset.service;
      const service = services[serviceId];
      
      if (service && query) {
        const url = service.url.replace('{query}', encodeURIComponent(query));
        chrome.tabs.create({ url });
      }
    });
  });
}

function populateProTips() {
  const tipsList = document.getElementById('tipsList');
  
  if (!tipsList) return;
  
  const tips = [
    { code: 'chat gpt: hello world', desc: 'Use ChatGPT' },
    { code: 'chat claude: explain this', desc: 'Use Claude' },
    { code: 'chat copilot: debug code', desc: 'Use GitHub Copilot' },
    { code: 'chat perplexity: research topic', desc: 'Use Perplexity' },
    { code: 'chat gemini: creative task', desc: 'Use Google Gemini' }
  ];
  
  // Show 3 random tips
  const shuffled = tips.sort(() => Math.random() - 0.5).slice(0, 3);
  
  tipsList.innerHTML = shuffled.map(tip => `
    <div class="tip-item">
      <span class="tip-code">${tip.code}</span>
      <span class="tip-desc">${tip.desc}</span>
    </div>
  `).join('');
}

function getServiceColor(serviceId) {
  const colors = {
    'chatgpt': '#10a37f',
    'claude': '#d97757',
    'copilot': '#1f2328',
    'perplexity': '#20808d',
    'gemini': '#4285f4'
  };
  return colors[serviceId] || '#6c757d';
}

function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function getDefaultAIServices() {
  return {
    'chatgpt': {
      id: 'chatgpt',
      name: 'ChatGPT',
      icon: '🤖',
      url: 'https://chatgpt.com/?q={query}',
      aliases: ['gpt', 'chatgpt', 'openai'],
      enabled: true
    },
    'claude': {
      id: 'claude',
      name: 'Claude',
      icon: '🎭',
      url: 'https://claude.ai/new?query={query}',
      aliases: ['claude', 'anthropic'],
      enabled: true
    },
    'copilot': {
      id: 'copilot',
      name: 'GitHub Copilot',
      icon: '💻',
      url: 'https://copilot.microsoft.com/?q={query}',
      aliases: ['copilot', 'github'],
      enabled: true
    },
    'perplexity': {
      id: 'perplexity',
      name: 'Perplexity',
      icon: '🔍',
      url: 'https://www.perplexity.ai/search?q={query}',
      aliases: ['perplexity', 'pplx'],
      enabled: true
    },
    'gemini': {
      id: 'gemini',
      name: 'Google Gemini',
      icon: '✨',
      url: 'https://gemini.google.com/?q={query}',
      aliases: ['gemini', 'bard', 'google'],
      enabled: true
    }
  };
}

// Load current settings and update UI
function loadCurrentSettings() {
  chrome.storage.sync.get(['defaultAI', 'enabledServices'], function(result) {
    const defaultAI = result.defaultAI || 'chatgpt';
    const enabledServices = result.enabledServices || {
      chatgpt: true, copilot: true, claude: true, perplexity: true
    };
    
    // Update current service display
    const aiService = AI_SERVICES[defaultAI];
    if (aiService) {
      document.getElementById('currentServiceIcon').textContent = aiService.icon;
      document.getElementById('currentServiceName').textContent = aiService.name;
      document.getElementById('openButtonText').textContent = `Open ${aiService.name}`;
    }
    
    // Populate AI services list
    populateAIServicesList(defaultAI, enabledServices);
  });
}

// Populate the AI services list in the popup
function populateAIServicesList(defaultAI, enabledServices) {
  const servicesList = document.getElementById('aiServicesList');
  servicesList.innerHTML = '';
  
  Object.entries(AI_SERVICES).forEach(([serviceId, service]) => {
    const isEnabled = enabledServices[serviceId];
    const isDefault = serviceId === defaultAI;
    
    const serviceItem = document.createElement('div');
    serviceItem.className = `ai-service-item ${isDefault ? 'default' : ''} ${!isEnabled ? 'disabled' : ''}`;
    
    const keywords = service.keywords.map(k => `${k}:`).join(', ');
    
    serviceItem.innerHTML = `
      <div class="service-info">
        <span>${service.icon}</span>
        <span>${service.name}</span>
        <span class="service-keywords">${keywords}</span>
      </div>
      <span class="service-status ${isDefault ? 'default' : ''} ${!isEnabled ? 'disabled' : ''}">
        ${isDefault ? 'Default' : (!isEnabled ? 'Disabled' : 'Enabled')}
      </span>
    `;
    
    servicesList.appendChild(serviceItem);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Open current default AI service
  document.getElementById('openCurrentAI').addEventListener('click', function() {
    chrome.storage.sync.get(['defaultAI'], function(result) {
      const defaultAI = result.defaultAI || 'chatgpt';
      const aiService = AI_SERVICES[defaultAI];
      chrome.tabs.create({ url: aiService.baseUrl });
      window.close();
    });
  });
  
  // Open settings page
  document.getElementById('openSettings').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
    window.close();
  });
}
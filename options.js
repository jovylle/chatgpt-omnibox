// AI Omnibox Extension - Options Page Script
// Handles user preferences and AI service selection

// AI Service configurations
const AI_SERVICES = {
  chatgpt: {
    name: 'ChatGPT',
    url: 'https://chat.openai.com/?q=%s',
    icon: '💬',
    keywords: ['gpt', 'chatgpt', 'openai'],
    aliases: ['g', 'chat', 'gpt4'],
    color: '#10a37f'
  },
  copilot: {
    name: 'GitHub Copilot',
    url: 'https://copilot.microsoft.com/?q=%s',
    icon: '🤖',
    keywords: ['copilot', 'microsoft', 'bing'],
    aliases: ['co', 'pilot', 'ms'],
    color: '#0078d4'
  },
  claude: {
    name: 'Claude AI',
    url: 'https://claude.ai/?q=%s',
    icon: '🧠',
    keywords: ['claude', 'anthropic'],
    aliases: ['c', 'ant', 'claude3'],
    color: '#cc785c'
  },
  perplexity: {
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/search?q=%s',
    icon: '🔎',
    keywords: ['perplexity', 'ppl', 'search'],
    aliases: ['p', 'ppl', 'px'],
    color: '#20b2aa'
  }
};

// DOM elements
let defaultServiceCards;
let toggles;
let saveButton;
let statusMessage;
let statsGrid;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  defaultServiceCards = document.querySelectorAll('.default-selection');
  toggles = document.querySelectorAll('.toggle-item input[type="checkbox"]');
  saveButton = document.getElementById('saveSettings');
  statusMessage = document.getElementById('statusMessage');
  statsGrid = document.getElementById('statsGrid');
  
  // Load current settings and stats
  loadSettings();
  loadStatistics();
  
  // Add event listeners
  setupEventListeners();
});

// Load saved settings from storage
function loadSettings() {
  chrome.storage.sync.get(['defaultAI', 'enabledServices'], function(result) {
    const defaultAI = result.defaultAI || 'chatgpt';
    const enabledServices = result.enabledServices || {
      chatgpt: true,
      copilot: true,
      claude: true,
      perplexity: true
    };
    
    // Update default AI radio button
    const radioButton = document.getElementById(`default-${defaultAI}`);
    if (radioButton) {
      radioButton.checked = true;
      updateSelectedCard(defaultAI);
    }
    
    // Update toggle switches
    Object.keys(enabledServices).forEach(serviceId => {
      const toggle = document.getElementById(`enable-${serviceId}`);
      if (toggle) {
        toggle.checked = enabledServices[serviceId];
      }
    });
  });
}

// Load and display usage statistics
function loadStatistics() {
  chrome.storage.sync.get(['userStats'], function(result) {
    const userStats = result.userStats || {
      totalSearches: 0,
      serviceUsage: {},
      recentSearches: [],
      favoriteServices: []
    };
    
    displayStatistics(userStats);
  });
}

// Display statistics in the UI
function displayStatistics(userStats) {
  if (!statsGrid) return;
  
  const totalSearches = userStats.totalSearches || 0;
  const serviceUsage = userStats.serviceUsage || {};
  const recentSearches = userStats.recentSearches || [];
  
  // Calculate favorite service
  const favoriteServiceId = Object.entries(serviceUsage)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'chatgpt';
  const favoriteService = AI_SERVICES[favoriteServiceId];
  
  statsGrid.innerHTML = `
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-icon">🔍</span>
        <span class="stat-title">Total Searches</span>
      </div>
      <div class="stat-value">${totalSearches}</div>
      <div class="stat-description">Searches performed since installation</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-icon">${favoriteService.icon}</span>
        <span class="stat-title">Favorite AI</span>
      </div>
      <div class="stat-value" style="font-size: 20px; color: ${favoriteService.color};">${favoriteService.name}</div>
      <div class="stat-description">${serviceUsage[favoriteServiceId] || 0} searches</div>
    </div>
    
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-icon">📊</span>
        <span class="stat-title">Service Usage</span>
      </div>
      <div class="usage-chart">
        ${generateUsageChart(serviceUsage, totalSearches)}
      </div>
    </div>
    
    <div class="stat-card">
      <div class="stat-header">
        <span class="stat-icon">🕒</span>
        <span class="stat-title">Recent Searches</span>
      </div>
      <div class="recent-searches">
        ${generateRecentSearches(recentSearches)}
      </div>
    </div>
  `;
}

// Generate usage chart HTML
function generateUsageChart(serviceUsage, totalSearches) {
  if (totalSearches === 0) {
    return '<div class="stat-description">No searches yet</div>';
  }
  
  return Object.entries(AI_SERVICES).map(([serviceId, service]) => {
    const usage = serviceUsage[serviceId] || 0;
    const percentage = totalSearches > 0 ? (usage / totalSearches) * 100 : 0;
    
    return `
      <div class="usage-bar">
        <div class="usage-service">${service.icon} ${service.name}</div>
        <div class="usage-progress">
          <div class="usage-fill" style="width: ${percentage}%; background: ${service.color};"></div>
        </div>
        <div class="usage-count">${usage}</div>
      </div>
    `;
  }).join('');
}

// Generate recent searches HTML
function generateRecentSearches(recentSearches) {
  if (recentSearches.length === 0) {
    return '<div class="stat-description">No recent searches</div>';
  }
  
  return recentSearches.slice(0, 5).map(search => {
    const service = AI_SERVICES[search.service];
    const timeAgo = getTimeAgo(search.timestamp);
    
    return `
      <div class="recent-item">
        <span class="recent-service">${service.icon}</span>
        <span class="recent-query">${search.query}</span>
        <span class="recent-time">${timeAgo}</span>
      </div>
    `;
  }).join('');
}

// Get human-readable time ago
function getTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

// Set up event listeners
function setupEventListeners() {
  // Default service card clicks
  defaultServiceCards.forEach(card => {
    card.addEventListener('click', function() {
      const service = this.dataset.service;
      const radioButton = document.getElementById(`default-${service}`);
      if (radioButton) {
        radioButton.checked = true;
        updateSelectedCard(service);
      }
    });
  });
  
  // Radio button changes for default AI
  const radioButtons = document.querySelectorAll('input[name="defaultAI"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        updateSelectedCard(this.value);
      }
    });
  });
  
  // Toggle switch changes
  toggles.forEach(toggle => {
    toggle.addEventListener('change', function() {
      // Visual feedback could be added here if desired
      console.log(`${this.id} toggled to ${this.checked}`);
    });
  });
  
  // Save button
  saveButton.addEventListener('click', saveSettings);
}

// Update visual selection of default service cards
function updateSelectedCard(selectedService) {
  defaultServiceCards.forEach(card => {
    card.classList.remove('selected');
    if (card.dataset.service === selectedService) {
      card.classList.add('selected');
    }
  });
}

// Save settings to storage
function saveSettings() {
  const defaultAI = document.querySelector('input[name="defaultAI"]:checked')?.value;
  
  if (!defaultAI) {
    showStatus('Please select a default AI service', 'error');
    return;
  }
  
  // Collect enabled services
  const enabledServices = {};
  toggles.forEach(toggle => {
    const serviceId = toggle.id.replace('enable-', '');
    enabledServices[serviceId] = toggle.checked;
  });
  
  // Ensure at least one service is enabled
  const hasEnabledService = Object.values(enabledServices).some(enabled => enabled);
  if (!hasEnabledService) {
    showStatus('Please enable at least one AI service', 'error');
    return;
  }
  
  // Ensure default AI is enabled
  if (!enabledServices[defaultAI]) {
    showStatus('Default AI service must be enabled', 'error');
    return;
  }
  
  // Save to storage
  chrome.storage.sync.set({
    defaultAI: defaultAI,
    enabledServices: enabledServices
  }, function() {
    if (chrome.runtime.lastError) {
      showStatus('Error saving settings', 'error');
      console.error('Settings save error:', chrome.runtime.lastError);
    } else {
      showStatus('Settings saved successfully!', 'success');
      
      // Notify background script of the change
      chrome.runtime.sendMessage({
        action: 'updateSettings',
        defaultAI: defaultAI,
        enabledServices: enabledServices
      });
    }
  });
}

// Show status message
function showStatus(message, type = 'success') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = 'block';
  
  // Hide after 3 seconds
  setTimeout(() => {
    statusMessage.style.display = 'none';
  }, 3000);
}

// Export AI_SERVICES for use by background script
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AI_SERVICES };
}
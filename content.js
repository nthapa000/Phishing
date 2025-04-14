// Function to extract search results
function extractSearchResults() {
    let results = [];
    let suspiciousUrls = [];
    
    // Try multiple selectors to find search results
    const selectors = [
        'div[data-sokoban-container] a[jscontroller="M9mgyc"]',  // Newer Google results
        'div.g a[href*="http"]',  // Traditional Google results
        'div[data-hveid] a[href*="http"]',  // Alternative selector
        'div[jscontroller="SC7lYd"] a[href*="http"]',  // Another common selector
        'h3 a'  // Fallback selector
    ];

    for (const selector of selectors) {
        const links = document.querySelectorAll(selector);
        if (links.length > 0) {
            links.forEach((link, index) => {
                if (index >= 10) return; // Limit to top 10 results
                
                const url = link.href;
                // Skip Google's own URLs
                if (url.includes('google.com')) return;
                
                const title = link.textContent.trim();
                const isSuspicious = isSuspiciousUrl(url) || analyzeUrlStructure(url);
                
                results.push({
                    url: url,
                    isSuspicious: isSuspicious,
                    title: title
                });
                
                if (isSuspicious) {
                    suspiciousUrls.push(url);
                }
            });
            break; // Stop if we found results with this selector
        }
    }
    
    return { results, suspiciousUrls };
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getResults") {
        const { results, suspiciousUrls } = extractSearchResults();
        console.log('Found results:', results); // Debug log
        sendResponse({ results: results, suspiciousUrls: suspiciousUrls });
    }
    return true; // Required for async response
});

// Function to check for suspicious URL patterns
function isSuspiciousUrl(url) {
    // List of trusted domains that should never be flagged
    const trustedDomains = [
        'youtube.com',
        'google.com',
        'facebook.com',
        'twitter.com',
        'linkedin.com',
        'github.com',
        'wikipedia.org',
        'amazon.com',
        'microsoft.com',
        'apple.com',
        'netflix.com',
        'spotify.com',
        'reddit.com',
        'instagram.com',
        'pinterest.com',
        'tumblr.com',
        'wordpress.com',
        'medium.com',
        'quora.com',
        'stackoverflow.com'
    ];

    // Check if URL is from a trusted domain
    try {
        const urlObj = new URL(url);
        if (trustedDomains.some(domain => urlObj.hostname.includes(domain))) {
            return false;
        }
    } catch (e) {
        return true; // Invalid URL is suspicious
    }

    // Basic URL structure check
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        
        // Check for IP addresses
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
            return true;
        }
        
        // Check for unusual characters in domain
        if (/[^a-zA-Z0-9.-]/.test(hostname)) {
            return true;
        }
        
        return false;
    } catch (e) {
        return true; // Invalid URL is suspicious
    }
}

// Function to check URL length and structure
function analyzeUrlStructure(url) {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const query = urlObj.search;
        const hostname = urlObj.hostname;
        
        // Check for excessive path length (more than 200 characters)
        if (path.length > 200) return true;
        
        // Check for excessive parameters (more than 20)
        if (query && query.split('&').length > 20) return true;
        
        // Check for excessive subdomains (more than 5)
        const subdomains = hostname.split('.').length - 2;
        if (subdomains > 5) return true;
        
        // Check for unusual characters in domain
        if (/[^a-zA-Z0-9.-]/.test(hostname)) return true;
        
        // Check for suspicious domain patterns
        if (/(\d{3,}|[a-z]{10,})/.test(hostname)) return true;
        
        // Check for suspicious TLDs
        const suspiciousTLDs = [
            'tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 
            'online', 'site', 'info', 'biz', 'pro', 'pw', 'cc', 
            'ws', 'buzz', 'click', 'link', 'live', 'stream', 
            'webcam', 'work', 'party', 'review', 'science'
        ];
        
        const tld = hostname.split('.').pop();
        if (suspiciousTLDs.includes(tld)) return true;
        
        return false;
    } catch (e) {
        return true; // Invalid URL is suspicious
    }
}

// Function to create warning popup
function createWarningPopup(url) {
    const popup = document.createElement('div');
    popup.className = 'warning-popup';
    popup.innerHTML = `
        <div class="warning-content">
            <div class="warning-header">
                <span class="warning-icon">⚠️</span>
                <h3>Warning</h3>
            </div>
            <p>This website has been marked as potentially suspicious. Proceed with caution.</p>
            <div class="warning-buttons">
                <button class="continue-btn">Continue Anyway</button>
                <button class="cancel-btn">Go Back</button>
            </div>
        </div>
    `;
    
    // Add event listeners to buttons
    const continueBtn = popup.querySelector('.continue-btn');
    const cancelBtn = popup.querySelector('.cancel-btn');
    
    continueBtn.addEventListener('click', () => {
        popup.remove();
        window.location.href = url; // Navigate to the URL after confirmation
    });
    
    cancelBtn.addEventListener('click', () => {
        popup.remove();
    });
    
    return popup;
}

// Function to create status chip
function createStatusChip(isSuspicious) {
    const chip = document.createElement('span');
    chip.className = 'url-status-chip';
    
    if (isSuspicious) {
        chip.textContent = '⚠️ Check URL';
        chip.classList.add('suspicious');
    } else {
        chip.textContent = '✅ Verified';
        chip.classList.add('verified');
    }
    
    return chip;
}

// Function to add chips to search results
function addChipsToResults() {
    // Try multiple selectors to find search results
    const selectors = [
        'div[data-sokoban-container]',  // Newer Google results
        'div.g',  // Traditional Google results
        'div[data-hveid]',  // Alternative selector
        'div[jscontroller="SC7lYd"]'  // Another common selector
    ];

    for (const selector of selectors) {
        const results = document.querySelectorAll(selector);
        if (results.length > 0) {
            results.forEach((result, index) => {
                if (index >= 10) return; // Limit to top 10 results
                
                const link = result.querySelector('a[href*="http"]');
                if (!link) return;
                
                const url = link.href;
                if (url.includes('google.com')) return;
                
                const isSuspicious = isSuspiciousUrl(url);
                
                // Create and add the chip
                const chip = createStatusChip(isSuspicious);
                link.parentNode.insertBefore(chip, link.nextSibling);
                
                // Add click handler to the link if suspicious
                if (isSuspicious) {
                    // Remove any existing click handlers
                    link.removeEventListener('click', handleSuspiciousClick);
                    // Add new click handler
                    link.addEventListener('click', handleSuspiciousClick);
                }
            });
            break;
        }
    }
}

// Separate function for handling suspicious clicks
function handleSuspiciousClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const url = this.href;
    const popup = createWarningPopup(url);
    document.body.appendChild(popup);
}

// Add CSS styles to the page
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .url-status-chip {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            margin-left: 8px;
            line-height: 1.4;
            transition: all 0.2s ease;
            cursor: pointer;
            user-select: none;
        }
        
        .url-status-chip.verified {
            background-color: #e6f4ea;
            color: #1e8e3e;
            border: 1px solid #1e8e3e;
        }
        
        .url-status-chip.suspicious {
            background-color: #fce8e6;
            color: #d93025;
            border: 1px solid #d93025;
        }
        
        .url-status-chip:hover {
            opacity: 0.9;
            transform: translateY(-1px);
        }
        
        /* Warning popup styles */
        .warning-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        
        .warning-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .warning-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .warning-icon {
            font-size: 24px;
            margin-right: 10px;
        }
        
        .warning-header h3 {
            margin: 0;
            color: #d93025;
        }
        
        .warning-content p {
            margin-bottom: 20px;
            line-height: 1.5;
        }
        
        .warning-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
        }
        
        .warning-buttons button {
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        
        .continue-btn {
            background-color: #1a73e8;
            color: white;
        }
        
        .continue-btn:hover {
            background-color: #1557b0;
        }
        
        .cancel-btn {
            background-color: #f1f3f4;
            color: #3c4043;
        }
        
        .cancel-btn:hover {
            background-color: #e8eaed;
        }
        
        /* Ensure proper spacing in Google's search results */
        .g .url-status-chip {
            margin-top: 4px;
            display: inline-block;
        }
        
        /* Adjust for newer Google results layout */
        [data-sokoban-container] .url-status-chip {
            margin-top: 2px;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
}

// Wait for the page to load and then add chips
window.addEventListener("load", function() {
    // Add styles first
    addStyles();
    
    // Small delay to ensure all elements are loaded
    setTimeout(function() {
        addChipsToResults();
        
        // Also send data to background script for popup
        const { results, suspiciousUrls } = extractSearchResults();
        chrome.runtime.sendMessage({ 
            urls: results,
            suspiciousUrls: suspiciousUrls
        });
    }, 1000);
}); 
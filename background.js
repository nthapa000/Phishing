// Store the latest URLs and suspicious URLs
let latestUrls = [];
let suspiciousUrls = [];

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    // If message contains URLs, store them
    if (message.urls) {
        latestUrls = message.urls;
        suspiciousUrls = message.suspiciousUrls || [];
        console.log('Stored URLs:', latestUrls);
        console.log('Suspicious URLs:', suspiciousUrls);
    }
    
    // If message requests URLs, send them
    if (message.getUrls) {
        console.log('Sending URLs:', latestUrls);
        sendResponse({ 
            urls: latestUrls,
            suspiciousUrls: suspiciousUrls
        });
    }
    
    return true; // Required for async response
}); 
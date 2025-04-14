// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const urlList = document.getElementById("urlList");
    const statsDiv = document.getElementById("stats");
    
    if (!urlList) {
        console.error("URL list element not found");
        return;
    }

    // Show loading state
    urlList.innerHTML = "<p class='no-results'>Loading results...</p>";

    // Function to format URL
    function formatUrl(url) {
        try {
            const urlObj = new URL(url);
            let displayUrl = urlObj.hostname;
            if (urlObj.pathname !== '/') {
                displayUrl += urlObj.pathname.substring(0, 30);
                if (urlObj.pathname.length > 30) {
                    displayUrl += '...';
                }
            }
            return displayUrl;
        } catch (e) {
            return url;
        }
    }

    // Request URLs from background script
    chrome.runtime.sendMessage({ getUrls: true }, function(response) {
        if (!response || !response.urls || response.urls.length === 0) {
            urlList.innerHTML = "<p class='no-results'>No URLs found. Try searching on Google.</p>";
            return;
        }

        // Clear loading state
        urlList.innerHTML = '';
        
        let suspiciousCount = 0;

        // Add each URL to the list
        response.urls.forEach(function(result, index) {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            
            if (result.isSuspicious) {
                listItem.classList.add("suspicious");
                suspiciousCount++;
            }
            
            link.href = result.url;
            link.textContent = `${index + 1}. ${formatUrl(result.url)}`;
            if (result.isSuspicious) {
                const warning = document.createElement("span");
                warning.textContent = "⚠️ Suspicious";
                warning.classList.add("warning");
                link.appendChild(warning);
            }
            link.target = "_blank";
            link.title = result.url;
            
            listItem.appendChild(link);
            urlList.appendChild(listItem);
        });

        // Update stats
        statsDiv.textContent = `Found ${suspiciousCount} suspicious URLs out of ${response.urls.length} total`;
    });
}); 
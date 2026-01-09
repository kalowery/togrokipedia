// Track tabs we're processing to avoid redirect loops
const processingTabs = new Set();

// Intercept Wikipedia navigation using tabs.onUpdated
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only process when the tab starts loading and has a URL
  if (changeInfo.status !== 'loading' || !tab.url) {
    return;
  }
  
  // Skip if we're already processing this tab
  if (processingTabs.has(tabId)) {
    return;
  }
  
  const url = tab.url;
  
  // Check if this is a Wikipedia URL
  if (!url.startsWith('https://en.wikipedia.org/wiki')) {
    return;
  }
  
  // Mark this tab as being processed
  processingTabs.add(tabId);
  
  // Replace Wikipedia prefix with Grokipedia prefix
  const grokipediaUrl = url.replace(
    'https://en.wikipedia.org/wiki',
    'https://grokipedia.com/page'
  );
  
  try {
    // Check if the Grokipedia page exists with a HEAD request
    const response = await fetch(grokipediaUrl, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit'
    });
    
    // Check if the response indicates the page exists (status 200-299)
    if (response.ok) {
      // Redirect to Grokipedia
      chrome.tabs.update(tabId, { url: grokipediaUrl });
    }
    // If page doesn't exist, do nothing - let Wikipedia load normally
  } catch (error) {
    // If HEAD request fails (network error, CORS issue, etc.),
    // let Wikipedia load normally
  } finally {
    // Remove from processing set after a short delay to allow redirect
    setTimeout(() => {
      processingTabs.delete(tabId);
    }, 1000);
  }
});

// Also handle webNavigation for better coverage
chrome.webNavigation.onBeforeNavigate.addListener(
  async function(details) {
    // Only process main frame navigations
    if (details.frameId !== 0) {
      return;
    }
    
    // Skip if we're already processing this tab
    if (processingTabs.has(details.tabId)) {
      return;
    }
    
    const url = details.url;
    
    // Check if this is a Wikipedia URL
    if (!url.startsWith('https://en.wikipedia.org/wiki')) {
      return;
    }
    
    // Mark this tab as being processed
    processingTabs.add(details.tabId);
    
    // Replace Wikipedia prefix with Grokipedia prefix
    const grokipediaUrl = url.replace(
      'https://en.wikipedia.org/wiki',
      'https://grokipedia.com/page'
    );
    
    try {
      // Check if the Grokipedia page exists with a HEAD request
      const response = await fetch(grokipediaUrl, {
        method: 'HEAD',
        mode: 'cors',
        credentials: 'omit'
      });
      
      // Check if the response indicates the page exists (status 200-299)
      if (response.ok) {
        // Redirect to Grokipedia
        chrome.tabs.update(details.tabId, { url: grokipediaUrl });
      }
      // If page doesn't exist, do nothing - let Wikipedia load normally
    } catch (error) {
      // If HEAD request fails (network error, CORS issue, etc.),
      // let Wikipedia load normally
    } finally {
      // Remove from processing set after a short delay
      setTimeout(() => {
        processingTabs.delete(details.tabId);
      }, 1000);
    }
  },
  {
    url: [{ urlPrefix: 'https://en.wikipedia.org/wiki' }]
  }
);

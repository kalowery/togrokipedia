// Content script to modify Wikipedia links in HTML pages
(function() {
  // Function to modify links
  function modifyLinks() {
    // Find all anchor tags with href attributes
    const links = document.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if the link starts with https://en.wikipedia.org/wiki
      if (href && href.startsWith('https://en.wikipedia.org/wiki')) {
        // Replace the prefix
        const newHref = href.replace(
          'https://en.wikipedia.org/wiki',
          'https://grokipedia.com/page'
        );
        link.setAttribute('href', newHref);
      }
    });
  }
  
  // Run immediately when the script loads
  modifyLinks();
  
  // Also run when the DOM is fully loaded (in case links are added dynamically)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', modifyLinks);
  }
  
  // Use MutationObserver to handle dynamically added links
  const observer = new MutationObserver(function(mutations) {
    let shouldModify = false;
    
    mutations.forEach(function(mutation) {
      // Check if any added nodes contain links
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) { // Element node
          if (node.tagName === 'A' && node.hasAttribute('href')) {
            shouldModify = true;
          } else if (node.querySelectorAll) {
            const links = node.querySelectorAll('a[href]');
            if (links.length > 0) {
              shouldModify = true;
            }
          }
        }
      });
    });
    
    if (shouldModify) {
      modifyLinks();
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();

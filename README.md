# Grokipedia Redirect Chrome Extension

A Chrome browser extension that automatically redirects Wikipedia URLs to Grokipedia when the corresponding page exists.

## Features

- Intercepts navigation to `https://en.wikipedia.org/wiki/*` URLs
- Checks if a corresponding page exists on `https://grokipedia.com/page/*`
- Automatically redirects to Grokipedia if the page exists
- Falls back to Wikipedia if the Grokipedia page doesn't exist

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the directory containing this extension
5. The extension should now be installed and active

## How It Works

1. When you navigate to any Wikipedia article (URLs starting with `https://en.wikipedia.org/wiki`), the extension intercepts the request
2. It replaces the Wikipedia prefix with the Grokipedia prefix (`https://grokipedia.com/page`)
3. It performs a HEAD request to check if the Grokipedia page exists
4. If the page exists (HTTP 200-299), it redirects you to Grokipedia
5. If the page doesn't exist or there's an error, you proceed to Wikipedia as normal

## Files

- `manifest.json` - Extension configuration and permissions
- `background.js` - Service worker that handles URL interception and redirection logic

## Permissions

The extension requires:
- `webRequest` permission to intercept navigation requests
- Host permissions for `en.wikipedia.org` and `grokipedia.com` to check and redirect URLs

## Development

To modify the extension:
1. Edit the files as needed
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card to reload it

## Notes

- The extension only intercepts main frame navigations (not iframes or sub-resources)
- If Grokipedia's server doesn't allow CORS requests, the extension will fall back to Wikipedia
- The extension works automatically - no user interaction required

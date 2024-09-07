// background.js 

let autoClickActive = false; 

// Message listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAutoClick') {
    autoClickActive = !autoClickActive;

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Check if the tab matches TWA Hamster Kombat
      if (tabs[0].url.includes('hamsterkombatgame.io')) {
        // Inject toggleAutoClicker 
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: toggleAutoClicker,
          args: [autoClickActive] 
        });
      }
    });
  } 
});

// Function that is injected into the game window
function toggleAutoClicker(isActive) { 
  let count = 0;
  const consoleYellow = 'font-weight: bold; color: yellow;';
  const consoleRed = 'font-weight: bold; color: red;';
  const consoleGreen = 'font-weight: bold; color: green;';
  const consolePrefix = '%c [AutoClicker] ';

  async function click() {
    if (!isActive) return;  // Check isActive at the start of click()
    try {
      const element = document.querySelector('button.user-tap-button'); 
      if (element) {
        const pointerUpEvent = new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          pointerType: 'mouse'
        });
        element.dispatchEvent(pointerUpEvent);
        count++;
        const balance = document.querySelector('#__nuxt > div > main > div > div.user-balance-large > div > p').textContent;
        console.log(`${consolePrefix}Success clicked (${count})`, consoleGreen);
        console.log(`${consolePrefix}Balance: ${balance}`, consoleYellow);
      } else {
        console.log(`${consolePrefix}Button not found. Retrying...`, consoleRed);
      }
      // Latency:  147.7 ms & 251.2 ms
      setTimeout(click, Math.random() * (91.2 - 27.7) + 27.7); 
    } catch (e) {
      console.log(`${consolePrefix}Deactivated`, consoleRed);
      
      // Send a message back to extension to refresh the button
      chrome.runtime.sendMessage({ action: 'updateButton', isActive: false });  
    }
  }

  // Inject waitForElement right into toggleAutoClicker
  function waitForElement(selector, callback) {
    if (document.querySelector(selector)) {
      callback();
    } else {
      setTimeout(() => waitForElement(selector, callback), 100);
    }
  }  

  if (isActive) {
    waitForElement('button.user-tap-button', click); 
  }
}

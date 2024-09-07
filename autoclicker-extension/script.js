document.getElementById('toggleButton').addEventListener('click', () => {
  // Send a message to background.js
  chrome.runtime.sendMessage({ action: 'toggleAutoClick' }); 

  // Change the button text
  const button = document.getElementById('toggleButton');
  button.innerText = button.innerText === 'Enable' ? 'Disable' : 'Enable'; 
});

// Message listener (from background.js)
chrome.runtime.onMessage.addListener(request => {
  if (request.action === 'updateButton') {
    // Refresh the button
    document.getElementById('toggleButton').innerText = request.isActive ? 'Disable' : 'Enable';
  }
});

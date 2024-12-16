const messagesContainer = document.getElementById('messagesContainer');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const loadingSpinner = document.getElementById('loadingSpinner');
const sidebar = document.getElementById('sidebar');
const toggleButton = document.getElementById('toggleButton');
const chatContainer = document.querySelector('.chatbot-container');

// API Key and URL
const API_KEY = "AIzaSyB0--Lc9l52u-wtyBDpXsidWmBZVnQoRyc";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;


// LocalStorage Key
const HISTORY_KEY = 'chatHistory';

// Load history from LocalStorage
function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    sidebar.innerHTML = `<h2>Chat History</h2>`;
    
    history.forEach((prompt, index) => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
  
      // Add the prompt text
      historyItem.innerHTML = `
        <span class="prompt-text">${prompt}</span>
        <button class="delete-button">Delete</button>
      `;
  
      // Add click event to load the prompt into the input
      const promptText = historyItem.querySelector('.prompt-text');
      promptText.addEventListener('click', () => {
        userInput.value = prompt;
        sendButton.click(); // Send the saved prompt automatically
      });
  
      // Add click event to delete the history item
      const deleteButton = historyItem.querySelector('.delete-button');
      deleteButton.addEventListener('click', () => {
        // Remove item from history array
        history.splice(index, 1);
        // Save updated history back to localStorage
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        // Reload the history display
        loadHistory();
      });
  
      // Append the item to the sidebar
      sidebar.appendChild(historyItem);
    });
  }
  

// Save input to LocalStorage
function saveToHistory(input) {
  let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  if (!history.includes(input)) {
    history.unshift(input); // Add new input to the top
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10))); // Keep only the last 10 items
    loadHistory();
  }
}
// Add Event Listener to Send Button
// Updated section to handle code blocks
// sendButton.addEventListener('click', async () => {
//     const userMessage = userInput.value;
//     if (userMessage.trim()) {
//         // Add user message to the chat
//         const userMessageElem = document.createElement('div');
//         userMessageElem.className = 'message user-message';
//         userMessageElem.textContent = userMessage;
//         messagesContainer.appendChild(userMessageElem);

//         // Save to history
//         saveToHistory(userMessage);

//         // Clear input field
//         userInput.value = '';

//         // Scroll to the bottom
//         messagesContainer.scrollTop = messagesContainer.scrollHeight;

//         // Show loading spinner
//         loadingSpinner.style.display = 'inline-block';

//         try {
//             // Make API request to get bot response
//             const response = await fetch(API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     contents: [
//                         {
//                             parts: [
//                                 { text: userMessage }
//                             ]
//                         }
//                     ]
//                 }),
//             });

//             const data = await response.json();

//             // Extract and display the bot response
//             if (data && data.candidates && data.candidates.length > 0) {
//                 const botResponse = data.candidates[0].content.parts[0].text;

//                 const botMessageElem = document.createElement('div');
//                 botMessageElem.className = 'message bot-message';

//                 // Separate code blocks and plain text
//                 const codeRegex = /```([\s\S]*?)```/g;
//                 let match;
//                 let lastIndex = 0;

//                 while ((match = codeRegex.exec(botResponse)) !== null) {
//                     // Append plain text before the code block
//                     const plainText = botResponse.substring(lastIndex, match.index).trim();
//                     if (plainText) {
//                         const plainTextElem = document.createElement('span');
//                         plainTextElem.textContent = plainText;
//                         botMessageElem.appendChild(plainTextElem);
//                     }

//                     // Append the code block
//                     const codeContent = match[1].trim();
//                     const pre = document.createElement('pre');
//                     const code = document.createElement('code');
//                     code.textContent = codeContent;
//                     pre.appendChild(code);
//                     botMessageElem.appendChild(pre);
//                     lastIndex = match.index + match[0].length;
//                 }

//                 // Append remaining plain text after the last code block
//                 const remainingText = botResponse.substring(lastIndex).trim();
//                 if (remainingText) {
//                     const remainingTextElem = document.createElement('span');
//                     remainingTextElem.textContent = remainingText;
//                     botMessageElem.appendChild(remainingTextElem);
//                 }

//                 // Add copy icon for the entire response
//                 const copyIcon = document.createElement('span');
//                 copyIcon.className = 'copy-icon';
//                 copyIcon.innerHTML = '&#128203;'; // Clipboard emoji
//                 copyIcon.title = 'Copy';
//                 botMessageElem.appendChild(copyIcon);

//                 // Add event listener to copy response text
//                 copyIcon.addEventListener('click', () => {
//                     navigator.clipboard.writeText(botResponse).then(() => {
//                         // Feedback for copy action (optional)
//                         console.log('Response copied to clipboard');
//                     });
//                 });

//                 messagesContainer.appendChild(botMessageElem);
//             } else {
//                 throw new Error("No valid response from the API");
//             }
//         } catch (error) {
//             console.error("Error fetching bot response:", error);
//             const errorMessageElem = document.createElement('div');
//             errorMessageElem.className = 'message bot-message';
//             errorMessageElem.textContent = "Oops! Something went wrong. Please try again.";
//             messagesContainer.appendChild(errorMessageElem);
//         } finally {
//             // Hide loading spinner
//             loadingSpinner.style.display = 'none';

//             // Scroll to the bottom
//             messagesContainer.scrollTop = messagesContainer.scrollHeight;
//         }
//     }
// });
// new code
// Handle message sending
async function sendMessage() {
  const userMessage = userInput.value;
  if (userMessage.trim()) {
      // Add user message to the chat
      const userMessageElem = document.createElement('div');
      userMessageElem.className = 'message user-message';
      userMessageElem.textContent = userMessage;
      messagesContainer.appendChild(userMessageElem);

      // Save to history
      saveToHistory(userMessage);

      // Clear input field
      userInput.value = '';

      // Scroll to the bottom
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Show loading spinner
      loadingSpinner.style.display = 'inline-block';

      try {
          // Make API request to get bot response
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  contents: [
                      {
                          parts: [
                              { text: userMessage }
                          ]
                      }
                  ]
              }),
          });

          const data = await response.json();

          // Extract and display the bot response
          if (data && data.candidates && data.candidates.length > 0) {
              const botResponse = data.candidates[0].content.parts[0].text;

              const botMessageElem = document.createElement('div');
              botMessageElem.className = 'message bot-message';

              // Separate code blocks and plain text
              const codeRegex = /```([\s\S]*?)```/g;
              let match;
              let lastIndex = 0;

              while ((match = codeRegex.exec(botResponse)) !== null) {
                  // Append plain text before the code block
                  const plainText = botResponse.substring(lastIndex, match.index).trim();
                  if (plainText) {
                      const plainTextElem = document.createElement('span');
                      plainTextElem.textContent = plainText;
                      botMessageElem.appendChild(plainTextElem);
                  }

                  // Append the code block
                  const codeContent = match[1].trim();
                  const pre = document.createElement('pre');
                  const code = document.createElement('code');
                  code.textContent = codeContent;
                  pre.appendChild(code);
                  botMessageElem.appendChild(pre);
                  lastIndex = match.index + match[0].length;
              }

              // Append remaining plain text after the last code block
              const remainingText = botResponse.substring(lastIndex).trim();
              if (remainingText) {
                  const remainingTextElem = document.createElement('span');
                  remainingTextElem.textContent = remainingText;
                  botMessageElem.appendChild(remainingTextElem);
              }

              // Add copy icon for the entire response
              const copyIcon = document.createElement('span');
              copyIcon.className = 'copy-icon';
              copyIcon.innerHTML = '&#128203;'; // Clipboard emoji
              copyIcon.title = 'Copy';
              botMessageElem.appendChild(copyIcon);

              // Add event listener to copy response text
              copyIcon.addEventListener('click', () => {
                  navigator.clipboard.writeText(botResponse).then(() => {
                      // Feedback for copy action (optional)
                      console.log('Response copied to clipboard');
                  });
              });

              messagesContainer.appendChild(botMessageElem);
          } else {
              throw new Error("No valid response from the API");
          }
      } catch (error) {
          console.error("Error fetching bot response:", error);
          const errorMessageElem = document.createElement('div');
          errorMessageElem.className = 'message bot-message';
          errorMessageElem.textContent = "Oops! Something went wrong. Please try again.";
          messagesContainer.appendChild(errorMessageElem);
      } finally {
          // Hide loading spinner
          loadingSpinner.style.display = 'none';

          // Scroll to the bottom
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
  }
}

// Add event listener for Send button
sendButton.addEventListener('click', sendMessage);

// Add event listener for Enter key in input field
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
      sendMessage();
  }
});

// new end 

// Toggle Sidebar Functionality
toggleButton.addEventListener('click', () => {
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    sidebar.classList.add('closed');
    chatContainer.style.paddingLeft = '0';
  } else {
    sidebar.classList.remove('closed');
    sidebar.classList.add('open');
    chatContainer.style.paddingLeft = '260px'; // Adjust padding for the sidebar width
  }
});

// Initialize Sidebar with History

loadHistory();

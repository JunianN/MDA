document.addEventListener("DOMContentLoaded", function () {
  // Initialize data manager
  const dataManager = new ShoppingDataManager();

  const chatToggle = document.getElementById("chatToggle");
  const chatInterface = document.getElementById("chatInterface");
  const closeChat = document.querySelector(".btn-close-chat");
  const chatInput = document.querySelector(".chat-input input");
  const sendButton = document.querySelector(".btn-send");
  const chatMessages = document.querySelector(".chat-messages");
  const suggestionChips = document.querySelectorAll(".suggestion-chip");

  // Toggle chat interface
  chatToggle.addEventListener("click", () => {
    chatInterface.classList.add("active");
    chatToggle.style.display = "none";
  });

  // Close chat interface
  closeChat.addEventListener("click", () => {
    chatInterface.classList.remove("active");
    chatToggle.style.display = "flex";
  });

  // Handle send message
  function sendMessage(message) {
    if (!message.trim()) return;

    // Add user message
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.innerHTML = `
            <div class="message-content">${message}</div>
        `;
    chatMessages.appendChild(userMessage);

    // Clear input
    chatInput.value = "";

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Process the message for CRUD operations
    processUserMessage(message);
  }

  // Process user message for CRUD operations
  function processUserMessage(message) {
    const msg = message.toLowerCase();
    let response;

    // Create operations
    if (msg.startsWith("create list")) {
      const listName = message.substring(12).trim();
      if (dataManager.createList(listName)) {
        response = `I've created a new shopping list called "${listName}". You can now add items to it!`;
      } else {
        response = `A list with the name "${listName}" already exists. Would you like to add items to it?`;
      }
    }
    // Add item to list
    else if (msg.startsWith("add") && msg.includes("to list")) {
      const parts = message.split("to list");
      const itemName = parts[0].substring(4).trim();
      const listName = parts[1].trim();

      const item = {
        name: itemName,
        category: detectCategory(itemName),
        timestamp: new Date().toISOString(),
      };

      if (dataManager.addItemToList(listName, item)) {
        response = `Added "${itemName}" to your "${listName}" list. Anything else you'd like to add?`;
      } else {
        response = `I couldn't find a list called "${listName}". Would you like to create it first?`;
      }
    }
    // View list
    else if (msg.startsWith("show list") || msg.startsWith("view list")) {
      const listName = message
        .substring(msg.startsWith("show") ? 10 : 10)
        .trim();
      const items = dataManager.getList(listName);

      if (items.length > 0) {
        response =
          `Here are the items in your "${listName}" list:\n` +
          items.map((item) => `• ${item.name}`).join("\n");
      } else {
        response = `The list "${listName}" is empty or doesn't exist. Would you like to create it?`;
      }
    }
    // Show all lists
    else if (msg === "show all lists" || msg === "view all lists") {
      const lists = dataManager.getAllLists();
      if (lists.length > 0) {
        response =
          `Here are all your shopping lists:\n` +
          lists.map((list) => `• ${list}`).join("\n");
      } else {
        response =
          "You don't have any shopping lists yet. Would you like to create one?";
      }
    }
    // Delete list
    else if (msg.startsWith("delete list")) {
      const listName = message.substring(11).trim();
      if (dataManager.deleteList(listName)) {
        response = `I've deleted the "${listName}" list.`;
      } else {
        response = `I couldn't find a list called "${listName}".`;
      }
    }
    // Add to favorites
    else if (msg.startsWith("favorite") || msg.startsWith("add to favorites")) {
      const itemName = msg.startsWith("favorite")
        ? message.substring(9).trim()
        : message.substring(16).trim();

      const item = {
        name: itemName,
        category: detectCategory(itemName),
      };

      if (dataManager.addToFavorites(item)) {
        response = `Added "${itemName}" to your favorites!`;
      } else {
        response = `"${itemName}" is already in your favorites.`;
      }
    }
    // View favorites
    else if (msg === "show favorites" || msg === "view favorites") {
      const favorites = dataManager.getFavorites();
      if (favorites.length > 0) {
        response =
          `Here are your favorite items:\n` +
          favorites.map((item) => `• ${item.name}`).join("\n");
      } else {
        response =
          "You don't have any favorites yet. Would you like to add some?";
      }
    }
    // View history
    else if (msg === "show history" || msg === "view history") {
      const history = dataManager.getHistory();
      if (history.length > 0) {
        response =
          `Here are your recent shopping activities:\n` +
          history.map((item) => `• ${item.name}`).join("\n");
      } else {
        response = "Your shopping history is empty.";
      }
    }
    // Search
    else if (msg.startsWith("search")) {
      const searchTerm = message.substring(7).trim();
      const results = dataManager.searchItems(searchTerm);

      if (results.length > 0) {
        response =
          `Here's what I found for "${searchTerm}":\n` +
          results.map((item) => `• ${item.name}`).join("\n");
      } else {
        response = `I couldn't find any items matching "${searchTerm}".`;
      }
    }
    // Default bot response for other queries
    else {
      response = getBotResponse(message);
    }

    // Add bot response
    setTimeout(() => {
      const botMessage = document.createElement("div");
      botMessage.className = "message bot";
      botMessage.innerHTML = `
                <div class="message-content">${response}</div>
            `;
      chatMessages.appendChild(botMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
  }

  // Detect category based on item name
  function detectCategory(itemName) {
    itemName = itemName.toLowerCase();

    const categories = {
      fashion: ["shirt", "pants", "dress", "shoes", "clothing", "wear"],
      electronics: ["phone", "laptop", "gadget", "device", "computer"],
      food: ["food", "meal", "snack", "drink", "grocery"],
      travel: ["ticket", "hotel", "flight", "trip", "tour"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => itemName.includes(keyword))) {
        return category;
      }
    }

    return "other";
  }

  // Handle send button click
  sendButton.addEventListener("click", () => {
    sendMessage(chatInput.value);
  });

  // Handle enter key press
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage(chatInput.value);
    }
  });

  // Handle suggestion chips
  suggestionChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      sendMessage(chip.textContent);
    });
  });

  // Original bot response logic
  function getBotResponse(message) {
    message = message.toLowerCase();

    if (message.includes("deal") || message.includes("best deals")) {
      return `Here are today's best deals:
            • 50% off on selected fashion items
            • Buy 1 Get 1 on electronics
            • Special travel packages starting from Rp 1,999,000
            
            Would you like me to show you more details about any of these?`;
    }

    if (message.includes("fashion") || message.includes("clothes")) {
      return `Based on your style preferences, I recommend:
            • Trending summer collection
            • New arrivals from local designers
            • Exclusive brand collaborations
            
            I can help you find specific items or browse by category.`;
    }

    if (message.includes("tech") || message.includes("gadget")) {
      return `Here are the top tech recommendations:
            • Latest smartphones with special bank discounts
            • Smart home devices with installment options
            • Gaming accessories with cashback
            
            Would you like to see detailed specs and reviews?`;
    }

    if (message.includes("price") || message.includes("compare")) {
      return `I can help you compare prices across different stores. 
            Please provide the specific product you're interested in, and I'll find the best deals for you.`;
    }

    return `I can help you with:
        • Creating and managing shopping lists
        • Adding items to favorites
        • Viewing your shopping history
        • Finding the best deals
        • Product recommendations
        • Price comparisons
        
        Try commands like:
        • "create list [name]"
        • "add [item] to list [name]"
        • "show list [name]"
        • "show all lists"
        • "favorite [item]"
        • "show favorites"
        • "show history"
        • "search [term]"`;
  }
});

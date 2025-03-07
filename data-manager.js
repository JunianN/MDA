class ShoppingDataManager {
  constructor() {
    this.loadData();
  }

  // Load data from localStorage
  loadData() {
    this.shoppingLists =
      JSON.parse(localStorage.getItem("shoppingLists")) || {};
    this.favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    this.history = JSON.parse(localStorage.getItem("shoppingHistory")) || [];
  }

  // Save data to localStorage
  saveData() {
    localStorage.setItem("shoppingLists", JSON.stringify(this.shoppingLists));
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
    localStorage.setItem("shoppingHistory", JSON.stringify(this.history));
  }

  // Shopping Lists CRUD
  createList(listName) {
    if (!this.shoppingLists[listName]) {
      this.shoppingLists[listName] = [];
      this.saveData();
      return true;
    }
    return false;
  }

  addItemToList(listName, item) {
    if (this.shoppingLists[listName]) {
      this.shoppingLists[listName].push({
        id: Date.now(),
        ...item,
        timestamp: new Date().toISOString(),
      });
      this.saveData();
      return true;
    }
    return false;
  }

  getList(listName) {
    return this.shoppingLists[listName] || [];
  }

  getAllLists() {
    return Object.keys(this.shoppingLists);
  }

  updateListItem(listName, itemId, updatedItem) {
    if (this.shoppingLists[listName]) {
      const index = this.shoppingLists[listName].findIndex(
        (item) => item.id === itemId
      );
      if (index !== -1) {
        this.shoppingLists[listName][index] = {
          ...this.shoppingLists[listName][index],
          ...updatedItem,
          lastModified: new Date().toISOString(),
        };
        this.saveData();
        return true;
      }
    }
    return false;
  }

  deleteList(listName) {
    if (this.shoppingLists[listName]) {
      delete this.shoppingLists[listName];
      this.saveData();
      return true;
    }
    return false;
  }

  deleteItemFromList(listName, itemId) {
    if (this.shoppingLists[listName]) {
      const index = this.shoppingLists[listName].findIndex(
        (item) => item.id === itemId
      );
      if (index !== -1) {
        this.shoppingLists[listName].splice(index, 1);
        this.saveData();
        return true;
      }
    }
    return false;
  }

  // Favorites CRUD
  addToFavorites(item) {
    if (!this.favorites.find((fav) => fav.id === item.id)) {
      this.favorites.push({
        id: Date.now(),
        ...item,
        timestamp: new Date().toISOString(),
      });
      this.saveData();
      return true;
    }
    return false;
  }

  getFavorites() {
    return this.favorites;
  }

  removeFromFavorites(itemId) {
    const index = this.favorites.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      this.favorites.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Shopping History
  addToHistory(item) {
    this.history.unshift({
      id: Date.now(),
      ...item,
      timestamp: new Date().toISOString(),
    });
    this.saveData();
  }

  getHistory(limit = 10) {
    return this.history.slice(0, limit);
  }

  clearHistory() {
    this.history = [];
    this.saveData();
  }

  // Search functionality
  searchItems(query, category = null) {
    query = query.toLowerCase();
    let results = [];

    // Search in shopping lists
    Object.values(this.shoppingLists).forEach((list) => {
      results = results.concat(
        list.filter(
          (item) =>
            (!category || item.category === category) &&
            (item.name.toLowerCase().includes(query) ||
              item.description?.toLowerCase().includes(query))
        )
      );
    });

    // Search in favorites
    results = results.concat(
      this.favorites.filter(
        (item) =>
          (!category || item.category === category) &&
          (item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query))
      )
    );

    return results;
  }
}

// Export the data manager
window.ShoppingDataManager = ShoppingDataManager;

const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearAllButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

function displayItemsFromStorage() {
  const itemsFromStorage = getItemsFromStorage();
  if (itemsFromStorage.length === 0) {
    return;
  } else {
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
  }
}

function onAddItemSubmit(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Add item to the DOM as a list item
  addItemToDOM(newItem);

  // Updates localStorage to include new items
  addItemToStorage(newItem);

  // Checks UI since items have been added
  checkUI();

  itemInput.value = '';
}

function addItemToDOM(item) {
  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  // Add new item to the array, then stringify and set the item to localStorage
  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  // If no items stored localStorage, start with a new array
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    // If there are items in storage, parse it as an array
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function removeItem(e) {
  // Checks if the icon being clicked is part of a button with the class remove-item. If true, removes the list item.
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure?')) {
      e.target.parentElement.parentElement.remove();
      checkUI();
    }
  }
}

function clearAllItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  checkUI();
}

// Checks whether filter items form and clear all button should be displayed. If no list items, these should not be displayed.
function checkUI() {
  const items = itemList.querySelectorAll('li');

  if (items.length === 0) {
    clearAllButton.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearAllButton.style.display = 'block';
    itemFilter.style.display = 'block';
  }
}

function filterItems(e) {
  const filterInput = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll('li');

  // Loops through all shopping list items. If the input string is not included in a list item then it hides that element (display = none).
  // If the input string is included in the list item, it sets its display to 'flex' in case it was previously hidden.
  items.forEach((item) => {
    const itemName = item.textContent.toLowerCase();
    if (!itemName.includes(filterInput)) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', removeItem);
  clearAllButton.addEventListener('click', clearAllItems);
  window.addEventListener('load', checkUI);
  document.addEventListener('DOMContentLoaded', displayItemsFromStorage);
  itemFilter.addEventListener('keyup', filterItems);
}

init();

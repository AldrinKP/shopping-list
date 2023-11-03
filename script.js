const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearAllButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Create list item
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(newItem));

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);

  checkUI();

  itemInput.value = '';
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

// Event Listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearAllButton.addEventListener('click', clearAllItems);
window.addEventListener('load', checkUI);
itemFilter.addEventListener('keyup', filterItems);

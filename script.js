const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearAllButton = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const addEditItemButton = document.getElementById('add-edit-btn');
let isEditMode = false;

function displayItemsFromStorage() {
	const itemsFromStorage = getItemsFromStorage();
	if (itemsFromStorage.length === 0) {
		return;
	} else {
		itemsFromStorage.forEach((item) => addItemToDOM(item));
		checkUI();
	}
}

// Event handler for the submission of a new item
function onAddItemSubmit(e) {
	e.preventDefault();

	const newItem = itemInput.value;

	// Validate Input
	if (newItem === '') {
		alert('Please add an item');
		return;
	}

	if (checkDuplicateInStorage(newItem) && !isEditMode) {
		alert('Item already added');
		return;
	}

	if (isEditMode) {
		const itemToEdit = itemList.querySelector('.edit-mode');

		removeItemFromStorage(itemToEdit.textContent);
		itemToEdit.classList.remove('edit-mode');
		itemToEdit.remove();
		isEditMode = false;
	}
	// Add item to the DOM as a list item
	addItemToDOM(newItem);

	// Updates localStorage to include new items
	addItemToStorage(newItem);

	// Checks UI since items have been added
	checkUI();

	itemInput.value = '';
}

// Utility function - Creates a new list item with the provided name and appends to item-list
function addItemToDOM(item) {
	// Create list item
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(item));

	const button = createButton('remove-item btn-link text-red');
	li.appendChild(button);

	itemList.appendChild(li);
}

// Utility function - Adds a new item to storage
function addItemToStorage(item) {
	const itemsFromStorage = getItemsFromStorage();
	// Add new item to the array, then stringify and sets the item to localStorage
	itemsFromStorage.push(item);
	localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Utility function - retrieves items from storage, parses into an array and returns the array.
// If no items in storage, returns an empty array.
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

// Utility function - takes in the text content (string) of a list item and removes it from storage
function removeItemFromStorage(itemToDelete) {
	const itemsFromStorage = getItemsFromStorage();
	const newItems = itemsFromStorage.filter((item) => item !== itemToDelete);
	localStorage.setItem('items', JSON.stringify(newItems));
}

// Utility function - check whether there is a duplicate item already in storage
function checkDuplicateInStorage(itemText) {
	const items = getItemsFromStorage();
	return items.includes(itemText);
}

// Utility function - creates the delete button for the list item
function createButton(classes) {
	const button = document.createElement('button');
	button.className = classes;
	const icon = createIcon('fa-solid fa-xmark');
	button.appendChild(icon);
	return button;
}

// Utility function - creates the icon for the delete button
function createIcon(classes) {
	const icon = document.createElement('i');
	icon.className = classes;
	return icon;
}

// Event handler - when clicking on a specific area of the list item, a corresponding function will be ran:
// Button = removeItem(), List Item = editItem().
function onClickItem(e) {
	if (e.target.parentElement.classList.contains('remove-item')) {
		removeItem(e.target.parentElement.parentElement);
	} else {
		setItemToEdit(e.target);
	}
}

// Event handler - removes the list item when the delete button is clicked
function removeItem(item) {
	console.log(item);
	if (confirm('Are you sure?')) {
		item.remove();
		removeItemFromStorage(item.textContent);
		checkUI();
	}
}

// Event handler - removes all items when the clear button is clicked
function clearAllItems() {
	while (itemList.firstChild) {
		itemList.removeChild(itemList.firstChild);
	}

	localStorage.removeItem('items');
	checkUI();
}

// Utility function - Sets the value of #item-input to the value of the list item text,
// Updates the Add Item button text to Update Item,
// Calls swapItemFromStorage()
function setItemToEdit(listItem) {
	isEditMode = true;

	itemList
		.querySelectorAll('li')
		.forEach((i) => i.classList.remove('edit-mode'));
	listItem.classList.add('edit-mode');
	addEditItemButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
	addEditItemButton.style.backgroundColor = '#228B22';
	itemInput.value = listItem.textContent;
}

// Checks whether filter items form and clear all button should be displayed. If no list items, these should not be displayed.
// Also sets the app back to non-edit mode.
function checkUI() {
	itemInput.value = '';
	const items = itemList.querySelectorAll('li');

	if (items.length === 0) {
		clearAllButton.style.display = 'none';
		itemFilter.style.display = 'none';
	} else {
		clearAllButton.style.display = 'block';
		itemFilter.style.display = 'block';
	}

	addEditItemButton.innerHTML = '<i class=fa-solid fa-plus"></i> Add Item';
	addEditItemButton.style.backgroundcolor = '#333';

	isEditMode = false;
}

// Event handler - filters the list as you type in the filter input field
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
	itemList.addEventListener('click', onClickItem);
	clearAllButton.addEventListener('click', clearAllItems);
	window.addEventListener('load', checkUI);
	document.addEventListener('DOMContentLoaded', displayItemsFromStorage);
	itemFilter.addEventListener('keyup', filterItems);
}

init();

// Storage Controller

//Item Controller
const ItemCtrl = (function () {
  //Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure / State
  const data = {
    items: [
      //   { id: 0, name: `Steak Dinner`, calories: 1200 },
      //   { id: 0, name: `Cookie`, calories: 4000 },
      //   { id: 0, name: `Steak Dinner`, calories: 300 },
    ],
    currentItem: null,
    totalCalories: 0,
  };
  //Public methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      //Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Calories to number
      calories = parseInt(calories);

      //Create new item
      let newItem = new Item(ID, name, calories);

      //Add to items array
      data.items.push(newItem);

      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      //Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;

      //Loop through the calories
      data.items.forEach((item) => {
        total += item.calories;
      });

      //Set total cal in data structure
      data.totalCalories = total;

      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

//UI Controller

const UICtrl = (function () {
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCalorieInput: '#item-calories',
    totalCalories: '.total-calories',
  };

  //Public methods
  return {
    populateItemList: function (items) {
      let html = '';

      items.forEach(function (item) {
        html += `<li class="collection-item" id="item-${item.id}">
            <strong>${item.name}:</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item las la-edit"></i></a>
        </li>`;
      });

      //Insert list item
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCalorieInput).value,
      };
    },
    addListItem: function (item) {
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li element
      const li = document.createElement('li');
      //Add class
      li.className = 'collection-item';
      //Add ID
      li.id = `item-${item.id}`;

      //Add HTML
      li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item las la-edit"></i></a>`;

      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },

    hidelist: function () {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    clearInput: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCalorieInput).value = '';
    },
    addItemToForm: function () {
      UICtrl.showEditState();
      document.querySelector(UISelectors.itemNameInput).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCalorieInput).value =
        ItemCtrl.getCurrentItem().calories;
    },
    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
    },
    clearEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'block';
    },
    showEditState: function () {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },

    getSelectors: function () {
      return UISelectors;
    },
  };
})();

//App Controller

const App = (function (ItemCtrl, UICtrl) {
  // Load event listeners

  const loadEventListeners = function () {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    //Edit icon click event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    //Update item event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemUpdateSubmit);
  };

  //Add item submit

  const itemAddSubmit = function (e) {
    //Get form input from UI Controller

    const input = UICtrl.getItemInput();

    //Check for name and calorie
    if (input.name !== '' || input.calories !== '') {
      //Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to UI list
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  //Click item submit
  const itemEditClick = function (e) {
    if (e.target.classList.contains('edit-item')) {
      //Get list item id
      const listId = e.target.parentNode.parentNode.id;
      console.log(listId);

      //Break into an array
      const listIdArr = listId.split('-');

      //Get the actual id
      const id = parseInt(listIdArr[1]);

      //Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault;
  };

  //Public methods
  return {
    init: function () {
      //Clear edit state / set initial state
      UICtrl.clearEditState();
      //Fetch items from data structure
      const items = ItemCtrl.getItems();

      //Check if any items
      if (items.length === 0) {
        UICtrl.hidelist();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      }

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listners
      loadEventListeners();
    },
  };
})(ItemCtrl, UICtrl);

//Initialize App
App.init();

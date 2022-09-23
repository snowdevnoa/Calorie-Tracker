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
    showTotalCalories: function (total) {
      document.querySelector(UISelectors.totalCalories).textContent = total;
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

  //Public methods
  return {
    init: function () {
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

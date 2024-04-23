import * as storage from "./storage.js"
let items = ["???!!!"];
let button = document.querySelector("#btn-add");
let buttonClear = document.querySelector("#btn-clear");
let inputField = document.querySelector("#thing-text");
//let list = document.querySelector("ol").innerHTML;
//let nameField = document.querySelector()

// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  // loop though items and stick each array element into an <li>
  // use array.map()!
  // update the innerHTML of the <ol> already on the page

  let itemList = items.map(item =>`<li>${item}</li>`).join("");
  document.querySelector("ol").innerHTML = itemList;
  console.log(document.querySelector("ol").innerHTML);
  
};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
const addItem = str => {
  if(str.length>0){
    items.push(str);
  }
  console.log(items);
};


// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
// - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`
button.onclick = () => {
  if(inputField.value != ""){
    addItem(inputField.value);
    inputField.value = "";
    showItems();
    storage.writeToLocalStorage("items",items);
  }
  

  //writeHighScoreData2(nameField.value,"Clicktastic",score);
};

buttonClear.onclick = () => {
  items = [];
  showItems();
  storage.writeToLocalStorage("items",items);

  //writeHighScoreData2(nameField.value,"Clicktastic",score);
};
// When the page loads:
// - load in the `items` array from storage.js and display the current items
// you might want to double-check that you loaded an array ...
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// ... and if you didn't, set `items` to an empty array

items = storage.readFromLocalStorage("items");
if(!Array.isArray(items)){
  items = [];
}


// Got it working? 
// - Add a "Clear List" button that empties the items array

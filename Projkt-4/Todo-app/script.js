//*<-- Creating DOM elements -->

const btnEl = document.getElementById("add");
const inputEl = document.querySelector("#task");
const UlistEl = document.querySelector("#ulist");

//*<-- Storing the todos into the Database -->

let todoList = []; //creating an array to store todo objects
try {
  const stored = sessionStorage.getItem("todos"); //creating a variable named stored which gets the data called "todos" from sessionStorage
  if (stored) {
    //if stored has that value, meaning there is required data in our Database, then-
    todoList = JSON.parse(stored); //Assign all the data inside "todos" onto todoList
  }
} catch (error) {
  //if there is no data, then-
  console.error("Failed to load the todos:", error); //Show error!
}

updateTodoList(); //calling the update function on every page refresh

//*<-- Event listener for add btn to add todos -->

btnEl.addEventListener("click", (e) => {
  e.preventDefault(); //prevents the page from refresh on every add button click
  const taskText = inputEl.value.trim(); //storing the todo entered by the user into taskText

  if (taskText !== "") {
    //checking if the task entered by user is not empty before adding todo

    //creating the new todo to add onto the list list
    const newTodo = storeTodo(taskText);
    const newElement = createTodoElement(newTodo);

    UlistEl.appendChild(newElement); //appending the new todo onto the list

    inputEl.value = ""; //resetting the input after adding the task
  }
});

//*<-- Event Listener for completed todos and delete todos -->

UlistEl.addEventListener("click", (e) => {
  //Event delegation for elements inside List element onto the Unordered List element

  //*<-- for task completion -->
  const todoItem = e.target.closest(".txt"); //targeting the closest element with "txt" class

  if (todoItem) {
    //checking if the targeted class is the one the user clicked on
    const todoId = todoItem.parentElement.dataset.id; //storing the id of the todo the user clicked on

    const todo = todoList.find((todo) => todo.id === todoId); //comparing each todo's id from the todoList with the todoId on which the user clicked on and upon finding, storing the whole todo oject onto const todo

    if (todo) {
      //if todo exists then,
      todo.completed = !todo.completed; //flip the completed flag
      todoItem.classList.toggle("completed"); //add or remove the "completed" class from the element
      sessionStorage.setItem("todos", JSON.stringify(todoList)); //update the database with latest data
    }
  }

  //*<-- for task deletion -->
  const deleteItem = e.target.closest(".delete"); //targeting the closest element with "delete" class

  if (deleteItem) {
    //when found-

    const userConfirmation = confirm(
      "Are you sure you want to delete this todo?"
    ); //asking for user confirmation before deleting

    if (userConfirmation) {
      //if yes, then-

      const todoId = deleteItem.parentElement.dataset.id; //storing the id of todo on which the user clicked

      const todoIndex = todoList.findIndex((todo) => todo.id === todoId); // storing the index of the todo from the todoList after finding the match with the user clicked todo and the its position in the todoList

      if (todoIndex !== -1) {
        //when found-
        todoList.splice(todoIndex, 1); //delete the todo stored on the targeted index in the todoList
        sessionStorage.setItem("todos", JSON.stringify(todoList)); //update the Database withe the latest data
        deleteItem.parentElement.remove(); //update the UI of the todo list
      }
    }
  }
});

//*<-- Event listener for double click to edit -->

UlistEl.addEventListener("dblclick", (e) => {
  const targetEl = e.target.closest(".txt");

  if (targetEl) {
    const targetId = targetEl.parentElement.dataset.id;

    const target = todoList.find((targetTodo) => targetTodo.id === targetId);

    if (target) {
      //if targeted element is found, then-
      const editTodoEl = document.createElement("input"); //create an input element
      editTodoEl.classList.add("edit");
      const originalSpan = targetEl; // store the targeted element
      targetEl.replaceWith(editTodoEl); //replace the targeted element with the input element
      editTodoEl.focus(); //put focus onto the input element
      editTodoEl.value = target.text; //placeholder for text inside input element

      //*<-- Event Listener for the "Enter" or "Esc" keys on input element -->
      editTodoEl.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          //for "Enter" key
          const newTask = editTodoEl.value.trim(); //store the value of input element into newTask
          if (newTask !== "") {
            //if newTask is not empty, then-
            originalSpan.textContent = newTask; //store the newTask into the originalSpan
            target.text = newTask; //set the text of target object to newTask
            editTodoEl.replaceWith(originalSpan); //update the input with the new and edited task
            sessionStorage.setItem("todos", JSON.stringify(todoList)); //update the Database with the latest data
          }
        } else if (e.key === "Escape") {
          //for "Escape" key
          editTodoEl.replaceWith(originalSpan); //replace the input element with the original todo
        }
      });
    }
  }
});

//*<-- function to store the create and store todos with "taskText" as its parameter-->

function storeTodo(todoText) {
  if (todoText !== "") {
    //if the input is not empty, then-

    //create an object named todoObj with various keys
    const todoObj = {
      id: crypto.randomUUID(),
      text: todoText,
      completed: false,
    };

    todoList.push(todoObj); //store the todo object onto the todoList array
    sessionStorage.setItem("todos", JSON.stringify(todoList)); //create a string called "todos" inside the Database and update the database

    return todoObj; //return the created object for immediate DOM creation
  }
}

//*<-- Function to update the todo list -->

function updateTodoList() {
  UlistEl.innerHTML = ""; //clears the whole DOM inside the Unordered List

  for (let i = 0; i < todoList.length; i++) {
    //loop over each element inside the todoList, and for each loop-
    const todoElement = createTodoElement(todoList[i]); //create an element by calling createTodoElement function and store inside todoElements
    UlistEl.appendChild(todoElement); //Updating the UI by appending each element onto the list
  }
}

//*<-- Function to create the todo elements with "task" as a parameter -->

function createTodoElement(task) {
  const listItemEl = document.createElement("li"); //creating the List element
  listItemEl.classList.add("list"); //adding class to the List element
  listItemEl.dataset.id = task.id; //Assigning id to the List element

  const spanTextEl = document.createElement("span"); //creating the span element
  spanTextEl.classList.add("txt"); //adding the "txt" class to the span element
  spanTextEl.textContent = task.text; //defining its content

  const deleteBtnEl = document.createElement("button"); //creating the button element
  deleteBtnEl.classList.add("delete"); //adding the "delete" class to the button element
  deleteBtnEl.textContent = "x"; //Defining its content

  if (task.completed) {
    //if tasked is completed, then-
    spanTextEl.classList.add("completed"); //adding "completed" class to the span element
  }

  listItemEl.append(spanTextEl, deleteBtnEl); //appending the Span and Button elements onto the List element

  return listItemEl; //returning the listItem element
}

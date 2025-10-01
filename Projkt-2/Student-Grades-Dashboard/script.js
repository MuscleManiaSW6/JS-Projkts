//* <--- storing DOM elements into variables ---> 
const formEl = document.getElementById("form");
const tbodyEl = document.querySelector("tbody");
const nameEl = document.getElementById("name");

const subject1El = document.getElementById("subject1");
const subject2El = document.getElementById("subject2");
const subject3El = document.getElementById("subject3");
const subject4El = document.getElementById("subject4");
const subject5El = document.getElementById("subject5");

const marks1El = document.getElementById("marks1");
const marks2El = document.getElementById("marks2");
const marks3El = document.getElementById("marks3");
const marks4El = document.getElementById("marks4");
const marks5El = document.getElementById("marks5");



//* <--- global scope to make it accessible everywhere in the code --->
let data = JSON.parse(sessionStorage.getItem("students")) || [];  // creating an empty array on the first run and storing it on data, in second run, an entry exists (from the first run), so the data stores the value of "student" object which is stored in the xStorage


//* <--- function to check if each selected subject is unique --->
function validateUniqueSubjects() {

  // to store the subjects selected by the user
  const sub = [
    subject1El.value,
    subject2El.value,
    subject3El.value,
    subject4El.value,
    subject5El.value
  ];

  // looping each subject over other subjects in the sub array to check for duplicate
  for (let i = 0; i < sub.length; i++) {
    for (let j = i+1; j < sub.length; j++) {
      if(sub[i] === sub[j]) {
        alert(`"${sub[i]}" is selected more than once`);
        return false; //returns false if a duplicate is found
      }
      
    }
    
  }
  return true; // returns true if no duplicate is found (look at formEl->eventHandler for execution)
}


//* <--- calling the function retain the Table every-time the page reloads --->
useData();


//* <--- function to take data from the form and store it into the database --->
function storeData() {
  let newStudent = {
    name: nameEl.value,

    subjects: [
      { subject: subject1El.value, marks: marks1El.value },
      { subject: subject2El.value, marks: marks2El.value },
      { subject: subject3El.value, marks: marks3El.value },
      { subject: subject4El.value, marks: marks4El.value },
      { subject: subject5El.value, marks: marks5El.value },
    ],
  };

  data.push(newStudent);  // pushing the new entries into data array.

  sessionStorage.setItem("students", JSON.stringify(data));  // appending the new entries into the "students" object stored in xStorage
}


// * <--- function to use the stored data and update the Table --->
function useData() {

  tbodyEl.innerHTML = "";   // clears the tbody of the table before any action to avoid bugs or unexpected behavior


  // looping over every elements inside data array to access each element and their index
  data.forEach((student, studentIndex) => {
    let name = student.name;      // storing name of each student

    let subj = [                  // storing each subject into subj array
      student.subjects[0].subject,
      student.subjects[1].subject,
      student.subjects[2].subject,
      student.subjects[3].subject,
      student.subjects[4].subject,
    ];

    let marks = [                 // storing each marks into marks array
      student.subjects[0].marks,
      student.subjects[1].marks,
      student.subjects[2].marks,
      student.subjects[3].marks,
      student.subjects[4].marks,
    ];
    

    // creating empty arrays to store the elements which needs to be display in the Table
    let rows = [];
    let cellSub = [];
    let cellMarks = [];
    let cellGrade = [];


    //  looping 5 times to create 5 subject-cells 
    for (let index = 0; index < 5; index++) {
      let sub = document.createElement("td");
      sub.classList.add("cell", "subject");
      sub.textContent = subj[index];
      cellSub.push(sub);
    }


    //  looping 5 times to create 5 marks-cells
    for (let index = 0; index < 5; index++) {
      let mark = document.createElement("td");
      mark.classList.add("cell", "marks");
      mark.textContent = marks[index];
      cellMarks.push(mark);
    }

    //  looping 5 times to create 5 grade-cells
    for (let index = 0; index < 5; index++) {
      let grade = document.createElement("td");
      grade.classList.add("cell", "grade");

      let gradeScore = Number(marks[index]);

      if (gradeScore >= 85) {
        grade.textContent = "A";
        grade.style.background = "green";
      } else if (gradeScore >= 70) {
        grade.textContent = "B";
        grade.style.background = "blue";
      } else if (gradeScore >= 55) {
        grade.textContent = "C";
        grade.style.background = "yellow";
      } else if (gradeScore >= 35) {
        grade.textContent = "D";
        grade.style.background = "orange";
      } else {
        grade.textContent = "E";
        grade.style.background = "red";
      }
      cellGrade.push(grade);
    }

    //  looping 5 times to create 5 rows
    for (let index = 0; index < 5; index++) {
      let row = document.createElement("tr");
      row.classList.add("row");
      rows.push(row);
    }

    

    // creating the name-cell
    let td1 = document.createElement("td");
    td1.rowSpan = "5";
    td1.classList.add("cell", "name");
    td1.textContent = name;

    // creating the delete-cell
    let td5 = document.createElement("td");
    td5.classList.add("cell", "delete");
    td5.rowSpan = "5";




    // creating the delete-btn
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "&#10060;";

    //appending the delete-btn on delete-cell
    td5.appendChild(deleteBtn);

    // adding functionality to the delete-btn;
    deleteBtn.addEventListener("click", () => {
      data.splice(studentIndex, 1);    // deletes 1 element from the current index
      sessionStorage.setItem("students", JSON.stringify(data));  //updates the xStorage after deletion
      useData(); // calls the function to display the changes
    });




    // appending each cell onto the designated place in DOM
    rows[0].append(td1, cellSub[0], cellMarks[0], cellGrade[0], td5);
    rows[1].append(cellSub[1], cellMarks[1], cellGrade[1]);
    rows[2].append(cellSub[2], cellMarks[2], cellGrade[2]);
    rows[3].append(cellSub[3], cellMarks[3], cellGrade[3]);
    rows[4].append(cellSub[4], cellMarks[4], cellGrade[4]);

    // appending rows onto the tbody element
    tbodyEl.append(...rows);
  });
}




// * <--- eventListener for form submission --->
formEl.addEventListener("submit", (e) => {     // triggers a function when submit is clicked 
  e.preventDefault();    // prevents the page from reloading each time submit is clicked

  if(!validateUniqueSubjects()) {    // if validate-fn gives true it return to execute other function after that
    return;
  }

  storeData();     // calls the fn to store the data
  useData();       // calls the fn to use the data
  formEl.reset();  // resets the form after each submission
});

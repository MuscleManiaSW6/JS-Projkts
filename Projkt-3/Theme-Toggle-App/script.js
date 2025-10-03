// * <--- accessing DOM elements --->
const inputEl = document.getElementById('toggle');
const bodyEl = document.querySelector('body');
const containerEl = document.querySelector('main');

// * <--- storing the value of input that was last saved in localStorage --->
inputEl.checked = JSON.parse(localStorage.getItem('mode')) // .parse to turn the value of checkbox from string to boolean

updateBody(); // calling the function to to retain the theme


// * <--- function to update the DOM elements based on input --->
function updateBody() {
    const isDark = inputEl.checked;  // stored the value of input
    bodyEl.classList.toggle('body-dark', isDark);  // and or remove the class based on the value of isDark
    containerEl.classList.toggle('container-dark', isDark);

};


// * <--- event listener to switch b/w modes --->
inputEl.addEventListener('input', ()=> {
    updateBody();
    updateLocalStorage();
    
});


// * <--- function to store the value of input element on localStorage --->
function updateLocalStorage() {
    localStorage.setItem('mode', JSON.stringify(inputEl.checked));  //saving the value as a string since checkbox have boolean values

};
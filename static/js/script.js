document.querySelector(".logout-btn").addEventListener("click", function () {
    // Redirect to the Flask logout route
    window.location.href = "/logout";
});

document.querySelector("privPolicy").addEventListener("click", function () {
    // Redirect to the Flask logout route
    window.location.href = "/privacy";
});

document.querySelector('#theme-toggle').addEventListener('click', function(){ 
    // Toggles dark mode and light mode when button is clicked
    document.body.classList.toggle('darkMode');
});
document.querySelector(".signin-btn").addEventListener("click", function () {
    // Redirect to the Flask login route
    window.location.href = "/login";
});

document.querySelector('#theme-toggle').addEventListener('click', function(){ 
    // Toggles dark mode and light mode when button is clicked
    document.body.classList.toggle('darkMode');
});
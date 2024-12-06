document.querySelector(".logout-btn").addEventListener("click", function () {
    // Redirect to the Flask logout route
    window.location.href = "/logout";
});


let themeToggler = document.querySelector('#theme-toggle');
themeToggler.addEventListener('click', function(){ 
    document.body.classList.toggle('darkMode');
});
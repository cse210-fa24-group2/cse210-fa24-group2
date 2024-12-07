document.querySelector(".signin-btn").addEventListener("click", function () {
    // Redirect to the Flask login route
    window.location.href = "/login";
});

document.querySelector("privPolicy").addEventListener("click", function () {
    // Redirect to the Flask logout route
    window.location.href = "/privacy";
});
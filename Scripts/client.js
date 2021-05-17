'use strict';

document.getElementById('logOutButton').addEventListener("click", (e) => {
    fetch("/sign_out")
    .then(window.location.href = "http://localhost:8000");
})

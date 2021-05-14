/* For redirecting from login.html to index.html. */
$(document).ready(function () {

    /* On button click, redirect to index.html. */
    $("#submitButton").click(function () {

        console.log("submit button clicked.");

        $.get('/getIndex',{ '+': $.now()}
        
        ).done(function (data){
            $("#body").html(data);
        }) 
    });
})
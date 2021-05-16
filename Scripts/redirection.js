/* For redirecting from login.html to index.html. */
$(document).ready(function () {

  console.log("The js is loaded");

  /* On button click, redirect to index.html. */
  $("#submitButton").click(function () {

    $.ajax({
      url: '/authorize',
      type: 'POST',
      dataType: 'JSON',
      data: {
        username: $('#usernameInput').val(),
        password: $('#passwordInput').val()
      },
      success: function (data) {
        console.log('Data returned from server', data);
        if (data.status == "success") {
          // do the redirect
          window.location.replace('/profile');
        } else {
          // display an error message
          console.error(data['msg']);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(jqXHR.statusText);
      }
    })



    // console.log("submit button clicked.");

    // $.get('/getIndex',{ '+': $.now()}

    // ).done(function (data){
    //     $("#body").html(data);
    // }) 
  });
})
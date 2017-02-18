$(document).ready(() => {
 

  $('#test').on('click', () => {
    app.handleSubmit();
    // console.log($message);
  });


  setInterval(app.fetch.bind(this), 5000);


});
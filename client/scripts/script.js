$(document).ready(() => {
  app.init();
  
  $('#test').on('click', app.handleSubmit);
  setInterval(() => app.fetch(), 6000);
});

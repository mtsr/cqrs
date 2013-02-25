$(function() {
  $('#test').click(function(e) {
    $.ajax('http://localhost:3001/test/1/try', {
      data: JSON.stringify({ test: 'bla' }),
      processData: false,
      type: 'POST',
      contentType: 'application/json',
      error: function() { console.log('ERROR:', arguments); },
      success: function() { console.log('SUCCESS:', arguments); }
    });
  });
});
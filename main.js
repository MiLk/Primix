$(document).ready(function() {
  for(var j = 0; j < 16; j++) {
    var row = $('<div class="row row'+j+'"></div>');
    for(var i = 0; i < 24; i++) {
      var cell = $('<div class="cell col'+i+'"></div>');
      cell.appendTo(row);
    }
    $('.grid').append(row);
  }
  $('.cell').on('click', function() {
    if($(this).hasClass('active'))
      $(this).removeClass('active');
    else
      $(this).addClass('active');
  });
  var updateBg = function() {
    var bgColor = '';
    bgColor += (Math.ceil(Math.random() * 255)).toString(16);
    bgColor += (Math.ceil(Math.random() * 255)).toString(16);
    bgColor += (Math.ceil(Math.random() * 255)).toString(16);
    $('body').css('background-color','#'+bgColor);
    setTimeout(updateBg,1000);
  };
  setTimeout(updateBg,1000);
});


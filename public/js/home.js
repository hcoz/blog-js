$(function () {
  // fill user list
  $.ajax({
    type: 'GET',
    url: '/api/userlist',
    headers: {
      'Authorization': window.localStorage.getItem('token')
    }
  })
    .done(function (data) {
      let userList = data.userList;

      for (let i in userList) {
        $('.js-user-list').append('<li class="nav-item"><a class="nav-link" href="#" data-userid="' +
          userList[i]._id +
          '"><span data-feather="user-plus"></span>' +
          userList[i].username +
          '</a></li>');
      }
      // initialize icons
      feather.replace();
    })
    .fail(function (err) {
      if (err.responseJSON.redirect)
        window.location = err.responseJSON.redirect;
      else
        $('.js-message-publish').text(err.responseJSON.message);
    });

  // show/hide create post form
  $('.js-show-post-form').click(function () {
    $('.js-create-post').toggle('slow');
  });
  // submit publish post form
  $('#publish').submit(function (e) {
    e.preventDefault();
    var $form = $(this),
      url = $form.attr('action');

    $.ajax({
      type: 'POST',
      url: url,
      headers: {
        'Authorization': window.localStorage.getItem('token')
      },
      data: $form.serialize()
    })
      .done(function (data) {
        document.getElementById('publish').reset();
        $('.js-message-publish').text(data.message);
      })
      .fail(function (err) {
        if (err.responseJSON.redirect)
          window.location = err.responseJSON.redirect;
        else
          $('.js-message-publish').text(err.responseJSON.message);
      });
  });

});

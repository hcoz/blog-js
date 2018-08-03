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
        $('.js-user-list').append('<li class="nav-item"><a class="nav-link js-list-user" href="#" data-username="' +
          userList[i].userName +
          (userList[i].isFollow ? '" data-following="true"><span data-feather="user-minus' : '" data-following="false"><span data-feather="user-plus') +
          '"></span>' +
          userList[i].userName +
          '</a></li>');
      }
      // initialize icons
      window.feather.replace();
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

  // follow/unfollow event
  $('.js-user-list').on('click', '.js-list-user', function (e) {
    e.preventDefault();
    $(this).data('following') === false ? follow($(this).data('username')) : unfollow($(this).data('username'));
  });
});

function follow(userName) {
  $.ajax({
    type: 'POST',
    url: '/api/follow',
    headers: {
      'Authorization': window.localStorage.getItem('token')
    },
    data: { follow: userName }
  })
    .done(function (data) {
      $('.js-user-list .js-list-user[data-username=' + data.userName + ']')
        .data('following', data.isFollow)
        .empty()
        .append('<span data-feather="user-minus"></span>' + data.userName);
      window.feather.replace();
    })
    .fail(function (err) {
      console.error(err);
    });
}

function unfollow(userName) {
  $.ajax({
    type: 'POST',
    url: '/api/unfollow',
    headers: {
      'Authorization': window.localStorage.getItem('token')
    },
    data: { unfollow: userName }
  })
    .done(function (data) {
      $('.js-user-list .js-list-user[data-username=' + data.userName + ']')
        .data('following', data.isFollow)
        .empty()
        .append('<span data-feather="user-plus"></span>' + data.userName);
      window.feather.replace();
    })
    .fail(function (err) {
      console.error(err);
    });
}

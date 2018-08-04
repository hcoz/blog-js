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
      var userHtml = '';

      $.each(data.userList, function (i, user) {
        userHtml += '<li class="nav-item' + (user.isFollow ? ' following' : '') +
          '"><a class="nav-link js-list-user" href="#" data-username="' +
          user.userName +
          (user.isFollow ? '" data-following="true"><span data-feather="user-minus' : '" data-following="false"><span data-feather="user-plus') +
          '"></span>' +
          user.userName +
          '</a></li>';
      });

      $('.js-user-list').append(userHtml);
      // initialize icons
      window.feather.replace();
    })
    .fail(function (err) {
      console.error(err);

      if (err.responseJSON.redirect)
        window.location = err.responseJSON.redirect;
    });

  // fill post list
  getPostList();

  // show/hide create post form
  $('.js-toggle-post-form').click(function () {
    $('.js-create-post').toggle();
    $(this).text(function (i, text) {
      return text.trim() === 'New Post' ? 'Hide' : 'New Post';
    });
  });

  // show/hide user list sidebar
  $('.js-toggle-sidebar').click(function (e) {
    e.preventDefault();
    $('.js-sidebar').toggleClass('d-none');
    $(this).text(function (i, text) {
      return text.trim() === 'Show Users' ? 'Hide' : 'Show Users';
    });
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

  // logout
  $('.js-logout').click(function (e) {
    e.preventDefault();
    window.localStorage.removeItem('token');
    window.location = '/';
  });
});

function getPostList() {
  $.ajax({
    type: 'GET',
    url: '/api/postlist',
    headers: {
      'Authorization': window.localStorage.getItem('token')
    }
  })
    .done(function (data) {
      var postHtml = '';

      $.each(data.postList, function (i, post) {
        postHtml += '<div class="post" data-postid=' + post._id + '><h4>' + post.postHeader + '</h4>' +
          '<h6><span data-feather="clock"></span> Post by ' + post.username + ', ' + new Date(post.date).toLocaleDateString() + '.</h6>' +
          '<p>' + post.postContent + '</p></div>';
      });

      $('.js-post-list').empty().append(postHtml);
      // intialize icons
      window.feather.replace();
    })
    .fail(function (err) {
      console.error(err);

      if (err.responseJSON.redirect)
        window.location = err.responseJSON.redirect;
    });
}

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
      var $selectedUser = $('.js-user-list .js-list-user[data-username=' + data.userName + ']');
      $selectedUser
        .data('following', data.isFollow)
        .empty()
        .append('<span data-feather="user-minus"></span>' + data.userName);
      $selectedUser.parent().addClass('following');
      // intialize icons
      window.feather.replace();
      // update post list
      getPostList();
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
      var $selectedUser =  $('.js-user-list .js-list-user[data-username=' + data.userName + ']');
      $selectedUser
        .data('following', data.isFollow)
        .empty()
        .append('<span data-feather="user-plus"></span>' + data.userName);
      $selectedUser.parent().removeClass('following');
      // intialize icons
      window.feather.replace();
      // update post list
      getPostList();
    })
    .fail(function (err) {
      console.error(err);
    });
}

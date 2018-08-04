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
      console.error(err);

      if (err.responseJSON.redirect)
        window.location = err.responseJSON.redirect;
    });

  // fill post list
  $.ajax({
    type: 'GET',
    url: '/api/postlist',
    headers: {
      'Authorization': window.localStorage.getItem('token')
    }
  })
    .done(function (data) {
      console.log(data);
      var postHtml = '';

      $.each(data.postList, function (i, post) {
        postHtml += '<div class="post" data-postid=' + post._id +'><h4>' + post.postHeader + '</h4>' + 
          '<h6><span data-feather="clock"></span> Post by ' + post.username + ', ' + new Date(post.date).toLocaleDateString() + '.</h6>' +
          '<p>' + post.postContent + '</p></div>';
      });

      $('.js-post-list').append(postHtml);
      // intialize icons
      window.feather.replace();
    })
    .fail(function (err) {
      console.error(err);

      if (err.responseJSON.redirect)
        window.location = err.responseJSON.redirect;
    });

  // show/hide create post form
  $('.js-toggle-post-form').click(function () {
    $('.js-create-post').toggle();
    $(this).text(function (i, text) {
      return text.trim() === 'New post' ? 'Hide' : 'New post';
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
      // intialize icons
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
      // intialize icons
      window.feather.replace();
    })
    .fail(function (err) {
      console.error(err);
    });
}

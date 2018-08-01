$(function () {
  $('#register').submit(function (e) {
    e.preventDefault();
    var $form = $(this),
      url = $form.attr('action');

    $.post(url, $form.serialize())
      .done(function (data) {
        window.localStorage.setItem('token', data.token);
        window.location = '/views/' + data.redirect;
      })
      .fail(function (err) {
        $('.js-message-register').text(err.responseJSON.message);
      });
  });

  $('#login').submit(function (e) {
    e.preventDefault();
    var $form = $(this),
      url = $form.attr('action');

    $.post(url, $form.serialize())
      .done(function (data) {
        window.localStorage.setItem('token', data.token);
        window.location = '/views/' + data.redirect;
      })
      .fail(function (err) {
        $('.js-message-login').text(err.responseJSON.message);
      });
  });
});

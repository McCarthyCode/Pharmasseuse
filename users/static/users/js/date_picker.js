$(document).ready(function () {
  var $dp = $('#datePicker');

  // show loading icon while waiting for GET response

  // date picker
  function showLoadingIcon() {
    var $imgContainer = $('<div>').addClass('img-container');
    var $img = $('<img>')
      .attr('src', '/static/booking/img/loading.gif')
      .attr('alt', 'Loading…');

    $dp.empty();
    $dp.append($imgContainer);
    $imgContainer.append($img);
    $dp.show();
  }

  function updateDatePicker(context = {}) {
    if ($.isEmptyObject(context)) {
      context = {
        'year': $('#datePickerDate input[name="year"]').val(),
        'month': $('#datePickerDate input[name="month"]').val(),
      }
    } else {
      $('#datePickerDate input[name="year"]').val(context['year']);
      $('#datePickerDate input[name="month"]').val(context['month']);
    }

    $.get('/booking/date-picker/', context, function (response) {
      $dp.empty();
      $dp.append(response);
    });
  }

  showLoadingIcon();
  updateDatePicker();

  $dp.on('click touchend', '.prev', function () {
    showLoadingIcon();
    updateDatePicker({
      'year': $(this).data('year'),
      'month': $(this).data('month'),
    });
  });

  $dp.on('click touchend', '.next', function () {
    showLoadingIcon();
    updateDatePicker({
      'year': $(this).data('year'),
      'month': $(this).data('month'),
    });
  });

  // update prev/next buttons
  function updatePrev(context) {
    $.get('/booking/prev/', context, function (response) {
      var $prev = $('#calendarControls .prev');

      if (response['exists']) {
        $prev.data('year', response['date']['year']);
        $prev.data('month', response['date']['month']);
        $prev.data('day', response['date']['day']);

        $prev.attr('data-year', response['date']['year']);
        $prev.attr('data-month', response['date']['month']);
        $prev.attr('data-day', response['date']['day']);

        $prev.removeClass('inactive');
      } else {
        $prev.addClass('inactive');
      }
    });
  }

  function updateNext(context) {
    $.get('/booking/next/', context, function (response) {
      var $next = $('#calendarControls .next');

      if (response['exists']) {
        $next.data('year', response['date']['year']);
        $next.data('month', response['date']['month']);
        $next.data('day', response['date']['day']);

        $next.attr('data-year', response['date']['year']);
        $next.attr('data-month', response['date']['month']);
        $next.attr('data-day', response['date']['day']);

        $next.removeClass('inactive');
      } else {
        $next.addClass('inactive');
      }
    });
  }

  // display date clicked in date picker
  $dp.on('click touchend', '.grid div:not(.prev, .next)', function () {
    showLoadingIcon();

    var $date = $(this);

    var context = {
      'year': $date.data('year'),
      'month': $date.data('month'),
      'day': $date.data('day'),
    };

    if (context['month'] !== Number($('#datePickerDate input[name="month"]').val())) {
      updateDatePicker(context);
    } else {
    //   $.get('/booking/black-out/', context, function () {
    //     updateDatePicker(context);
    //   });
    }

    updatePrev(context);
    updateNext(context);
  });
});

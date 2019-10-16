$(document).ready(function () {
  var csrfmiddlewaretoken = $('#csrf input[name="csrfmiddlewaretoken"]').val();

  let $dp = $('#datePicker');
  let $calendarContent = $('#calendarContent');

  // show loading icon while waiting for GET response

  // date picker
  function showDPLoadingIcon() {
    let $imgContainer = $('<div>').addClass('img-container');
    let $img = $('<img>')
      .attr('src', '/static/booking/img/loading.gif')
      .attr('alt', 'Loading…');

    $dp.empty();
    $dp.append($imgContainer);
    $imgContainer.append($img);
    $dp.show();
  }

  // calendar content
  function showCCLoadingIcon() {
    let $imgContainer = $('<div>').addClass('img-container');
    let $img = $('<img>')
      .attr('src', '/static/booking/img/loading.gif')
      .attr('alt', 'Loading…');

    $calendarContent.empty();
    $calendarContent.append($imgContainer);
    $imgContainer.append($img);
  }

  function updateDatePicker(context = {}) {
    if ($.isEmptyObject(context)) {
      let year = $('#date input[name="year"]').val();
      let month = $('#date input[name="month"]').val();

      $('#datePickerDate input[name="year"]').val(year);
      $('#datePickerDate input[name="month"]').val(month);

      context = {
        'year': year,
        'month': month,
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

  // format calendar objects
  function alignAppointmentTimes() {
    $calendarContent.find('ul li').each(function () {
      let $li = $(this);
      let offset = $li.data('hour') * 4 * 16;

      $li.css('top', `${offset}px`);
    });
  }

  // scroll to first object in list
  function scrollTop() {
    let $li = $calendarContent.find('ul li:first');
    let offset = $li.data('hour') * 4 * 16;

    $calendarContent.scrollTop(offset);
  }

  // show loading icon while waiting for GET response
  let $imgContainer = $('<div>').addClass('img-container');
  let $img = $('<img>')
    .attr('src', '/static/booking/img/loading.gif')
    .attr('alt', 'Loading…');

  function showLoadingIcon() {
    $calendarContent.empty();
    $calendarContent.append($imgContainer);
    $imgContainer.append($img);
  }

  // populate calendar
  showLoadingIcon();
  let context = {
    'csrfmiddlewaretoken': csrfmiddlewaretoken,
    'year': $('#date input[name="year"]').val(),
    'month': $('#date input[name="month"]').val(),
    'day': $('#date input[name="day"]').val(),
  };
  $.post('/booking/day-admin/', context, function (response) {
    $calendarContent.empty();
    $calendarContent.append(response);
    alignAppointmentTimes();
    scrollTop();
  });

  // show date in calendar controls and populate calendar with slots
  // for that date
  function displayDate(year, month, day) {
    $('#date input[name="year"]').val(year);
    $('#date input[name="month"]').val(month);
    $('#date input[name="day"]').val(day);

    let date = new Date(year, month - 1, day);
    let dow = ''; // day of week

    switch (date.getDay()) {
      case 0:
        dow = 'Sun';
        break;
      case 1:
        dow = 'Mon';
        break;
      case 2:
        dow = 'Tue';
        break;
      case 3:
        dow = 'Wed';
        break;
      case 4:
        dow = 'Thu';
        break;
      case 5:
        dow = 'Fri';
        break;
      case 6:
        dow = 'Sat';
        break;
    }

    $('#calendarControls .date span').text(
      `${dow} ${date.getMonth() + 1}/${date.getDate()}`
    );

    context = {
      'csrfmiddlewaretoken': csrfmiddlewaretoken,
      'year': year,
      'month': month,
      'day': day,
    };

    $.post('/booking/day-admin/', context, function (response) {
      $calendarContent.empty();
      $calendarContent.append(response);
      alignAppointmentTimes();
      scrollTop();
    });
  }

  // same as previous, but uses active date
  function displayActiveDate() {
    displayDate(
      $('#date input[name="year"]').val(),
      $('#date input[name="month"]').val(),
      $('#date input[name="day"]').val(),
    );
  }

  // update prev/next buttons
  function updatePrev(context) {
    showCCLoadingIcon();

    $.post('/booking/prev-admin/', context, function (response) {
      let $prev = $('#calendarControls .prev');

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
    showCCLoadingIcon();

    $.post('/booking/next-admin/', context, function (response) {
      let $next = $('#calendarControls .next');

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

  // navigate to previous/next day
  $('#calendarControls').on('click touchend', '.prev, .next', function () {
      let $button = $(this);

      if ($button.hasClass('inactive')) {
          return;
      }

      $('#calendarControls .prev, #calendarControls .next')
        .removeClass('inactive');

      let context = {
        'csrfmiddlewaretoken': csrfmiddlewaretoken,
        'year': $button.data('year'),
        'month': $button.data('month'),
        'day': $button.data('day'),
      };

      if (context['month'] !== Number($('#datePickerDate input[name="month"]').val())) {
        showDPLoadingIcon();
        updateDatePicker(context);
      }

      displayDate(
        $button.data('year'),
        $button.data('month'),
        $button.data('day'),
      );

      updatePrev(context);
      updateNext(context);
  });

  // handle li click event
  $calendarContent.on('click touchend', 'ul li', function (event) {
    event.preventDefault();

    let $appt = $(this);
    let context = {
      'csrfmiddlewaretoken': csrfmiddlewaretoken,
      'id': $appt.data('id'),
    }

    showDPLoadingIcon();
    showCCLoadingIcon();

    $.post('/booking/black-out-appointment/', context, function () {
      displayActiveDate();
      updateDatePicker();
    });
  });
});

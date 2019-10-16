
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

  showDPLoadingIcon();
  updateDatePicker();

  $dp.on('click touchend', '.prev', function () {
    showDPLoadingIcon();
    updateDatePicker({
      'year': $(this).data('year'),
      'month': $(this).data('month'),
    });
  });

  $dp.on('click touchend', '.next', function () {
    showDPLoadingIcon();
    updateDatePicker({
      'year': $(this).data('year'),
      'month': $(this).data('month'),
    });
  });

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

  // update prev/next buttons
  function updatePrev(context) {
    showCCLoadingIcon();

    $.post('/booking/prev-admin/', context, function (response) {
      let $prev = $('#calendarControls .prev');
      let date = response['date'];

      if (response['exists']) {
        $prev.data('year', date['year']);
        $prev.data('month', date['month']);
        $prev.data('day', date['day']);

        $prev.attr('data-year', date['year']);
        $prev.attr('data-month', date['month']);
        $prev.attr('data-day', date['day']);

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
      let date = response['date'];

      if (response['exists']) {
        $next.data('year', date['year']);
        $next.data('month', date['month']);
        $next.data('day', date['day']);

        $next.attr('data-year', date['year']);
        $next.attr('data-month', date['month']);
        $next.attr('data-day', date['day']);

        $next.removeClass('inactive');
      } else {
        $next.addClass('inactive');
      }
    });
  }

  // display date clicked in date picker
  $dp.on('click touchend', '.grid div:not(.prev, .next)', function () {
    let dateActive = {
      'year': Number($('#date input[name="year"]').val()),
      'month': Number($('#date input[name="month"]').val()),
      'day': Number($('#date input[name="day"]').val()),
    };

    let $date = $(this);
    let dateSelected = {
      'csrfmiddlewaretoken': csrfmiddlewaretoken,
      'year': $date.data('year'),
      'month': $date.data('month'),
      'day': $date.data('day'),
    };

    if (dateActive['month'] !== dateSelected['month']) {
      showDPLoadingIcon();
      updateDatePicker(dateSelected);
    } else if (
      dateActive['year'] === dateSelected['year'] &&
      dateActive['month'] === dateSelected['month'] &&
      dateActive['day'] === dateSelected['day']
    ) {
      showDPLoadingIcon();
      showCCLoadingIcon();

      $.post('/booking/black-out-date/', dateSelected, function () {
        updateDatePicker(dateSelected);

        displayDate(dateSelected['year'], dateSelected['month'], dateSelected['day']);
        updatePrev(dateSelected);
        updateNext(dateSelected);
      });

      return;
    }

    displayDate(dateSelected['year'], dateSelected['month'], dateSelected['day']);
    updatePrev(dateSelected);
    updateNext(dateSelected);
  });
});

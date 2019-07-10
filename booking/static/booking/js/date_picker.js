$(document).ready(function () {
    var $dp = $('#date-picker');
    var $calendarContent = $('#calendar-content');

    function positionDatePicker() {
        let position = $('#calendar-controls .date i').position();
        var x = position.left - 136 + 18 < $(window).width() - 287 ?
            position.left - 136 + 18 :
            $(window).width() - 287;
        var y = position.top + 48 < $(window).height() - 217 ?
            position.top + 48 :
            $(window).height() - 217;

        $dp.css('top', y);
        $dp.css('left', x);
    }

    // show loading icon while waiting for GET response

    // date picker
    function showDPLoadingIcon() {
        var $imgContainer = $('<div>').addClass('img-container');
        var $img = $('<img>')
            .attr('src', '/static/booking/img/loading.gif')
            .attr('alt', 'Loading');

        $dp.empty();
        $dp.append($imgContainer);
        $imgContainer.append($img);
        $dp.show();
    }

    // calendar content
    function showCCLoadingIcon() {
        var $imgContainer = $('<div>').addClass('img-container');
        var $img = $('<img>')
            .attr('src', '/static/booking/img/loading.gif')
            .attr('alt', 'Loading');

        $calendarContent.empty();
        $calendarContent.append($imgContainer);
        $imgContainer.append($img);
    }

    function getDatePicker(context = {}) {
        if ($.isEmptyObject(context)) {
            var year = $('#date input[name=year]').val();
            var month = $('#date input[name=month]').val();

            $('#date-picker-date input[name=year]').val(year);
            $('#date-picker-date input[name=month]').val(month);

            context = {
                'year': year,
                'month': month,
            }
        } else {
            $('#date-picker-date input[name=year]').val(context['year']);
            $('#date-picker-date input[name=month]').val(context['month']);
        }

        $.get('/booking/date_picker', context, function (response) {
            $dp.empty();
            $dp.append(response);
        });
    }

    $('#date-picker-icon').on('click touchend', function (event) {
        event.preventDefault();

        if ($dp.is(':visible')) {
            $dp.hide();
        } else {
            $(window).trigger('resize'); // workaround for positioning bug
            positionDatePicker();
            showDPLoadingIcon();
            getDatePicker();
        }
    });

    $(window).on('orientationchange', function () {
        $(this).trigger('resize');
    });
    $(window).resize(function () {
        positionDatePicker();
    });

    $dp.on('click touchend', '.close', function (event) {
        event.preventDefault();
        $dp.hide();
    });

    $dp.on('click touchend', '.prev', function () {
        showDPLoadingIcon();
        getDatePicker({
            'year': $(this).data('year'),
            'month': $(this).data('month'),
        });
    });

    $dp.on('click touchend', '.next', function () {
        showDPLoadingIcon();
        getDatePicker({
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

        var date = new Date(year, month - 1, day);
        var dow = ''; // day of week

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

        $('#calendar-controls .date span').text(
            `${dow} ${date.getMonth() + 1}/${date.getDate()}`
        );

        context = {
            'year': year,
            'month': month,
            'day': day,
        };

        $.get('/booking/day', context, function (response) {
            $calendarContent.empty();
            $calendarContent.append(response);
            alignAppointmentTimes();
            scrollTop();
        });
    }

    // update prev/next buttons
    function updatePrev(context) {
        showCCLoadingIcon();

        $.get('/booking/prev', context, function (response) {
            var $prev = $('#calendar-controls .prev');

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

        $.get('/booking/next', context, function (response) {
            var $next = $('#calendar-controls .next');

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
        var context = {
            'year': $(this).data('year'),
            'month': $(this).data('month'),
            'day': $(this).data('day'),
        };

        if (context['month'] !== Number($('#date-picker-date input[name=month]').val())) {
            showDPLoadingIcon();
            getDatePicker(context);
        }

        displayDate(context['year'], context['month'], context['day']);

        updatePrev(context);
        updateNext(context);
    });

    // navigate to previous/next day
    $('#calendar-controls').on('click touchend', '.prev, .next', function () {
        var $button = $(this);

        if ($button.hasClass('inactive')) {
            return;
        }

        $('#calendar-controls .prev, #calendar-controls .next')
            .removeClass('inactive');

        var context = {
            'year': $button.data('year'),
            'month': $button.data('month'),
            'day': $button.data('day'),
        };

        if ($dp.is(':visible') &&
            context['month'] !== Number($('#date-picker-date input[name=month]').val())) {
            showDPLoadingIcon();
            getDatePicker(context);
        }

        displayDate(
            $button.data('year'),
            $button.data('month'),
            $button.data('day'),
        );

        updatePrev(context);
        updateNext(context);
    });
});

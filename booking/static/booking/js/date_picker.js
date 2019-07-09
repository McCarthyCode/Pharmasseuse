$(document).ready(function () {
    var $dp = $('#date-picker');

    function positionDatePicker() {
        let position = $('#calendar-controls .date i').position();
        var x = position.left - 136 + 18 < $(window).width() - 272 - 12 ?
            position.left - 136 + 18 :
            $(window).width() - 272 - 12;
        var y = position.top + 32 < $(window).height() - 217 ?
            position.top + 32 :
            $(window).height() - 217;

        $dp.css('top', y);
        $dp.css('left', x);
    }

    var $imgContainer = $('<div>').addClass('img-container');
    var $img = $('<img>')
        .attr('src', '/static/booking/img/loading.gif')
        .attr('alt', 'Loading');

    function showLoadingIcon() {
        $dp.empty();
        $dp.append($imgContainer);
        $imgContainer.append($img);
        $dp.show();
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
            showLoadingIcon();
            getDatePicker();
        }
    });

    $(window).on('orientationchange', function () {
        $(this).trigger('resize');
    });
    $(window).resize(function () {
        positionDatePicker();
    });

    $dp.on('click touchend', '.close', function () {
        $dp.hide();
    });

    $dp.on('click touchend', '.prev', function () {
        showLoadingIcon();
        getDatePicker({
            'year': $(this).data('year'),
            'month': $(this).data('month'),
        });
    });

    $dp.on('click touchend', '.next', function () {
        showLoadingIcon();
        getDatePicker({
            'year': $(this).data('year'),
            'month': $(this).data('month'),
        });
    });

    // format calendar objects
    function alignAppointmentTimes() {
        $('#calendar-content').find('ul li').each(function () {
            let $li = $(this);
            let offset = $li.data('hour') * 4 * 16;

            $li.css('top', `${offset}px`);
        });
    }

    // scroll to first object in list
    function scrollTop() {
        let $li = $('#calendar-content').find('ul li:first');
        let offset = $li.data('hour') * 4 * 16;

        $('#calendar-content').scrollTop(offset);
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
            $('#calendar-content').empty();
            $('#calendar-content').append(response);
            alignAppointmentTimes();
            scrollTop();
        });
    }

    // update prev/next buttons
    function updatePrev(context) {
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
            showLoadingIcon();
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
            showLoadingIcon();
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

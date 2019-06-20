$(document).ready(function () {
    var $dp = $('#date-picker');

    function positionDatePicker() {
        let position = $('.date i').position();
        var x = position.left - 136 + 18 < $(window).width() - 272 - 12 ?
            position.left - 136 + 18 :
            $(window).width() - 272 - 12;
        var y = position.top + 32 < $(window).height() - 217 ?
            position.top + 32 :
            $(window).height() - 217;

        $dp.css('top', y);
        $dp.css('left', x);
    }

    function getDatePicker(context = {}) {
        $.get('/booking/date_picker', context, function (response) {
            $dp.empty();
            $dp.append(response);
            $dp.show();
        });
    }

    $('#date-picker-icon').on('click touchend', function (event) {
        event.preventDefault();

        if ($dp.css('display') !== 'none') {
            $dp.hide();
        } else {
            $(window).trigger('resize'); // workaround for positioning bug
            positionDatePicker();
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
        getDatePicker({
            'year': $(this).data('year'),
            'month': $(this).data('month'),
        });
    });

    $dp.on('click touchend', '.next', function () {
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
            `${dow} ${date.getMonth()}/${date.getDate()}`
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
    
    $dp.on('click touchend', '.grid div:not(.prev, .next)', function () {
        displayDate(
            $(this).data('year'),
            $(this).data('month'),
            $(this).data('day'),
        );
    });
});

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

    $dp.on('click touchend', '.close', function (event) {
        $dp.hide();
    });

    $dp.on('click touchend', '.prev', function (event) {
        $firstDay = $('#date-picker .grid div:first-child');
        month = $firstDay.data('month');
        year = $firstDay.data('year');
        populateGrid({
            'month': month,
            'year': year,
        });
    });

    $dp.on('click touchend', '.next', function (event) {
        $lastDay = $('#date-picker .grid div:nth-last-child(3)');
        $lastDay.css('background-color', 'red');
        month = $lastDay.data('month');
        year = $lastDay.data('year');
        populateGrid({
            'month': month,
            'year': year,
        });
    });
});

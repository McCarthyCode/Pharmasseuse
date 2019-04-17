$(document).ready(function () {
    var $dp = $('#date-picker');

    function positionDatePicker() {
        let position = $('.date i').position();
        let x = position.left - 272 / 2 + 19 < $(window).outerWidth() - 272 - 8 ?
            position.left - 272 / 2 + 19 :
            $(window).outerWidth() - 272 - 8;
        let y = position.top + 32 < $(window).outerHeight() - 208 ?
            position.top + 32 :
            $(window).outerHeight() - 208;

        $dp.css('left', x);
        $dp.css('top', y);
    }

    function getDatePicker(context = {}) {
        $.get('/booking/date_picker', context, function (response) {
            $dp.empty();
            $dp.append(response);
            positionDatePicker();
            $dp.show();
        });
    }

    $('#date-picker-icon').on('click touchend', function (event) {
        event.preventDefault();

        if ($dp.css('display') !== 'none') {
            $dp.hide();
        } else {
            getDatePicker();
        }
    });

    $(window).on('orientationchange', function () {
        $(this).trigger('resize');
    });
    $(window).resize(function () {
        positionDatePicker();
    });

    $('#date-picker').on('click touchend', '.close', function (event) {
        $dp.hide();
    });

    $('#date-picker').on('click touchend', '.grid div', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
    });
});
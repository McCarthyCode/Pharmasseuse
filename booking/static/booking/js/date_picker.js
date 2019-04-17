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

    $('.date i').on('click touchend', function (event) {
        event.preventDefault();
        $dp.toggle();
        
        $(window).trigger('resize'); // workaround for positioning bug
        
        positionDatePicker();
    });

    $(window).on('resize orientationchange', function () {
        positionDatePicker();
    });

    // $dp.on('click touchend', '.grid div', function (event) {
    //     event.preventDefault();
    //     $(this).toggleClass('active');
    // });

    $dp.on('click touchend', '.close', function (event) {
        $dp.hide();
    });

    function populateGrid(context = {}) {
        // console.log('populateGrid();');
        $.get('/booking/date_picker', context, function (response) {
            $dp.empty();
            
            $dp.append(response);

            let $prev = $('<div>')
                .addClass("prev")
                .html('<i class="fas fa-arrow-left"></i>');
            $('#date-picker .grid').append($prev);

            let $next = $('<div>')
                .addClass("next")
                .html('<i class="fas fa-arrow-right"></i>');
            $('#date-picker .grid').append($next);
        });
    }
    populateGrid();

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
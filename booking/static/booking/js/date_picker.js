$(document).ready(function () {
    var $mp = $('#date-picker');

    function positionDatePicker() {
        let position = $('.date i').position();
        var x = position.left - 90 < $(window).width() - 272 - 12 ?
            position.left - 90 :
            $(window).width() - 272 - 12;
        var y = position.top + 32 < $(window).height() - 217 ?
            position.top + 32 :
            $(window).height() - 217;

        $mp.css('top', y);
        $mp.css('left', x);
    }

    $('.date i').on('click touchend', function (event) {
        event.preventDefault();
        $mp.toggle();
        
        $(window).trigger('resize'); // workaround for positioning bug
        
        positionDatePicker();
    });

    $(window).on('resize orientationchange', function () {
        positionDatePicker();
    });

    $('#date-picker').on('click touchend', '.grid div', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
    });

    $('#date-picker').on('click touchend', '.close', function (event) {
        $mp.hide();
    });

    function populateGrid(context = {}) {
        console.log('populateGrid();');
        $.get('/booking/date_picker', context, function (response) {
            // console.log(response);
            $('#date-picker').append(response);

            let $prev = $('<div>')
                .addClass("prev")
                .html('<i class="fas fa-arrow-left"></i>');
            $('#date-picker .grid').prepend($prev);

            let $next = $('<div>')
                .addClass("next")
                .html('<i class="fas fa-arrow-right"></i>');
            $next.insertAfter('.grid div:nth-of-type(8)');
        });
    }
    populateGrid();
});
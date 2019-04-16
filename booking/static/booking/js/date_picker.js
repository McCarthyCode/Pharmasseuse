$(document).ready(function () {
    var $mp = $('#month-picker');

    function positionMonthPicker() {
        let position = $('.date i').position();

        $mp.css('left', position.left - 90);
        $mp.css('top', position.top + 32);
    }

    $('.date i').on('click touchend', function (event) {
        event.preventDefault();
        $mp.toggle();
        
        if (event.type === 'click') {
            positionMonthPicker();
        } else if (event.type === 'touchend') {
        }
    });

    $(window).resize(function () {
        positionMonthPicker();
    });

    $('#month-picker .days li').on('click touchend', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
    });
});
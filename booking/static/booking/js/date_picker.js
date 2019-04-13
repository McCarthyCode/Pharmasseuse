$(document).ready(function () {
    var $mp = $('#date-picker');

    function positionDatePicker() {
        let position = $('.date i').position();
        var x = position.left - 90 < $(window).width() - 228 ?
            position.left - 90 :
            $(window).width() - 228;
        var y = position.top + 32 < $(window).height() - 211 ?
            position.top + 32 :
            $(window).height() - 211;

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

    $('#date-picker .days li').on('click touchend', function (event) {
        event.preventDefault();
        $(this).toggleClass('active');
    });

    $('#date-picker .close').on('click touchend', function (event) {
        $mp.hide();
    });
});
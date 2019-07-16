$(document).ready(function () {
    // animate on chevron click
    $('.chevron').on('click touchend', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $('.content').offset().top - 48,
        }, 1000);
    });

    // resize Google Maps widget
    function resizeMap() {
        var $map = $('#gmap-canvas');
        var width = $(this).width();

        if (width >= 576) {
            $map.attr('width', 400).attr('height', 400);
        } else if (width >= 360 && width < 576) {
            $map.attr('width', 300).attr('height', 300);
        } else  {
            $map.attr('width', 200).attr('height', 200);
        }
    }

    // window event listeners
    resizeMap();
    $(window).resize(function () {
        resizeMap();
    });
    $(window).on('orientationchange', function () {
        $(window).trigger('resize');
    });
});
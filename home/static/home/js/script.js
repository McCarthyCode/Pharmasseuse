$(document).ready(function () {
    $('.chevron').on('click touchend', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $('.content').offset().top - 48,
        }, 1000);
    });
});
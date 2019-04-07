$(document).ready(function () {
    $('.chevron').on('click touchend', function (event) {
        event.preventDefault();

        $("html, body").animate({
            scrollTop: $(".chevron").offset().top + 10
        }, 1000);
    });
});
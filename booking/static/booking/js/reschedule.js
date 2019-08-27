$(document).ready(function () {
    var $calendarContent = $('#calendarContent');

    $calendarContent.on('click touchend', 'ul li', function (event) {
        event.preventDefault();

        var context = {
            'csrfmiddlewaretoken': $('#csrf input').val(),
            'appointment-id': $(this).data('id'),
        };

        $.ajax({
            method: 'POST',
            url: '/booking/reschedule-submit/',
            data: context,
            statusCode: {
                200: function () {
                    window.location.href = '/profile/';
                },
                500: function () {
                    window.location.href = '/profile/';
                }
            },
        });
    });
});
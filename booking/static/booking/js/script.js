$(document).ready(function () {
    // update dimensions and set height attributes
    function updateCalendarHeight() {
        let size = $(window).height()
            - $('h3.title').outerHeight()
            - $('#navbar').outerHeight()
            - 40;
        $('#calendar').css('height', size);
        $('#calendar-content').css('height', size - 42);
    }

    // event listeners
    updateCalendarHeight();
    $(window).resize(function () {
        updateCalendarHeight();
    });
    $(window).on('orientationchange', function () {
        $(window).trigger('resize');
    });

    // format calendar objects
    function alignAppointmentTimes() {
        $('#calendar-content').find('ul li').each(function () {
            let $li = $(this);
            let offset = $li.data('hour') * 4 * 16;
            
            $li.css('top', `${offset}px`);
        });
    }

    // scroll to first object in list
    function scrollTop() {
        let $li = $('#calendar-content').find('ul li:first');
        let offset = $li.data('hour') * 4 * 16;

        $('#calendar-content').scrollTop(offset);
    }

    // populate calendar
    $.get('/booking/day', function (response) {
        $('#calendar-content').append(response);
        alignAppointmentTimes();
        scrollTop();
    });
});
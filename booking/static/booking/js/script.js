$(document).ready(function () {
    // https://andylangton.co.uk/blog/development/get-viewportwindow-size-width-and-height-javascript
    var viewportWidth;
    var viewportHeight;

    function updateViewportDims() {
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        
        if (typeof window.innerWidth != 'undefined') {
            viewportWidth = window.innerWidth,
            viewportHeight = window.innerHeight;
        }
        
        // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
        else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0) {
            viewportWidth = document.documentElement.clientWidth,
            viewportHeight = document.documentElement.clientHeight;
        }
        
        // older versions of IE
        else {
            viewportWidth = document.getElementsByTagName('body')[0].clientWidth,
            viewportHeight = document.getElementsByTagName('body')[0].clientHeight;
        }
    }

    function updateCalendarHeight() {
        updateViewportDims();
        let size = viewportHeight
            - $('h3').outerHeight()
            - $('#navbar').outerHeight()
            - 40;
        $('#calendar').css('height', size);
        $('#calendar-content').css('height', size - 42);
    }

    updateCalendarHeight();
    $(window).resize(function () {
        updateCalendarHeight();
    });

    function alignAppointmentTimes() {
        $('#calendar-content').find('ul li').each(function () {
            let $li = $(this);
            let offset = $li.data('hour') * 4 * 16;
            
            $li.css('top', `${offset}px`);
        });
    }

    function scrollTop() {
        let $li = $('#calendar-content').find('ul li:first');
        let offset = $li.data('hour') * 4 * 16;

        $('#calendar-content').scrollTop(offset);
    }

    $.get('/booking/day', function (response) {
        $('#calendar-content').append(response);
        alignAppointmentTimes();
        scrollTop();
    });
});
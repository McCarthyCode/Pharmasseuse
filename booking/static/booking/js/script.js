$(document).ready(function () {
    var $calendarContent = $('#calendarContent');

    // update dimensions and set height attributes
    function updateCalendarHeight() {
        let size = $(window).height()
            - $('h3.title').outerHeight()
            - $('#navbar').outerHeight()
            - 40;
        $('#calendar').css('height', size);
        $calendarContent.css('height', size - 42);
    }

    // window event listeners
    updateCalendarHeight();
    $(window).resize(function () {
        updateCalendarHeight();
    });
    $(window).on('orientationchange', function () {
        $(window).trigger('resize');
    });

    // format calendar objects
    function alignAppointmentTimes() {
        $calendarContent.find('ul li').each(function () {
            let $li = $(this);
            let offset = $li.data('hour') * 4 * 16;

            $li.css('top', `${offset}px`);
        });
    }

    // scroll to first object in list
    function scrollTop() {
        let $li = $calendarContent.find('ul li:first');
        let offset = $li.data('hour') * 4 * 16;

        $calendarContent.scrollTop(offset);
    }

    // show loading icon while waiting for GET response
    var $imgContainer = $('<div>').addClass('img-container');
    var $img = $('<img>')
        .attr('src', '/static/booking/img/loading.gif')
        .attr('alt', 'Loading');

    function showLoadingIcon() {
        $calendarContent.empty();
        $calendarContent.append($imgContainer);
        $imgContainer.append($img);
    }

    // populate calendar
    showLoadingIcon();
    $.get('/booking/day', function (response) {
        $calendarContent.empty();
        $calendarContent.append(response);
        alignAppointmentTimes();
        scrollTop();
    });

    var $modal = $('#modal');

    // handle click event
    $calendarContent.on('click touchend', 'ul li', function (event) {
        event.preventDefault();
        var id = $('#profileId').val();

        if (id === '') {
            // redirect to sign in page
            window.location.replace('/profile/login_redirect');
        } else {
            // trigger new appointment modal
            var date = $('#calendarControls .date span').text();
            var time = $(this).text();
            $('#modalContent h3').text(date);
            $('#modalContent h4').text(time);

            var id = $(event.target).attr('data-id');
            $('#modalContent input[name=appointment-id]').val(id);

            $modal.stop().fadeIn();
        }
    });

    // handle click in darkened area outside of modal
    debounce = false;
    $(window).on('click touchend contextmenu', function (event) {
        if (event.type === 'contextmenu') {
            debounce = true;
            window.setTimeout(() => debounce = false, 250);
        } else if ($(event.target).is($('#modal, #modal .container')) &&
            !debounce) {
            $modal.stop().fadeOut();
        }
    });

    // handle close button
    $('#modalContent').on('click touchend', '.close', function (event) {
        $modal.stop().fadeOut();
    });

    // select radio buttons on corresponding label click
    $('#SW').on('click touchend', function (event) {
        $('input[type="radio"][name="massage"][value="SW"]').prop('checked', true);
    });
    $('#DT').on('click touchend', function (event) {
        $('input[type="radio"][name="massage"][value="DT"]').prop('checked', true);
    });

});

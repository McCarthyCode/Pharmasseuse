$(document).ready(function () {
    var $infoContainer = $('.info-container');
    var $editProfile = $('.edit-profile');
    var $editPassword = $('.edit-password');

    var state = "info";

    $('#appointments').DataTable({
        "order": [[ 2, "asc" ]],
    });
    
    // change state based on edit anchor click
    $('.edit a').on('click touchend', function (event) {
        event.preventDefault();

        if (state === "info") {
            $infoContainer.hide();
            $editProfile.show();
            state = "edit";
        } else if (state === "edit") {
            $editProfile.hide();
            $infoContainer.show();
            state = "info";
        } else if (state === "password") {
            $editPassword.hide();
            $editProfile.show();
            state = "edit";
        }
    });

    // show change password form on "Change" click
    $('.change').on('click touchend', function (event) {
        event.preventDefault();
        $infoContainer.hide();
        $editPassword.show();
        state = "password";
    });

    // return to info on cancel button click
    $('.edit-profile .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();
        $editProfile.hide();
        $infoContainer.show();
        state = "info";
    });
    $('.edit-password .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();
        $editPassword.hide();
        $infoContainer.show();
        state = "info";
    });

    // handle click in darkened area outside of modal
    var $modal = $('#modal');
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

    // handle table row modal trigger
    $('#appointments tbody tr').on('click touchend', function (event) {
        var firstName = $(this).children('.first-name').text();
        var lastName = $(this).children('.last-name').text();
        var email = $(this).children('input[name=email]').val();
        var phone = $(this).children('input[name=phone]').val();
        var date = $(this).children('input[name=date]').val();
        var massage = $(this).children('input[name=massage]').val();

        $('#name').text(`${firstName} ${lastName}`);
        $('#email').text(email);
        $('#phone').text(phone);
        $('#date').text(date);

        if (massage === "DT") {
            $('#massage').text("Deep Tissue");
        } else if (massage === "SW") {
            $('#massage').text("Swedish");
        } else {
            $('#massage').text("unspecified");
        }

        $modal.stop().fadeIn();
    });
});
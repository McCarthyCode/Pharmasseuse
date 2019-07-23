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
    var $swedishRadio = $('input[type="radio"][name="massage"][value="SW"]');
    var $deepTissueRadio = $('input[type="radio"][name="massage"][value="DT"]');
    var $unspecifiedRadio = $('input[type="radio"][name="massage"][value=""]');
    $('#appointments tbody tr').on('click touchend', function (event) {
        if ($(this).children('td').hasClass('dataTables_empty')) {
            return;
        }

        var profileId = $(this).children('input[name=profileId]').val();
        var firstName = $(this).children('.first-name').text();
        var lastName = $(this).children('.last-name').text();
        var email = $(this).children('input[name=email]').val();
        var phone = $(this).children('input[name=phone]').val();
        var date = $(this).children('input[name=date]').val();
        var massage = $(this).children('input[name=massage]').val();

        $('#profileId').val(profileId);
        $('#name').text(`${firstName} ${lastName}`);
        $('#email').text(email);
        $('#phone').text(phone);
        $('#date').text(date);

        var $massage = $('#massage');
        if (massage === "DT") {
            $deepTissueRadio.prop('checked', true);
        } else if (massage === "SW") {
            $swedishRadio.prop('checked', true);
        } else {
            $unspecifiedRadio.prop('checked', true);
        }

        $modal.stop().fadeIn();
    });

    // select radio buttons on corresponding label click
    $('#swedish').on('click touchend', function (event) {
        $swedishRadio.prop('checked', true);
    });
    $('#deepTissue').on('click touchend', function (event) {
        $deepTissueRadio.prop('checked', true);
    });
    $('#unspecified').on('click touchend', function (event) {
        $unspecifiedRadio.prop('checked', true);
    });

    // edit massage type
    $('#updateMassageType').on('click touchend', function () {
        var massage = $('input[name=massage]:checked').val();
    });
});
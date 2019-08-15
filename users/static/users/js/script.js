$(document).ready(function () {
    $('#appointments').DataTable({
        'order': [[ 2, 'asc' ]],
    });

    // change state based on edit anchor click
    var state = 'info';
    var $infoContainer = $('.profile .info-container');
    var $editProfile = $('.profile .edit-profile');
    var $editPassword = $('.profile .edit-password');
    $('.profile .edit a').on('click touchend', function (event) {
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

    // edit massage type on anchor click
    $('.massage-type a').on('click touchend', function (event) {
        event.preventDefault();

        $('.massage-type').hide();
        $('#changeMassageType').css('display', 'grid');
    });

    // hide massage type form on "Cancel" button click
    $('#changeMassageType .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();

        $('.massage-type').show();
        $('#changeMassageType').hide();
    });

    // submit massage type on "Update" button click
    $('#changeMassageType .btn-primary').on('click touchend', function (event) {
        event.preventDefault();

        var csrf = $('#changeMassageType input[name="csrfmiddlewaretoken"]').val();
        var massage = $('#changeMassageType input[name="massage-user"]:checked').val();
        var profileId = $('#changeMassageType input[name="profile-id"]').val();

        if (massage === '') {
            massage = null;
        }

        var context = {
            'csrfmiddlewaretoken': csrf,
            'massage': massage,
            'profile-id': profileId,
        }

        $.post('/profile/edit_massage_type', context, function () {
            window.location.replace('/profile');
        });
    });

    // revert edit form to info grid after modal close
    var $modalInfo = $('#modalContent .info:not(.details-form)');
    var $modalEdit = $('#modalContent .edit-profile');
    function revertModalInfo() {
        $modalInfo.show();
        $modalEdit.hide();
    }

    // handle click in darkened area outside of modal
    debounce = false;
    var $modal = $('#modal');
    $(window).on('click touchend contextmenu', function (event) {
        if (event.type === 'contextmenu') {
            debounce = true;
            window.setTimeout(() => debounce = false, 250);
        } else if ($(event.target).is($('#modal, #modal .container')) &&
            !debounce) {
            $modal.stop().fadeOut(500);
            window.setTimeout(revertModalInfo, 500);
        }
    });

    // handle close button
    $('#modalContent').on('click touchend', '.close', function (event) {
        $modal.stop().fadeOut(500);
        window.setTimeout(revertModalInfo, 500);
    });

    // define radio objects
    var $swedishRadio =
        $('#changeMassageType input[type="radio"][name="massage-user"][value="SW"]');
    var $deepTissueRadio =
        $('#changeMassageType input[type="radio"][name="massage-user"][value="DT"]');
    var $unspecifiedRadio =
        $('#changeMassageType input[type="radio"][name="massage-user"][value=""]');
    var $swedishRadioModal =
        $('#modalContent input[type="radio"][name="massage-admin"][value="SW"]');
    var $deepTissueRadioModal =
        $('#modalContent input[type="radio"][name="massage-admin"][value="DT"]');
    var $unspecifiedRadioModal =
        $('#modalContent input[type="radio"][name="massage-admin"][value=""]');

    // handle table row modal trigger
    var profileIdModal = 0;
    $('#appointments tbody tr').on('click touchend', function (event) {
        if ($(this).children('td').hasClass('dataTables_empty')) {
            return;
        }

        profileIdModal = $(this).children('input[name="profile-id"]').val();
        var firstName = $(this).children('.first-name').text();
        var lastName = $(this).children('.last-name').text();
        var email = $(this).children('input[name="email"]').val();
        var phone = $(this).children('input[name="phone"]').val();
        var date = $(this).children('input[name="date"]').val();
        var massage = $(this).children('input[name="massage"]').val();

        $('#name').text(`${firstName} ${lastName}`);
        $('#email').text(email);
        $('#phone').text(phone);
        $('#date').text(date);

        $('#modalContent input[name="profile-id"]').val(profileIdModal);
        $('#modalContent input[name="first-name"]').val(firstName);
        $('#modalContent input[name="last-name"]').val(lastName);
        $('#modalContent input[name="email"]').val(email);
        $('#modalContent input[name="phone"]').val(phone);

        if (massage === "DT") {
            $deepTissueRadioModal.prop('checked', true);
        } else if (massage === "SW") {
            $swedishRadioModal.prop('checked', true);
        } else {
            $unspecifiedRadioModal.prop('checked', true);
        }

        $modal.stop().fadeIn(500);
    });

    $('#swedish').on('click touchend', function (event) {
        $swedishRadio.prop('checked', true);
    });
    $('#deepTissue').on('click touchend', function (event) {
        $deepTissueRadio.prop('checked', true);
    });
    $('#unspecified').on('click touchend', function (event) {
        $unspecifiedRadio.prop('checked', true);
    });
    $('#swedishModal').on('click touchend', function (event) {
        $swedishRadioModal.prop('checked', true);
    });
    $('#deepTissueModal').on('click touchend', function (event) {
        $deepTissueRadioModal.prop('checked', true);
    });
    $('#unspecifiedModal').on('click touchend', function (event) {
        $unspecifiedRadioModal.prop('checked', true);
    });

    // change state based on edit anchor click
    $('#modalContent .edit a, #modalContent form .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();

        $modalInfo.toggle();
        $modalEdit.toggle();
    });

    // edit massage type
    $('#updateMassageType').on('click touchend', function (event) {
        event.preventDefault();

        var csrf = $('#modalContent input[name="csrfmiddlewaretoken"]').val();
        var massage = $('#modalContent input[name="massage-admin"]:checked').val();

        if (massage === '') {
            massage = null;
        }

        var context = {
            'csrfmiddlewaretoken': csrf,
            'massage': massage,
            'profile-id': profileIdModal,
        }

        $.post('/profile/edit_massage_type', context, function () {
            window.location.replace('/profile');
        });
    });

    $('#appointments_wrapper').css('font-family', "'Open Sans', Arial, sans-serif");
});
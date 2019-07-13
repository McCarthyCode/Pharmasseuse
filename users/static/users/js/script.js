$(document).ready(function () {
    var $infoContainer = $('.info-container');
    var $editProfile = $('.edit-profile');
    var $editPassword = $('.edit-password');

    var state = "info";
    
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

    $('.edit-profile .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();
        $editProfile.hide();
        $infoContainer.show();
        state = "info";
    });

    $('.change').on('click touchend', function (event) {
        event.preventDefault();
        $infoContainer.hide();
        $editPassword.show();
        state = "password";
    });

    $('.edit-password .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();
        $editPassword.hide();
        $infoContainer.show();
        state = "info";
    });
});
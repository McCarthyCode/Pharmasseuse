$(document).ready(function () {
    var $infoContainer = $('.info-container');
    var $editProfile = $('.edit-profile');
    
    $('.edit a').on('click touchend', function (event) {
        event.preventDefault();
        $infoContainer.toggle();
        $editProfile.toggle();
    });

    $('.edit-profile .btn-secondary').on('click touchend', function (event) {
        event.preventDefault();
        $editProfile.hide();
        $infoContainer.show();
    });
});
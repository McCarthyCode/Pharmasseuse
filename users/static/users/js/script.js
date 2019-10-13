$(document).ready(function () {
  // DataTables
  $('#appointments').dataTable({
    'order': [[ 2, 'asc' ]],
  });

  $('#profiles').dataTable({
    'order': [[ 2, 'asc' ]],
  });

  // change state based on edit anchor click
  var state = 'info';
  var $infoContainer = $('.profile .info-container');
  var $editProfile = $('.profile .edit-profile');
  var $editPassword = $('.profile .edit-password');
  $('.profile .edit a').on('click touchend', function (event) {
    event.preventDefault();

    if (state === 'info') {
      $infoContainer.hide();
      $editProfile.show();

      state = 'edit';
    } else if (state === 'edit') {
      $editProfile.hide();
      $infoContainer.show();

      state = 'info';
    } else if (state === 'password') {
      $editPassword.hide();
      $editProfile.show();

      state = 'edit';
    }
  });

  // show change password form on "Change" click
  $('.change').on('click touchend', function (event) {
    event.preventDefault();

    $infoContainer.hide();
    $editPassword.show();

    state = 'password';
  });

  // return to info on "Cancel" button click
  $('.edit-profile .btn-secondary').on('click touchend', function (event) {
    event.preventDefault();

    $editProfile.hide();
    $infoContainer.show();

    state = 'info';
  });
  $('.edit-password .btn-secondary').on('click touchend', function (event) {
    event.preventDefault();

    $editPassword.hide();
    $infoContainer.show();

    state = 'info';
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

    $.post('/profile/edit-massage-type/', context, function () {
      window.location.replace('/profile/');
    });
  });

  // handle appointments table row modal trigger
  var profileIdModal = 0;
  $('#appointments tbody tr').on('click touchend', function (event) {
    if ($(this).children('td').hasClass('dataTables_empty')) {
      return;
    }

    profileIdModal = $(this).children('input[name="profile-id"]').val();
    let firstName = $(this).children('.first-name').text();
    let lastName = $(this).children('.last-name').text();
    let email = $(this).children('input[name="email"]').val();
    let phone = $(this).children('input[name="phone"]').val();
    let date = $(this).children('input[name="date"]').val();
    let massage = $(this).children('input[name="massage"]').val();

    $('#name').text(`${firstName} ${lastName}`);
    $('#email').text(email);
    $('#phone').text(phone);
    $('#date').text(date);

    $('#detailsModalContent input[name="profile-id"]').val(profileIdModal);
    $('#detailsModalContent input[name="first-name"]').val(firstName);
    $('#detailsModalContent input[name="last-name"]').val(lastName);
    $('#detailsModalContent input[name="email"]').val(email);
    $('#detailsModalContent input[name="phone"]').val(phone);

    if (massage === 'DT') {
      $deepTissueRadioModal.prop('checked', true);
    } else if (massage === 'SW') {
      $swedishRadioModal.prop('checked', true);
    } else {
      $unspecifiedRadioModal.prop('checked', true);
    }

    $detailsModal.stop().fadeIn(500);
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

  // handle edit profile table row modal trigger
  var $editProfileModal = $('#editProfileModal');
  $('#profiles tbody tr').on('click touchend', function (event) {
    if ($(this).children('td').hasClass('dataTables_empty')) {
      return;
    }

    profileIdModal = $(this).children('.profile-id').text();
    let firstName = $(this).children('.first-name').text();
    let lastName = $(this).children('.last-name').text();
    let email = $(this).children('.email').text();
    let phone = $(this).children('.phone').text();

    $('#editProfileModalContent input[name="profile-id"]').val(profileIdModal);
    $('#editProfileModalContent input[name="first-name"]').val(firstName);
    $('#editProfileModalContent input[name="last-name"]').val(lastName);
    $('#editProfileModalContent input[name="email"]').val(email);
    $('#editProfileModalContent input[name="phone"]').val(phone);

    $editProfileModal.fadeIn(500);
  });

  // handle "Add Appointment" button modal trigger
  var $addAppointmentModal = $('#addAppointmentModal');
  $('#addAppointment').on('click touchend', function () {
    $addAppointmentModal.fadeIn(500);
  });

  // revert edit form to info grid after modal close
  var $detailsModalInfo = $('#detailsModalContent .info:not(.details-form)');
  var $detailsModalEdit = $('#detailsModalContent .edit-profile');
  function revertModalInfo() {
    $detailsModalInfo.show();
    $detailsModalEdit.hide();
  }

  // clear search bars in add appointment modal
  var $firstName = $('#firstNameAddAppointment');
  var $lastName = $('#lastNameAddAppointment');
  var $dropdown = $('#dropdownContainer');
  var $activeId = $('#addAppointmentModal input[name="active-id"]');
  var $email = $('#addAppointmentModal input[name="email"]');
  var $phone = $('#addAppointmentModal input[name="phone"]');
  var index = -1;
  function clearSearch() {
    $firstName.val('');
    $lastName.val('');

    $dropdown.html('');

    $activeId.val(0);
    $email.val('');
    $phone.val('');

    index = -1;
  }

  // handle click in darkened area outside of modal
  debounce = false;
  var $detailsModal = $('#detailsModal');
  var $editProfileModal = $('#editProfileModal');
  $(window).on('click touchend contextmenu', function (event) {
    if (event.type === 'contextmenu') {
      debounce = true;
      window.setTimeout(() => debounce = false, 250);
    } else if ($(event.target).is($detailsModal) && !debounce) {
      $detailsModal.stop().fadeOut(500);
      window.setTimeout(revertModalInfo, 500);
    } else if ($(event.target).is($addAppointmentModal) && !debounce) {
      $addAppointmentModal.stop().fadeOut(500);
      window.setTimeout(clearSearch, 500);
    } else if ($(event.target).is($editProfileModal) && !debounce) {
      $editProfileModal.stop().fadeOut(500);
    }
  });

  // handle close button
  $('#detailsModal, #addAppointmentModal, #editProfileModal')
    .on('click touchend', '.close', function (event) {
    let $modal = $($(this).parent().parent()[0]);
    $modal.stop().fadeOut(500);

    if ($modal.is($detailsModal)) {
      window.setTimeout(revertModalInfo, 500);
    } else if ($modal.is($addAppointmentModal)) {
      window.setTimeout(clearSearch, 500);
    }
  });

  // handle "Cancel" button in edit profile modal
  $('#editProfileModal button.btn-secondary')
    .on('click touchend', function (event) {
      event.preventDefault();
    $editProfileModal.stop().fadeOut(500);
  });

  // define radio objects
  var $swedishRadio =
    $('#changeMassageType input[type="radio"][name="massage-user"][value="SW"]');
  var $deepTissueRadio =
    $('#changeMassageType input[type="radio"][name="massage-user"][value="DT"]');
  var $unspecifiedRadio =
    $('#changeMassageType input[type="radio"][name="massage-user"][value=""]');
  var $swedishRadioModal =
    $('#detailsModalContent input[type="radio"][name="massage-admin"][value="SW"]');
  var $deepTissueRadioModal =
    $('#detailsModalContent input[type="radio"][name="massage-admin"][value="DT"]');
  var $unspecifiedRadioModal =
    $('#detailsModalContent input[type="radio"][name="massage-admin"][value=""]');

  // change state based on edit anchor click
  $('#detailsModalContent .edit a, #detailsModalContent form .btn-secondary').on('click touchend', function (event) {
    event.preventDefault();

    $detailsModalInfo.toggle();
    $detailsModalEdit.toggle();
  });

  // edit massage type
  $('#updateMassageType').on('click touchend', function (event) {
    event.preventDefault();

    var csrf = $('#detailsModalContent input[name="csrfmiddlewaretoken"]').val();
    var massage = $('#detailsModalContent input[name="massage-admin"]:checked').val();

    if (massage === '') {
      massage = null;
    }

    var context = {
      'csrfmiddlewaretoken': csrf,
      'massage': massage,
      'profile-id': profileIdModal,
    }

    $.post('/profile/edit-massage-type/', context, function () {
      window.location.replace('/profile/');
    });
  });

  $('#appointments_wrapper, #profiles_wrapper')
    .css('font-family', "'Open Sans', Arial, sans-serif");

  // dropdown handler
  $('#firstNameAddAppointment, #lastNameAddAppointment').on('input', function () {
    let firstName = $firstName.val();
    let lastName = $lastName.val();

    if (!firstName && !lastName) {
      clearSearch();
    }

    let context = {
      'first-name': firstName,
      'last-name': lastName,
    }

    $.ajax({
      'url': '/profile/search-by-name/',
      'data': context,
      'success': function (data) {
        $dropdown.html(data);
      },
      'statusCode': {
        204: function () {
          $dropdown.html('');
        },
      }
    });
  });

  // auto-fill on li click
  $dropdown.on('click touchend', 'ul li', function () {
    let firstName = $(this).children('.first-name').html();
    let lastName = $(this).children('.last-name').html();
    let activeId = $(this).children('input[name="id"]').val();
    let email = $(this).children('input[name="email"]').val();
    let phone = $(this).children('input[name="phone"]').val();

    $firstName.val(firstName);
    $lastName.val(lastName);
    $activeId.attr('value', activeId);
    $email.val(email);
    $phone.val(phone);

    $dropdown.html('');
  });

  // hide dropdown on input focus exit
  $(window).on('click touchend', function () {
    if (!$firstName.is(':focus') && !$lastName.is(':focus')) {
      $dropdown.html('');
    }
  });

  // handle keypress events
  $('#firstNameAddAppointment, #lastNameAddAppointment')
    .keypress(function (event) {
    let length = $('#dropdownContainer ul li').length;

    switch (event.keyCode) {
      case 13: // enter
        event.preventDefault();
        let $active = $('#dropdownContainer ul li.active').first();
        let firstName = $active.children('.first-name').html();
        let lastName = $active.children('.last-name').html();
        let activeId = $active.children('input[name="id"]').val();
        let email = $active.children('input[name="email"]').val();
        let phone = $active.children('input[name="phone"]').val();

        $firstName.val(firstName);
        $lastName.val(lastName);
        $activeId.attr('value', activeId);
        $email.val(email);
        $phone.val(phone);

        $dropdown.html('');
        index = -1;
        break;
      case 27: // esc
        $dropdown.html('');
        index = -1;
        break;
      case 38: // up arrow
        $('#dropdownContainer ul li').removeClass('active');

        if (index === -1) {
          index = 0;
        } else if (length > 0) {
          index = (length + index - 1) % length;
        }

        $(`#dropdownContainer ul li:nth-child(${index + 1})`).addClass('active');
        break;
      case 40: // down arrow
        $('#dropdownContainer ul li').removeClass('active');

        if (index === -1) {
          index = 0;
        } else if (length > 0) {
          index = (index + 1) % length;
        }

        $(`#dropdownContainer ul li:nth-child(${index + 1})`).addClass('active');
        break;
    }
  });

  // handle mouseenter and mouseleave events
  $('#dropdownContainer').on('mouseenter', 'ul', function () {
    $('#dropdownContainer ul li.active')
      .removeClass('active')
      .addClass('inactive');
  }).on('mouseleave', 'ul', function () {
    $('#dropdownContainer ul li.inactive')
      .removeClass('inactive')
      .addClass('active');
  });

  // clear input on button click
  $('#clearFields').on('click touchend', function (event) {
    event.preventDefault();
    clearSearch();
  });

  // handle "Delete User" button click
  $('#editProfileModal button.btn-danger').on('click touchend', function (event) {
    event.preventDefault();

    let data = {
      'csrfmiddlewaretoken': $('#editProfileModal input[name="csrfmiddlewaretoken"]').val(),
      'profile-id': $('#editProfileModal input[name="profile-id"]').val(),
    }

    $.post('/profile/delete-profile/', data, function () {
      window.location.replace('/profile/');
    });
  });
});
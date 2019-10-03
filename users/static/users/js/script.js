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

    $.post('/profile/edit-massage-type/', context, function () {
      window.location.replace('/profile/');
    });
  });

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

    $('#detailsModalContent input[name="profile-id"]').val(profileIdModal);
    $('#detailsModalContent input[name="first-name"]').val(firstName);
    $('#detailsModalContent input[name="last-name"]').val(lastName);
    $('#detailsModalContent input[name="email"]').val(email);
    $('#detailsModalContent input[name="phone"]').val(phone);

    if (massage === "DT") {
      $deepTissueRadioModal.prop('checked', true);
    } else if (massage === "SW") {
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

  // handle add appointment button modal trigger
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
  var $dropdown = $('#dropdown');
  var $activeId = $('#addAppointmentModal input[name="active-id"]');
  function clearSearch() {
    $firstName.val('');
    $lastName.val('');

    $dropdown.html('');

    $activeId.val(0);
  }

  // handle click in darkened area outside of modal
  debounce = false;
  var $detailsModal = $('#detailsModal');
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
    }
  });

  // handle close button
  $('#detailsModal, #addAppointmentModal')
    .on('click touchend', '.close', function (event) {
    let $modal = $($(this).parent().parent()[0]);
    $modal.stop().fadeOut(500);

    if ($modal.is($detailsModal)) {
      window.setTimeout(revertModalInfo, 500);
    } else if ($modal.is($addAppointmentModal)) {
      window.setTimeout(clearSearch, 500);
    }
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

  $('#appointments_wrapper').css('font-family', "'Open Sans', Arial, sans-serif");

  // dropdown handler
  $('#firstNameAddAppointment, #lastNameAddAppointment').on('input', function () {
    let context = {
      'first-name': $firstName.val(),
      'last-name': $lastName.val(),
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
        400: function () {
          clearSearch();
        }
      }
    });
  });

  // auto-fill
  $('#dropdown').on('click touchend', 'ul li', function () {
    let firstName = $(this).children('.first-name').html();
    let lastName = $(this).children('.last-name').html();

    $firstName.val(firstName);
    $lastName.val(lastName);

    let activeId = $(this).children('input[name="id"]').val();
    $activeId.val(activeId)

    $dropdown.html('');
  });

  // hide dropdown on input focus exit
  $(window).on('click touchend', function () {
    if (!$firstName.is(':focus') && !$lastName.is(':focus')) {
      $dropdown.html('');
    }
  });
});
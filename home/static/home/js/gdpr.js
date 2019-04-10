$(document).ready(function () {
    var gdpr = getCookie("gdpr");

    if (gdpr === "") {
        setCookie("gdpr", "false");
        gdpr = getCookie("gdpr");
        $(".banner").show();
    } else if (gdpr === "false") {
        $(".banner").show();
    } else if (gdpr === "true") {
        $(".banner").hide();
    }

    $("#close").click(function (event) {
        event.preventDefault();
        $(".banner").hide();
        setCookie("gdpr", "true");
    });
});
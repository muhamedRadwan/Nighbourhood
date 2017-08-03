var open = false;
/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("map").style.marginLeft = "250px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
}


$('.navbar-opener').click(function () {
    $('.opener').toggleClass('rightimg');
    if (!open) {
        openNav();
		open = true;
		$(this).css("left", "248px");
    } else {
        closeNav();
        open = false;
        $(this).css("left", "0");
    }
});
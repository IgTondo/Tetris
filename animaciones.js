$(document).ready(function () {
    $("#boton").click(function (e) { 
        e.preventDefault();
        $("#boton").animate({opacity: "0"}, 1000);
        $(".logo").delay(1000).animate({marginTop: "50px"}, 1000);
        $("#gameboard").css("display", "flex").fadeIn();
    });
});

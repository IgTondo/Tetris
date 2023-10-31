$(document).ready(function () {
    $("#gameboard").hide();
    $("#boton").click(function (e) { 
        e.preventDefault();
        $("#boton").animate({opacity: "0"}, 1000);
        $(".logo").delay(1000).animate({marginTop: "-100px"}, 1000);
        $("#game_board").delay(2000).show(1000);
    });
});

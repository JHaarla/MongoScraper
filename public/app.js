$(".save-btn").on("click", function (id) {
    id = $(this).attr("data-id");

    $.ajax({
        
        url: "/saved/" + id,
        method: "PUT"

    });
    location.reload();

})
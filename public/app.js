
$(".save-btn").on("click", function (id) {
    id = $(this).attr("data-id");

    // $.ajax({

    //     url: "/saved/" + id,
    //     method: "PUT"

    // });
    // location.reload();

    axios({
        method: "post",
        url: "/saved/" + id
    })
    location.reload();
})


$(".delete-btn").on("click", function (id) {
    id = $(this).attr("data-id");

    // $.ajax({

    //     url: "/saved/" + id,
    //     method: "PUT"

    // });
    // location.reload();

    axios({
        method: "post",
        url: "/deleteone/" + id
    })
    location.reload();
})


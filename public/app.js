
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

$(document).on("click", ".comment-btn", function() {
    //empty the comment field
    const thisID = $(this).attr("data-id");

    //axios call to get article
    axios({
        method: "get",
        url: "/articles/" + thisID
    })
    .then(function(data) {
        for (i = 0; data.comment.length; i++) {
            const id = data.comment[i];
            axios({
                method: "get",
                url: "/comments/" + id
            })
            .then(function(data){
                $(".comment-container").append("<li class='list-group-item comment'>" + data.body + "</li> <button class='btn btn-danger btn-sm delete-comment' data-id='" + data._id + "'>Delete</button> </td> </tr>")
            })
        }
    });

}); 


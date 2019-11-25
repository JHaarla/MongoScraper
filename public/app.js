
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

    axios({
        method: "post",
        url: "/deleteone/" + id
    })
    location.reload();
})

$(document).on("click", ".comment-btn", function() {
    //empty the comment field
    $("#bodyinput").val("");

    const thisID = $(this).attr("data-id");

    //axios call to get article
    axios({
        method: "get",
        url: "/articles/" + thisID
    })
    .then(function(data) {
        console.log(data);
        console.log(data.data.title);
        for (i = 0; i < data.data.comment.length; i++) {
            const id = data.data.comment[i];
            console.log("ID: " + id);
            axios({
                method: "get",
                url: "/comments/" + id
            })
            .then(function(data){
                $(".comment-container").append("<li class='list-group-item comment'>" + data.body + "</li> <button class='btn btn-danger btn-sm delete-comment' data-id='" + data._id + "'>Delete</button> </td> </tr>")
            });
        }
        console.log(data.data._id);
        $(".modal-footer").prepend("<button type='button' class='btn btn-primary btn-sm' id='save-comment-btn' data-dismiss='modal' data-id='" + data.data._id + "'>Save Comment</button>");
    });
    $("#save-comment-btn").remove();
}); 

$(document).on("click", "#save-comment-btn", function() {
    const id = $(this).attr("data-id");
    console.log(id);
    console.log("bodyinput: " + $("#bodyinput").val());

    axios({
        method: "POST",
        url: "/arts/" + id,
        data: {
            body: $("#bodyinput").val()
        }
    })
    // .then(function(dummy){

    // })
    // .catch(function(err){
    //     res.json(err);
    // })
});
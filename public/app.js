
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
    $(".comment-container"). empty();
    const thisID = $(this).attr("data-id");

    //axios call to get article
    axios({
        method: "get",
        url: "/articles/" + thisID
    })
    .then(function(res) {
        console.log(res);
        const data = res.data;
        console.log(data.title);
        for (i = 0; i < data.comment.length; i++) {
            const id = data.comment[i]._id;
            console.log(id);
            axios({
                method: "get",
                url: "/comments/" + id
            })
            .then(function(data){
                console.log(data);
                $(".comment-container").append("<li class='list-group-item comment'>" + data.data.comment + " <button class='btn btn-danger btn-sm delete-comment float-right' data-dismiss='modal' data-id='" + data.data._id + "'>Delete</button></li>")
            });
        }
        console.log(data._id);
        $(".modal-footer").prepend("<button type='button' class='btn btn-primary btn-sm' id='save-comment-btn' data-dismiss='modal' data-id='" + data._id + "'>Save Comment</button>");
    });
    $("#save-comment-btn").remove();
}); 

$(document).on("click", "#save-comment-btn", function() {
    const id = $(this).attr("data-id");
    // debugger;
    console.log(id);
    console.log("bodyinput: " + $("#bodyinput").val());
    var comment = $("#bodyinput").val();
    console.log(comment);

    if (comment.length !== 0) {

    // $.ajax({
    axios({
        method: "POST",
        url: "/arts/" + id,
        data: {
            comment
            // body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        console.log(data);
    })
} else {
    alert("Please enter your comment. No need to save a blank comment...");
}
});

$(document).on("click", ".delete-comment", function(delCom){
    const id = $(this).attr("data-id");
    console.log(id);
    axios({
        url: "/delete-comment/" + id,
        method: "POST"
    })
    .then(function(data) {
        console.log("Comment deleted")
    });
})
$(function() {


    $('.deleteSavedArticleButton').on("click", function(event) {
        event.preventDefault();

        $('.articleDeleteBody').empty();

        let articleId = $(this).data("id");

        $.ajax("/api/delete/article/" + articleId, {
            type: "PUT"
        }).then(function() {
            let newText = $('<div>');
            newText.text("Article deleted from your Saved Articles");
            $('.articleDeleteBody').append(newText);
            $('#articleDeleteModal').modal('show');
        })

    });

    $('.deleteSavedArticleModalButton').on('click', function(event) {

        event.preventDefault();

        $.ajax("/saved", {
            type: "GET"
        }).then(function() {
            location.reload();
            console.log("saved site updated")
        })

    });
    
    $('.addNoteButton').on("click", function(event) {

        event.preventDefault();

        let articleId = $(this).data("id");
        $('.noteModalBody').empty();
        $('.noteAlert').remove();

        $.ajax("/api/notes/" + articleId, {
            type: "GET"
        }).then(function(result) {

            $('.noteModalBody').append("<h2>" + result.headline + "</h2>");
            $('.noteModalBody').append("<ul id='noteList'>")

            let newForm = $('<form>');
            
            let newFormGroup1 = $('<div>');
            newFormGroup1.addClass("form-group");
            let newFormGroupLabel1 = $('<label for="titleinput">');
            newFormGroupLabel1.text("New Note Title");
            newFormGroup1.append(newFormGroupLabel1);
            newFormGroup1.append("<input id='titleinput' name='title' >");

            let newFormGroup2 = $('<div>');
            newFormGroup2.addClass("form-group");
            let newFormGroupLabel2 = $('<label for=bodyinput">');
            newFormGroupLabel2.text("New Note Text");
            newFormGroup2.append(newFormGroupLabel2);
            newFormGroup2.append("<textarea id='bodyinput' name='body'></textarea>");


            // let newButton = $("<button data-id='" + result._id + "' class='saveNoteButton'>Save Note</button>");

            $('.saveNoteButton').attr("data-id", result._id)
            newForm.append(newFormGroup1);
            newForm.append(newFormGroup2);
            // newForm.append(newButton);

            $('.noteModalBody').append(newForm)

            for (let i = 0; i < result.note.length; i ++) {
                let newCard = $('<div class=card>');
                newCard.addClass("noteCard")
                let newCardHeader = $('<div class=card-header>' + result.note[i].title + '</div>');
                let newCardBody = $('<div class=card-body>');
                newCardBody.addClass("noteCardBody")
                newCardBody.text(result.note[i].body)
                newCard.append(newCardHeader);
                newCard.append(newCardBody);
                newCard.append("<button class=deleteNoteButton data-id=" + i + ">Delete</button>");

                $('.noteModalHeader').append(newCard);
                
            }
        }).then(
            $('#noteModal').modal('show')
        )

    });

    $('.saveNoteButton').on("click", function(event) {

        let articleId = $(this).attr("data-id");

        $.ajax("/api/create/notes/" + articleId, {
            type: "POST",
            data: {
                title: $("#titleinput").val(),
                body: $("#bodyinput").val()
            }
        }).then(function(result) {
            console.log(result);
            let noteAdded = $('<p>');
            noteAdded.addClass('noteAlert');
            noteAdded.text("Note successfully added")
            $('.alertDiv').append(noteAdded);
            $("#titleinput").val("");
            $("#bodyinput").val("");
        })

    });

    $('.deleteNoteButton').on("click", function(event) {

        event.preventDefault();

        console.log("clicked");


    });


});

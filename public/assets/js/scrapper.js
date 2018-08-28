$(document).ready(function() {

     /* Initialize Modals */ 
    $('#saveModal').modal(); // Articles Saved Modal
    $('#modalMessage').modal(); // Message Modal
    $('#articleModal').modal(); // Notes Modal
  

    /* Event Listeners */ 
    $('.searchArticle').on("click", () => { 
        // Scrap Articles Request
      fetch("/api/search", {method: "GET"}).then(() => window.location.replace("/api/search"));
    }); // End searchArticle btn Click
  
    $('.addArticle').on("click", function(element) { // Save an Article Request
  
  
  
      var headline = $(this).attr("data-headline");
      var summary = $(this).attr("data-summary");
      var url = $(this).attr("data-url");
      var imageURL = $(this).attr("data-imageURL");
      var slug = $(this).attr("data-slug");
      var modalID = $(this).attr("data-url") + "modal"
  
      // Create JSON to be Sent to Backend
      var savedArticle = {
        headline,
        summary,
        url,
        imageURL,
        slug,
        comments: null
      };
  
      fetch("/api/add", { 
          // Send savedArticle to the Server
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(savedArticle)
      }).then((response) => {
        console.log(response)
        $("#modalMessage").modal('open');
        $("#modalMessage .modal-content ").html("<h4> Sucessfully Added Article </h4>");
        setTimeout(() => $("#modalMessage").modal('close'), 1500);
        $(document.getElementById(url)).css('display', 'none');
      });
  
    }); // End addArticle Btn click
  
    $('.savedArticles').on("click", () => { 
        // Query for Saved Articles
      console.log("Saved Button clicked");
      $(".collection").html("");
      $("#textarea1").val("");
  
      fetch("/api/savedArticles", {method: "GET"}).then(response => response.json()).then((response) => {
  
        response.map(article => {
          var articleDiv = "<li id='" + article["_id"] + "' data-url='" + article.url + "' data-slug='" + article.slug + "' class='collection-item avatar hover modal-trigger' href='#articleModal'><img src='" + article.imageURL + "'class='circle'><span class='title'>" + article.headline + "</span><p>" + article.summary + "</P><a class='secondary-content deleteArticle'><i class='material-icons hoverRed'>delete_forever</i></a></li>";
          $(".collection").prepend(articleDiv);
  
          sessionStorage.setItem(article["_id"], JSON.stringify(article)) 
          // Store Article Data in sessionStorage
  
          // Event Listeners For Each Saved Article Button
          $(document.getElementById(article["_id"])).on("click", function(event) { 
              // Event Listenr For Saved Article
  
            var modalID = $(this).attr("id");
  
            var sessionArticle = JSON.parse(sessionStorage.getItem(modalID));
            $('#articleModal').modal("open");
            var title = $(this).children(".title").text();
            $('#articleID').text(title);
  
  
            $(".addComment").on("click", function() { 
                // Event Listener for Adding Comments
  
              var note = $('#textarea1').val();
  
              var noteObject = {
                body: {
                  body: note
                },
                articleID: {
                  articleID: modalID
                }
              }
  
              fetch("/api/createNotes", { 
                  // Send savedArticle to the Server
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteObject)
              }).then((response) => {
                location.reload();
              });
            });
  
  
            fetch("/api/populateNote", { 
                // Send savedArticle to the Server
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({articleID: modalID})
            }).then(response => response.json()).then((data) => {
              console.log("fetching data");
              console.log("data is " + JSON.stringify(data))
              $(".boxComments").html("");
              if (data.length >= 1) {
                data.map((comment) => {
  
                  if (comment === null) {
                    var notesDiv = "<div class='col s12 m7'><div class='card horizontal'><div class='card-image'><img src='https://lorempixel.com/100/190/nature/6'></div><div class='card-stacked center'><div class='card-content valign-wrapper'><p>No Notes.</p></div></div></div></div>";
                    $(".boxComments").prepend(notesDiv);
                  } else {
                    var notesDiv = "<div class='col s12 m7' id='" + comment["_id"] + "'><div class='card horizontal'><div class='card-image'><img src='https://lorempixel.com/100/190/nature/6'></div><div class='card-stacked center'><div class='card-content valign-wrapper'><p>" + comment.body + "</p></div><div class='card-action deleteComment' data-id=" + comment["_id"] + "><a href='#'>Delete</a></div></div></div></div>";
                    $(".boxComments").prepend(notesDiv);
                  }
  
                  $(".deleteComment").on("click", function() { 
                      // Event Listener for Each Delete Note Button
  
                    var commentID = $(this).attr("data-id");
  
                    console.log("comment Id is" + commentID)
  
                    fetch("/api/deleteComment", { 
                        // Send savedArticle to the Server
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({"_id": commentID})
                    }).then((response) => {
                      $(document.getElementById(comment["_id"])).css('display', 'none');
                    });
  
                  });
  
                });
              } else {
                var notesDiv = "<div class='col s12 m7'><div class='card horizontal'><div class='card-image'><img src='https://lorempixel.com/100/190/nature/6'></div><div class='card-stacked center'><div class='card-content valign-wrapper'><p>No Notes.</p></div></div></div></div>";
                $(".boxComments").prepend(notesDiv);
              }
            }); // End of APi Populate Note
            event.stopPropagation();
          });
  
          $(".deleteArticle").on("click", function(event) {
               // Event Listenr For Saved Article Delete Button
            var modalID = $(this).parent().attr("id");
            var sessionArticle = JSON.parse(sessionStorage.getItem(modalID));
  
            fetch("/api/deleteArticle", { 
                // Send savedArticle to the Server
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(sessionArticle)
            }).then((response) => {
              console.log(response)
              $("#modalMessage").modal('open');
              $("#modalMessage .modal-content ").html('<h4> Sucessfully Deleted:' + sessionArticle["_id"] + "</h4>");
              setTimeout(() => $("#modalMessage").modal('close'), 2000);
              $(document.getElementById(sessionArticle["_id"])).css('display', 'none');
            });
  
            event.stopPropagation();
          });
  
        });
      });
    }); 
    // End savedArticles btn Click
  }); 
  // End of document.ready
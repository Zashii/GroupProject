// When the search by Name button is selected a form and button will be created
$("#nameButton").one("click", function() {
    

    // create from to input name search
        $form = $("<form action></form>");
        $form.append("Enter Pokemon Name" + '<input type="text", id = "pokechoice">', );
    
    // create button for form search
        $button = $("<form></form>");
        $button.append('<input type="submit", value = "Search", id = "search-name">');
    
    //change existing #IDs on the DOM to reflect form and button
        $('#inputBox').append($form);
        $('#submitButton').append($button);
    
      });

    // When the search by Name button is selected a form and button will be created
    $('typeButton').one("click", function(){

        //create a list of icons to select
        $("#inputBox").add("ul").addElement("pokeType");
        $(".pokeType").addE("li").addClass("elementType").text("Test");
        
    })

    $("#search-name").on("click", function(event) {
        // This line prevents the page from refreshing when a user hits "enter".
        event.preventDefault();

        // Grab the user input
    var pokename = $("#pokechoice").val().trim();

    // Clear absolutely everything stored in localStorage using localStorage.clear()
    localStorage.clear();

    // Store the username into localStorage using "localStorage.setItem"
    localStorage.setItem("name", pokename);

    //

  });

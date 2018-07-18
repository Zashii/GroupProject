$(document).ready(function(){

            var name;
            var genus; 
            
            $('#evoDropdown').val('select');

            // If there was a name of a pokemon in local storage (due to a past search result from the homepage)
            if (localStorage.getItem("name") !== null) {
                queryURL = "https://pokeapi.co/api/v2/pokemon/" + (localStorage.getItem("name"));
                name = localStorage.getItem("name");
            } else {
                queryURL = "https://pokeapi.co/api/v2/pokemon/1";
            }    

            // The main ajax api request for the pokemon, getting the pokemon's image, abilities, height and weight
            $.ajax({
            url: queryURL,
            method: "GET"
            }).then(function(response) {
                
                    $("#pokemonImageWindow").html("<img id=\"theIMG\" src=\"" + response.sprites.front_default + "\">");
                    $("#shiny").html("<img id=\"theIMG2\" src=\"" + response.sprites.front_shiny + "\">");
                    name = response.name;
                    $("#pokemonName").html(response.name);
                    $("#type1").html("<img src=\"assets/images/type_" + response.types[0].type.name + ".gif\" style=\"width:100%\"/>");
                    if (response.types.length==2){
                        $("#type2").html("<img src=\"assets/images/type_" + response.types[1].type.name + ".gif\" style=\"width:100%\"/>");
                    } else {
                        $("#type2").html("");
                    }
                    
                    $("#ability1").html(response.abilities[0].ability.name);

                    if (response.abilities.length==2){
                        $("#ability2").html(response.abilities[1].ability.name);
                    } else {
                        $("#ability2").html("");
                    }
                    $("#height").html(response.height);
                    $("#weight").html(response.weight);
            });

            //If there was a name of a pokemon in local storage (due to a past search result from the homepage)
            if (localStorage.getItem("name") !== null) {
                queryLink2 = "https://pokeapi.co/api/v2/pokemon-species/" + (localStorage.getItem("name"));
            } else {
                queryLink2 = "https://pokeapi.co/api/v2/pokemon-species/1";
            }  
           
            // Nested ajax api request to get additional information about pokemon's genus name, flavor text, evolution, etc.
            $.ajax({
            url: queryLink2,
             method: "GET"

            }).then(function(response) {

                    
                var lang;
                for (var i = 0; i < response.flavor_text_entries.length; i++){
                    if (response.flavor_text_entries[i].language.name == "en"){
                        lang = i;
                        i = response.flavor_text_entries.length;
                    }
                }

                genus = response.genera[lang].genus;
                var audio = new Audio("http://api.voicerss.org/?key=05a471cf540a4f5487dd397bb34dc941&hl=en-us&src=" + name + ". The " + genus + ". " + response.flavor_text_entries[lang].flavor_text);
                audio.play(); 

                $("#description").html("<p style=\"text-align:center; margin: 0 auto\">" + response.flavor_text_entries[lang].flavor_text + "</p>");
                $("#genus").html(response.genera[2].genus);
                    
                $("#form1").text(response.varieties[0].pokemon.name);

                if (response.varieties.length > 1){
                        $("#form2").html(response.varieties[1].pokemon.name);
                        $("#form2").attr("style","text-transform: capitalize");
                } else {
                        $("#form2").text("");
                }
                if (response.varieties.length > 2){
                        $("#form3").html(response.varieties[2].pokemon.name);
                        $("#form3").attr("style","text-transform: capitalize");
                } else {
                        $("#form3").text("");
                }
                if (response.varieties.length > 3){
                        $("#form4").html(response.varieties[3].pokemon.name);
                        $("#form4").attr("style","text-transform: capitalize");
                } else {
                        $("#form4").text("");
                }
                    
                //Pokemon evolution chain (additional api request)
                var queryLinkEvo = response.evolution_chain.url;
                $.ajax({ 
                        url: queryLinkEvo,
                        method: "GET"

                }).then(function(response) {
                               
                        $("#evo1").text(response.chain.species.name);
                        $('#evoDropdown').val('select');
                        if (response.varieties.length > 0){
                            $("#evo2").html(response.chain.evolves_to[0].species.name);
                            $("#evo2").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo2").text("");
                        }
                        if (response.varieties.length > 0){
                            $("#evo3").html(response.chain.evolves_to[0].evolves_to[0].species.name);
                            $("#evo3").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo3").text("");
                        }

                });
                    
            });

            // Runs the entire script sequence when the user searches for a pokemon with the on-page search input box
            $("#Search").on("click", function(){
                
                var queryLink = "https://pokeapi.co/api/v2/pokemon/" + $("#Searchbox").val();

                // The main ajax api request for the pokemon, getting the pokemon's image, abilities, height and weight
                $.ajax({
                url: queryLink,
                method: "GET"

                }).then(function(response) {
                    
                        $("#pokemonImageWindow").html("<img id=\"theIMG\" src=\"" + response.sprites.front_default + "\">");
                        $("#shiny").html("<img id=\"theIMG2\" src=\"" + response.sprites.front_shiny + "\">");
                        $("#pokemonName").html(response.name);
                        name = response.name;
                        $("#type1").html("<img src=\"assets/images/type_" + response.types[0].type.name + ".gif\" style=\"width:100%\"/>");

                        if (response.types.length==2){

                            $("#type2").html("<img src=\"assets/images/type_" + response.types[1].type.name + ".gif\" style=\"width:100%\"/>");
                        } else {
                            $("#type2").html("");
                        }

                        $("#ability1").html(response.abilities[0].ability.name);

                        if (response.abilities.length==2){
                            $("#ability2").html(response.abilities[1].ability.name);
                        } else {
                            $("#ability2").html("");
                        }

                });

                // Nested ajax api request to get additional information about pokemon's genus name, flavor text, evolution, etc.
                var queryLink2 = "https://pokeapi.co/api/v2/pokemon-species/" + $("#Searchbox").val();
                $.ajax({
                url: queryLink2,
                method: "GET"

                }).then(function(response) {

                    var lang;
                    for (var i = 0; i < response.flavor_text_entries.length; i++){
                        if (response.flavor_text_entries[i].language.name == "en"){
                            lang = i;
                            i = response.flavor_text_entries.length;
                        }
                    }
                    genus = response.genera[lang].genus;
                    var audio = new Audio("http://api.voicerss.org/?key=05a471cf540a4f5487dd397bb34dc941&hl=en-us&src=" + name + ". The " + genus + ". " + response.flavor_text_entries[lang].flavor_text);
                    audio.play(); 

                    $("#description").html(response.flavor_text_entries[lang].flavor_text);
                    $("#genus").html(response.genera[2].genus);

                    $("#form1").text(response.varieties[0].pokemon.name);

                    if (response.varieties.length > 1){
                            $("#form2").html(response.varieties[1].pokemon.name);
                            $("#form2").attr("style","text-transform: capitalize");
                    } else {
                            $("#form2").text("");
                    }
                    if (response.varieties.length > 2){
                            $("#form3").html(response.varieties[2].pokemon.name);
                            $("#form3").attr("style","text-transform: capitalize");
                    } else {
                            $("#form3").text("");
                    }
                    if (response.varieties.length > 3){
                            $("#form4").html(response.varieties[3].pokemon.name);
                            $("#form4").attr("style","text-transform: capitalize");
                    } else {
                            $("#form4").text("");
                    }
                    var queryLinkEvo = response.evolution_chain.url;

                    //Pokemon evolution chain (Additional api request)
                    $.ajax({
                        
                        url: queryLinkEvo,
                        method: "GET"
                    }).then(function(response) {
                               
                        $("#evo1").text(response.chain.species.name);
                        $('#evoDropdown').val('select');
                        if (response.chain.evolves_to.length > 0){
                            $("#evo2").html(response.chain.evolves_to[0].species.name);
                            $("#evo2").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo2").text("");
                        }
                        if (response.chain.evolves_to[0].evolves_to.length > 0){
                            $("#evo3").html(response.chain.evolves_to[0].evolves_to[0].species.name);
                            $("#evo3").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo3").text("");
                        }

                    });

                });
            });

            // Runs the entire script sequence when the user chooses one of the pokemon's evolutions through the first dropbox
            $("#evoDropdown").change(function(){
                
                var currentEvo = $('#evoDropdown').find(":selected").text();
                var queryLink3 = "https://pokeapi.co/api/v2/pokemon/" + currentEvo.toLowerCase();

                // The main ajax api request for the pokemon, getting the pokemon's image, abilities, height and weight
                $.ajax({
                url: queryLink3,
                method: "GET"

                }).then(function(response) {
            
                        
                        $("#pokemonImageWindow").html("<img id=\"theIMG\" src=\"" + response.sprites.front_default + "\">");
                        $("#shiny").html("<img id=\"theIMG2\" src=\"" + response.sprites.front_shiny + "\">");
                        $("#pokemonName").html(response.name);

                        name = response.name;

                        $("#type1").html("<img src=\"assets/images/type_" + response.types[0].type.name + ".gif\" style=\"width:100%\"/>");

                        if (response.types.length==2){

                            $("#type2").html("<img src=\"assets/images/type_" + response.types[1].type.name + ".gif\" style=\"width:100%\"/>");
                        } else {
                            $("#type2").html("");
                        }

                        $("#ability1").html(response.abilities[0].ability.name);

                        if (response.abilities.length==2){
                            $("#ability2").html(response.abilities[1].ability.name);
                        } else {
                            $("#ability2").html("");
                        }
                });

                var queryLink4 = "https://pokeapi.co/api/v2/pokemon-species/" + currentEvo.toLowerCase();

                // Nested ajax api request to get additional information about pokemon's genus name, flavor text, evolution, etc.
                $.ajax({
                url: queryLink4,
                method: "GET"

                }).then(function(response) {

                    var lang;
                    for (var i = 0; i < response.flavor_text_entries.length; i++){
                        if (response.flavor_text_entries[i].language.name == "en"){
                            lang = i;
                            i = response.flavor_text_entries.length;
                        }
                    }
                    genus = response.genera[lang].genus;
                    var audio = new Audio("http://api.voicerss.org/?key=05a471cf540a4f5487dd397bb34dc941&hl=en-us&src=" + name + ". The " + genus + ". " + response.flavor_text_entries[lang].flavor_text);
                    audio.play(); 

                    $("#description").html(response.flavor_text_entries[lang].flavor_text);
                    $("#genus").html(response.genera[2].genus);

                    $("#form1").text(response.varieties[0].pokemon.name);

                    if (response.varieties.length > 1){
                        $("#form2").html(response.varieties[1].pokemon.name);
                        $("#form2").attr("style","text-transform: capitalize");
                    } else {
                        $("#form2").text("");
                    }
                    if (response.varieties.length > 2){
                        $("#form3").html(response.varieties[2].pokemon.name);
                        $("#form3").attr("style","text-transform: capitalize");
                    } else {
                        $("#form3").text("");
                    }
                    if (response.varieties.length > 3){
                        $("#form4").html(response.varieties[3].pokemon.name);
                        $("#form4").attr("style","text-transform: capitalize");
                    } else {
                        $("#form4").text("");
                    }
                    var queryLinkEvo = response.evolution_chain.url;

                    
                    // Pokemon evolution chain (additional api request)
                    $.ajax({
                        
                        url: queryLinkEvo,
                        method: "GET"
                    }).then(function(response) {
                               
                        $("#evo1").text(response.chain.species.name);
                        $('#evoDropdown').val('select');
                        if (response.chain.evolves_to.length > 0){
                            $("#evo2").html(response.chain.evolves_to[0].species.name);
                            $("#evo2").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo2").text("");
                        }
                        if (response.chain.evolves_to[0].evolves_to.length > 0){
                            $("#evo3").html(response.chain.evolves_to[0].evolves_to[0].species.name);
                            $("#evo3").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo3").text("");
                        }

                    });

                });

            }); 

            // Runs the entire script sequence when the user chooses one of the pokemon's alternate forms through the second dropbox
            $("#formDropdown").change(function(){
                
                var currentEvo = $('#formDropdown').find(":selected").text();
                var queryLink3 = "https://pokeapi.co/api/v2/pokemon/" + currentEvo.toLowerCase();
                $('#formDropdown').val('select2');

                // The main ajax api request for the pokemon, getting the pokemon's image, abilities, height and weight
                $.ajax({
                url: queryLink3,
                method: "GET"

                }).then(function(response) {
            
                        
                        $("#pokemonImageWindow").html("<img id=\"theIMG\" src=\"" + response.sprites.front_default + "\">");
                        $("#shiny").html("<img id=\"theIMG2\" src=\"" + response.sprites.front_shiny + "\">");
                        $("#pokemonName").html(response.name);

                        name = response.name;

                        $("#type1").html("<img src=\"assets/images/type_" + response.types[0].type.name + ".gif\" style=\"width:100%\"/>");

                        if (response.types.length==2){

                            $("#type2").html("<img src=\"assets/images/type_" + response.types[1].type.name + ".gif\" style=\"width:100%\"/>");
                        } else {
                            $("#type2").html("");
                        }

                        $("#ability1").html(response.abilities[0].ability.name);

                        if (response.abilities.length==2){
                            $("#ability2").html(response.abilities[1].ability.name);
                        } else {
                            $("#ability2").html("");
                        }
                });
                var queryLink4 = "https://pokeapi.co/api/v2/pokemon-species/" + currentEvo.toLowerCase();

                // Nested ajax api request to get additional information about pokemon's genus name, flavor text, evolution, etc.
                $.ajax({
                url: queryLink4,
                method: "GET"

                }).then(function(response) {

                    var lang;
                    for (var i = 0; i < response.flavor_text_entries.length; i++){
                        if (response.flavor_text_entries[i].language.name == "en"){
                            lang = i;
                            i = response.flavor_text_entries.length;
                        }
                    }
                    genus = response.genera[lang].genus;
                    var audio = new Audio("http://api.voicerss.org/?key=05a471cf540a4f5487dd397bb34dc941&hl=en-us&src=" + name + ". The " + genus + ". " + response.flavor_text_entries[lang].flavor_text);
                    audio.play(); 

                    $("#description").html(response.flavor_text_entries[lang].flavor_text);
                    $("#genus").html(response.genera[2].genus);

                    $("#form1").text(response.varieties[0].pokemon.name);

                    if (response.varieties.length > 1){
                        $("#form2").html(response.varieties[1].pokemon.name);
                        $("#form2").attr("style","text-transform: capitalize");
                    } else {
                        $("#form2").text("");
                    }
                    if (response.varieties.length > 2){
                        $("#form3").html(response.varieties[2].pokemon.name);
                        $("#form3").attr("style","text-transform: capitalize");
                    } else {
                        $("#form3").text("");
                    }
                    if (response.varieties.length > 3){
                        $("#form4").html(response.varieties[3].pokemon.name);
                        $("#form4").attr("style","text-transform: capitalize");
                    } else {
                        $("#form4").text("");
                    }
                    var queryLinkEvo = response.evolution_chain.url;

                    // Pokemon evolution chain (additional api request)
                    $.ajax({
                        
                        url: queryLinkEvo,
                        method: "GET"

                    }).then(function(response) {
                               
                        $("#evo1").text(response.chain.species.name);
                        $('#evoDropdown').val('select');
                        if (response.chain.evolves_to.length > 0){
                            $("#evo2").html(response.chain.evolves_to[0].species.name);
                            $("#evo2").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo2").text("");
                        }
                        if (response.chain.evolves_to[0].evolves_to.length > 0){
                            $("#evo3").html(response.chain.evolves_to[0].evolves_to[0].species.name);
                            $("#evo3").attr("style","text-transform: capitalize");
                        } else {
                            $("#evo3").text("");
                        }

                    });

                });

            }); 

        });
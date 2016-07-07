$(document).ready(function() {

  // Sticky menu function
  var sb = $(".search-bar");
  var rpbar = $("#random-page-bar");

    $(window).scroll(function() {
      if ($(this).scrollTop() > 300) {
        sb.addClass("search-bar-scrolled");
        $(".showing").slideDown("fast");
        sb.css("box-shadow", "0 1px 2px #566573");
        rpbar.css("display", "inline-block");
      } else {
        sb.removeClass("search-bar-scrolled");
        $(".showing").slideUp("fast");
        sb.css("box-shadow", "");
        rpbar.css("display", "none");
      }
    });

  // Wikipedia api base URL
  var baseUrl = "https://en.wikipedia.org/w/api.php?callback=?";

  // jqueryUI autocomplete function
  $("#searchbox").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: baseUrl,
        dataType: "json",
        data: {
          action: "opensearch",
          format: "json",
          search: request.term
        },
        success: function(data) {
          response(data[1]);
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      search(ui.item.label);
    }
  });

  // Search function
  function search(term) {
    $.getJSON(baseUrl, {
        srsearch: term,
        action: "query",
        list: "search",
        format: "json",
      },
      function(data) {
        $("#results").empty();
        $("#results").show();
        $("#results").append("<div class='hits'>" + data.query.searchinfo.totalhits + " results found for <b><span class='searchmatch'>" + term + "</b><span><div>");
        $.each(data.query.search, function(i, item) {
          $("#results").append("<div class='list'><div class='title'><a href='http://en.wikipedia.org/wiki/" + encodeURIComponent(item.title) + "' target='_blank'>" + item.title + "</a></div><div class='summary'" + item.snippet + "...</div></div>");
        });
      });
    //getImage();
  };

  // Get a thumbnail image to display with the results - doesn't work!
  function getImage() {
    $(".title").each(function(i) {
      var imgSearch = $(this).text();
      //console.log(imgSearch);
      $.ajax({
        url: baseUrl,
        dataType: "json",
        data: {
          titles: imgSearch,
          action: "query",
          prop: "pageimages",
          format: "json",
          formatversion: "2"
        },
        success: function(data) {
          console.log(data);
          $(".summary").append("<img src='" + data.query.pages[0].thumbnail.source + "'>");
          console.log(data.query.pages[0].thumbnail.source);
        }
      });
    });
  };

  // Check there is a search term
  // if the search button is clicked
  $("#submit-search").click(function() {
    var term = $("#searchbox").val();
    if (term == "") {
      $("#results").show();
      $("#results").html("<div class='error'><span class='glyphicon glyphicon-alert'></span> Please enter a search term<div>")
    } else {
      search(term);
    }
  });

  // Random page button mouse over effect  
  $(".random-button").mouseenter(function(){
    $(this).css("opacity", "1.0");    
  });
  $(".random-button").mouseleave(function(){
    $(this).css("opacity", "0.8");    
  });
  
  /*function getImage(search) {
    $.ajax({
      url: baseUrl,
      dataType: "json",
      data: {
        titles: search,
        action: "query",
        prop: "pageimages",
        format: "json",
        formatversion: "2"
      },
      success: function(data) {
        *****$.each(data.query.pages, function(i, item) {
          $("<img>").attr("src", item.thumbnail.source).appendTo(".summary");
        });****
        console.log(data.query.pages);
      }
    });
  }*/

});
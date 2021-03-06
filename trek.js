$(document).ready(function() {

  var url = "https://trektravel.herokuapp.com/trips";

  var tripsData = [];

  var tripsSuccessCallback = function(response) {

    var tripsTtitle = "Which of these exciting adventures are in your future?";

    tripsData = [];
    $('#trips ul').empty();
    $('#trips > h2').remove();

    $('#trips').prepend("<h2>"+tripsTtitle+"</h2>");


    for (var i = 0; i < response.length; i++) {
      tripsData.push(response[i]);
    }

    var tripsListTemplate = _.template($("#trips-list-template").html());


    for (var j = 0; j < tripsData.length; j++) {
      var generatedHtml = tripsListTemplate({
        data: tripsData[j]
      });
      $('#trips ul').append(generatedHtml);
    }
    matchHeight();
  };


  var tripsFailureCallback = function() {
    console.log("Getting all trips did not work");
    $("#errors").addClass("errorsBox");
    $("#errors").html("<h3>Sorry, we could not retrieve the list of trips at this time.</h3>");
  };


  var tripsClickHandler = function(event) {
    $.get(url, tripsSuccessCallback).fail(tripsFailureCallback);
  };


  var singleTripSuccess= function(response) {

    console.log(response);
    var indivTripTemplate = _.template($("#indiv-trip-template").html());

    var generatedHtml = indivTripTemplate({
      data: response
    });

    $('#load-all-trips').hide();
    $('div.by-continent').hide();
    $('#trips').hide();
    $('#singleTrip').show();
    $('#singleTrip').addClass("tripInfoBox");
    $('#singleTrip').html($(generatedHtml));
  };


  var singleTripFailure = function(){
    console.log("Getting an individual trip did not work");
    $("#errors").addClass("errorsBox");
    $("#errors").html("<h3>Sorry, we could not retrieve the requested trip at this time.</h3>");
  };


  var singleTripHandler = function(event){
    tripURL = url + "/" + $(this).attr("data-tripID");
    $.get(tripURL, singleTripSuccess).fail(singleTripFailure);
  };


  var hideTripHandler = function(event){
    $('#singleTrip').hide();
    $('#load-all-trips').show();
    $('div.by-continent').show();
    $('#trips').show();
  };


  var ReserveTripHandler = function(event){
    console.log("Reserving A spot");

    var tripID = $(this).attr("data-tripID");
    var reserveTripURL = url + "/" + tripID + "/" + "reserve";

    var reservationTemplate = _.template($("#reservation-template").html());

    var generatedHtml = reservationTemplate({
      url: reserveTripURL,
      tripID: tripID
    });

    $('div#reservationForm').html(generatedHtml);

    $('#form-'+tripID).submit(function(event) {
      event.preventDefault();
      var postURL = $(this).attr("action");
      var formData = $(this).serialize();
      $.post(postURL, formData, reserveSuccess).fail(reserveFailure);

      console.log("submit step 1");
    });

    $('#form-'+tripID).on("click", "button.no_thanks", hideTripHandler);

  };


  var reserveSuccess = function(event){
    $('div#reservationForm').html('<h4> Congratulations. You have booked this trip! </h4>');
    console.log("submit step 2");
  };


  var reserveFailure = function(){
    console.log("Reserving a trip did not work");
    $("#errors").addClass("errorsBox");
    $("#errors").html("<h3>Sorry, we were unable to reserve a spot for you at this time.</h3>");
    $('div#reservationForm').hide();
  };



  var continentHandler = function() {

    var continent = ($(this).html());
    var continentURL = url + "/continent?query=" + continent;
    $.get(continentURL, tripsSuccessCallback).fail(continentFailure);
  };



  var continentFailure = function() {
    console.log("Getting trips by continent did not work");
    $("#errors").addClass("errorsBox");
    $("#errors").html("<h3>Sorry, we could not retrieve the list of trips by continent at this time.</h3>");
  };



  $('#load-all-trips').click(tripsClickHandler);

  $('#load-all-trips').click(tripsClickHandler);

  $("#trips").on("click", "button#ShowDetails", singleTripHandler);

  $("#singleTrip").on("click", "button#HideDetails", hideTripHandler);

  $("#singleTrip").on("click", "button#reserve", ReserveTripHandler);

  $(".dropdown-item.continent").on("click", continentHandler);


  var matchHeight = function(){
    $("[data-equalize]").each(function() {


      var parentRow = $(this),
      childrenCols = $(this).find("[data-equalizer-watch]"),
      childHeights = childrenCols.map(function(){ return $(this).height(); }).get(),
      tallestChild = Math.max.apply(Math, childHeights);


      console.log("Matching the heights");
      childrenCols.css('height', tallestChild);

    });
  };


});

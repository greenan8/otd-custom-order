//============================= Removes intial instructions =============================
$("#start-design").click(function(){
  $("#instruct").fadeOut();
  $("#instruct-bg").fadeOut();
});


//============================= Actions when a garment is clicked on =============================
$(".clothing-option").on('mousedown', function(){
  var currentID = $(this).attr('value');
  orderDetails.selectedID =  currentID;
  console.log(currentID);
  var colorList = clothingRecords[currentID].colorOptions;
  var logoPrintList = clothingRecords[currentID].logoPrintOptions;
  var textPrintList = clothingRecords[currentID].textPrintOptions;

  //change the color options under custom
  $("span.dot").attr("hidden",true);

  colorList.forEach(e => {
    $("span.dot#" + e).attr("hidden",false);   
  });
    //if selected color option is not in changed product, remove color option that is saved

  //change the logo options under custom
    //if different type remove logo position that is saved

  //change the text print options under custom
    //if empty hide text option, delete upload, remove text position that is saved
    //also print sizes that should be filled out in spreadsheet

});


//============================= Save contact details as they change =============================
$("#quantity").change(function(){orderDetails.quantity = $(this).val();});
$("#full-name").change(function(){orderDetails.fullName = $(this).val();});
$("#email").change(function(){orderDetails.email = $(this).val();});
$("#phone").change(function(){orderDetails.phone = $(this).val();});
$("#org").change(function(){orderDetails.org = $(this).val();});
$("#ratified").change(function(){orderDetails.ratified = $(this).val();});
$("#notes").change(function(){orderDetails.notes = $(this).val();});




//============================= Actions when a color is selected =============================
$(".dot").click(function(){
    $(".dot").removeClass('selected');
    $(this).addClass('selected');
    orderDetails.colorID = $(this).attr('id');
    orderDetails.colorName = $(this).attr('title')
    //TODO: change image on live preview
});

//============================= When logo submitted, upload, add to canvas, and analyze =============================


//============================= When excel submitted, upload =============================




//============================= On every mouse click or key click update the estimated price =============================
$(document).on('keyup mouseup', function(){
  //calc base cost
  if (orderDetails.selectedID && $('#ratified').val()=="comsoc"){
    basePrice = clothingRecords[orderDetails.selectedID].comPrice || 0;
  } else if (orderDetails.selectedID) {
    basePrice = clothingRecords[orderDetails.selectedID].amsPrice || 0;
  } else {
    basePrice = 0;
  }
  
  //calc stitch cost or print cost of logo and apply margin


  estimate = (parseInt($('#quantity').val()))*basePrice;
  

  !(estimate && ($('#estimate').text('$' + estimate.toFixed(2)))) && ($('#estimate').text('$0.00')) 
});

$("#submit-data").click(function(){
 
})


//============================= recaptcha to block entry until checked =============================
function recaptchaCallback(){
  $("#start-design").removeAttr('disabled');
  $("#start-design").css("background-color", "#A22C38");
  $("submit-data").removeAttr('disabled');
}
$("#start-design").mouseover(function(){ $("#start-design").css("background-color", "#A22C38AA");});
$("#start-design").mouseleave(function(){ $("#start-design").css("background-color", "#A22C38");});


//============================= When submit is clicked =============================
$("#submit").click(function(){
  //check if all needed data is filled
    //is excel and text position needed?
  //if data is missing let them them know which data
  //if all data is there then submit to server to nodemailer, put up submit notice then redirect to oilthighdesign
});
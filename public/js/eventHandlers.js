//==================== object for order details ====================
var orderDetails = {
  //product selected
  "selectedID": "",
  "name": "",
  //detials
  "orderQuantiy": 0,
  "fullName": "",
  "email": "",
  "phone": "",
  "org": "",
  "ratified": "",
  "notes": "",
  //customization
  "colorID": "",
  "colorName": "",
  "colorHex": "",
  "logoFile": "",
  "logoPosition": "",
  "printType": "",
  "textFile": "",
  "textPosition": ""
}

//==================== fetching data from backend ====================
var allrecord;
var allColors;
var clothingRecords;
var allPrintOptions;

fetch("/allRecords")
.then(response => {
    response.json().then(json => {
        allRecords = json;   
    })
})

fetch("/allColors")
.then(response => {
    response.json().then(json => {
        allColors = json;   
    })
})

fetch("/clothingRecords")
.then(response => {
    response.json().then(json => {
        clothingRecords = json;   
    })
})

fetch("/allPrintOptions")
.then(response => {
    response.json().then(json => {
        allPrintOptions = json;   
    })
})


//==================== Handling events ====================

//start design button on instruction load in
$("#start-design").click(function(){
  $("#instruct").fadeOut();
  $("#instruct-bg").fadeOut();
});

//actions when a garment is selected
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

//save contact details as they change
$("#quantity").change(function(){orderDetails.quantity = $(this).val();});
$("#full-name").change(function(){orderDetails.fullName = $(this).val();});
$("#email").change(function(){orderDetails.email = $(this).val();});
$("#phone").change(function(){orderDetails.phone = $(this).val();});
$("#org").change(function(){orderDetails.org = $(this).val();});
$("#ratified").change(function(){orderDetails.ratified = $(this).val();});
$("#notes").change(function(){orderDetails.notes = $(this).val();});




//actions when a color is selected
$(".dot").click(function(){
    $(".dot").removeClass('selected');
    $(this).addClass('selected');
    orderDetails.colorID = $(this).attr('id');
    orderDetails.colorName = $(this).attr('title')
    console.log(orderDetails);
});

//on each action recalculate estimate
$(document).on('keyup mouseup', function(){
  if (orderDetails.selectedID && $('#ratified').val()=="comsoc"){
    basePrice = clothingRecords[orderDetails.selectedID].comPrice || 0;
  } else if (orderDetails.selectedID) {
    basePrice = clothingRecords[orderDetails.selectedID].amsPrice || 0;
  } else {
    basePrice = 0;
  }
  
  estimate = (parseInt($('#quantity').val()))*basePrice;
  

  !(estimate && ($('#estimate').text('$' + estimate.toFixed(2)))) && ($('#estimate').text('$0.00')) 
});

$("#submit-data").click(function(){
 
})


function recaptchaCallback(){
  $("#start-design").removeAttr('disabled');
  $("#start-design").css("background-color", "#A22C38");
  $("submit-data").removeAttr('disabled');
}
$("#start-design").mouseover(function(){ $("#start-design").css("background-color", "#A22C38AA");});
$("#start-design").mouseleave(function(){ $("#start-design").css("background-color", "#A22C38");});
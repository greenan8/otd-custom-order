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
$("#quantity").change(function(){orderDetails.quantity = $(this).val(); updateEstimate();});
$("#full-name").change(function(){orderDetails.fullName = $(this).val();});
$("#email").change(function(){orderDetails.email = $(this).val();});
$("#phone").change(function(){orderDetails.phone = $(this).val();});
$("#org").change(function(){orderDetails.org = $(this).val();});
$("#ratified").change(function(){orderDetails.ratified = $(this).val();});
$("#notes").change(function(){orderDetails.notes = $(this).val();});




//============================= Actions when a color, size, and print type is selected =============================
$(".dot").click(function(){
    $(".dot").removeClass('selected');
    $(this).addClass('selected');
    orderDetails.colorID = $(this).attr('id');
    orderDetails.colorName = $(this).attr('title')
    //TODO: change image on live preview
});

$("#logo-size").change(function(){orderDetails.logoSize = parseInt($(this).val()); updateEstimate();});

$("#select-print").click(function(){
  orderDetails.printType = "Print"; 
  $(this).css("border","1px solid #A22C38");
  $("#select-stitch").css("border","1px solid #B2B2B2");
  updateEstimate();
});

$("#select-stitch").click(function(){
  orderDetails.printType = "Stitch"; 
  $(this).css("border","1px solid #A22C38");
  $("#select-print").css("border","1px solid #B2B2B2");
  updateEstimate();
});



//============================= When logo submitted, upload, add to canvas, and analyze =============================
var context = document.getElementById('logo-canvas').getContext("2d");
document.getElementById('logo-canvas').height = document.getElementById('logo-canvas').width;
var canvasHW = document.getElementById('logo-canvas').width;

$(window).resize(function(){
  
})

var img = new Image();
img.onload = function () {
    if (img.height > img.width){
      tempWidth = canvasHW*(img.width / img.height);
      context.drawImage(img, ((canvasHW-tempWidth)/2), 0, tempWidth, canvasHW);
    }
    else{
      tempHeight = canvasHW*(img.height / img.width);
      context.drawImage(img, 0, ((canvasHW-tempHeight)/2), canvasHW, tempHeight);
    }
    
    var imgData = context.getImageData(0, 0, canvasHW, canvasHW);
var colorCount = {};
var i;

for (i = 0; i < imgData.data.length; i += 4) {
  color = "";
  color = color.concat(Math.ceil((imgData.data[i]+1)/10)*10, Math.ceil((imgData.data[i+1]+1)/10)*10, Math.ceil((imgData.data[i+2]+1)/25)*10, Math.ceil((imgData.data[i+3]+1)/50)*10);
  
  if(colorCount[color] >= 0){colorCount[color] += 1;}
  else{colorCount[color] = 0};
  
}

for (var x in colorCount){
  if (colorCount[x] < canvasHW){
    delete colorCount[x];
  }
}

var count = 0;
for (var x in colorCount){
  count++;
}

if (count > 6){
  orderDetails.logoColorNum = 6;
  $("#print").text("6+ Colors")
} else{
  orderDetails.logoColorNum = count - 1;
  $("#print").text(orderDetails.logoColorNum.toString().concat(" Colors"));
} 

(!colorCount['10101010']) || (orderDetails.logoTransparency = 1 - (colorCount['10101010'] / (imgData.data.length/4)));
$("#stitch").text((Math.round(orderDetails.logoTransparency*100)).toString().concat("%"));

}


img.src = "imgs/test-logo.png";

//============================= When excel submitted, upload =============================




//============================= On every mouse click or key click update the estimated price =============================
function updateEstimate(){
  //calc base cost
  if (orderDetails.selectedID && $('#ratified').val()=="comsoc"){
    basePrice = clothingRecords[orderDetails.selectedID].comPrice || 0;
    margin = margins["COMSOC Margin"];
  } else if (orderDetails.selectedID) {
    basePrice = clothingRecords[orderDetails.selectedID].amsPrice || 0;
    margin = margins["AMS Margin"];
  } else {
    basePrice = 0;
    margin = margins["Other Margin"];
  }
  
  //calc stitch cost or print cost of logo and apply margin
  

  if(orderDetails.printType == "Print"){
    for(q in printCost){
      if (parseInt(q) >= orderDetails.quantity){
        printPrice = printCost[q][(orderDetails.logoColorNum).toString()];
        break;
      }
    }
  } else if(orderDetails.printType == "Stitch"){
    stitchCount = orderDetails.logoSize*2*orderDetails.logoTransparency*2200;
    for (q in stitchCost){
      if (parseInt(q) >= orderDetails.quantity){
        for(s in stitchCost[q]){
          if (parseInt(s) >= stitchCount){
            printPrice = stitchCost[q][s];
            console.log(stitchCost[q][s]);
            break;
          }
        }
        break;
      }
    }
    
  } else{
    printPrice = 0;
  }

  estimate = orderDetails.quantity*(basePrice + printPrice*(1+margin));
  !(estimate && ($('#estimate').text('$' + estimate.toFixed(2)))) && ($('#estimate').text('$0.00'));
};

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
  console.log(orderDetails);
    //is excel and text position needed?
  //if data is missing let them them know which data
  //if all data is there then submit to server to nodemailer, put up submit notice then redirect to oilthighdesign
});
var orderDetails = {
  "defaultID": "",
  "optionID": "",
  "name": "",
  "colorID": "",
  "colorHex": "",
  
}

var allrecord;
var allColors;
var clothingRecords;

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

$("#start-design").click(function(){
  $("#instruct").fadeOut();
  $("#instruct-bg").fadeOut();
});


$(".clothing-option").click(function(){
  var currentID = $(this).attr('value');
  var colorList;
  
  for(record in clothingRecords){
    if(clothingRecords[record].default == currentID){
      colorList = clothingRecords[record].options;
      break;
    }
  }
  $("span.dot").attr("hidden",true);

  colorList.forEach(e => {
    $("span.dot#" + e.color).attr("hidden",false).attr("value", e.id);   
  });

});

$(".dot").click(function(){
    $(".dot").removeClass('selected');
    $(this).addClass('selected');
});

$("#logo-upload")
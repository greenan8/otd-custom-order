var orderDetails = {
  "defaultID": "",
  "name": "",
}



$(".clothing-option").click(function(){
  currentID = $(this).attr('value');
  allRecords.forEach(function(record) {
    if(record.id == currentID){
      orderDetails.defaultID = record.id;
      orderDetails.name = record;
      console.log(orderDetails);
      return;        
    }
  });
  
});
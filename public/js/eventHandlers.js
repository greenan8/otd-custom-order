//============================= Creating Random unique String =============================
$(window).on('load', function() {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 20; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  orderDetails.logoMulterFile = result.concat('.png');
  $('#logo-ustring').val(orderDetails.logoMulterFile);
  orderDetails.textMulterFile = result.concat('.xlsx');
  $('#text-ustring').val(orderDetails.textMulterFile);
});

//============================= Removes intial instructions =============================
$('#start-design').click(function() {
  $('#instruct').fadeOut();
  $('#instruct-bg').fadeOut();
});

//============================= Actions when a garment is clicked on =============================
$('.clothing-option').on('mousedown', function() {
  var currentID = $(this).attr('value');
  orderDetails.selectedID = currentID;
  orderDetails.name = $(this)
    .find('h6.name')
    .text();

  $('#selected-span').text(orderDetails.name);
  var colorList = clothingRecords[currentID].colorOptions;

  //change the color options under custom
  $('span.dot').attr('hidden', true);
  $('.dot').removeClass('selected');
  //remove color choice
  orderDetails.colorHex = '';
  orderDetails.colorID = '';
  orderDetails.colorName = '';

  colorList.forEach(e => {
    $('span.dot#' + e).attr('hidden', false);
  });

  //change the logo options under custom
  $('.logo-print-option').remove();
  $('#logo-position-options').val('');
  orderDetails.logoPosition = '';
  for (p in clothingRecords[currentID]['logoPrintOptions']) {
    $('#logo-position-options').append(
      '<option class="logo-print-option" value="' +
        clothingRecords[currentID]['logoPrintOptions'][p] +
        '">' +
        clothingRecords[currentID]['logoPrintOptions'][p] +
        '</option>'
    );
  }

  //change right side img
  $('#live-img').attr(
    'src',
    $(this)
      .find('img.clothing-option')
      .attr('src')
  );

  //move to page 2
  setTimeout(function() {
    $('#2-button').trigger('click');
  }, 500);

  //run estimate price again
  updateEstimate();
});

//============================= Save contact details as they change =============================
$('#quantity').change(function() {
  orderDetails.quantity = $(this).val();
  updateEstimate();
});
$('#full-name').change(function() {
  orderDetails.fullName = $(this).val();
});
$('#email').change(function() {
  orderDetails.email = $(this).val();
});
$('#phone').change(function() {
  orderDetails.phone = $(this).val();
});
$('#org').change(function() {
  orderDetails.org = $(this).val();
});
$('#ratified').change(function() {
  orderDetails.ratified = $(this).val();
  updateEstimate();
});
$('#notes').change(function() {
  orderDetails.notes = $(this).val();
});

//============================= Actions when a color, size, and print type is selected =============================
$('.dot').click(function() {
  $('.dot').removeClass('selected');
  $(this).addClass('selected');
  orderDetails.colorID = $(this).attr('id');
  orderDetails.colorName = $(this).attr('title');
  orderDetails.colorHex = $(this).attr('value');
  //TODO: change image on live preview
});

$('#logo-size').change(function() {
  orderDetails.logoSize = parseInt($(this).val());
  updateEstimate();
});

$('#select-print').click(function() {
  orderDetails.printType = 'Print';
  $(this).css('border', '1px solid #A22C38');
  $('#select-stitch').css('border', '1px solid #B2B2B2');
  updateEstimate();
});

$('#select-stitch').click(function() {
  orderDetails.printType = 'Stitch';
  $(this).css('border', '1px solid #A22C38');
  $('#select-print').css('border', '1px solid #B2B2B2');
  updateEstimate();
});

$('#text-position-options').change(function() {
  orderDetails.textPosition = $(this).val();
  updateEstimate();
});
$('#logo-position-options').change(function() {
  orderDetails.logoPosition = $(this).val();
  updateEstimate();
});

//============================= When logo submitted, upload, add to canvas, and analyze =============================
$('#logo-upload').change(function() {
  if (this.files[0]['type'] != 'image/png') {
    UIkit.modal.alert('That was not a png image');
  } else {
    orderDetails.logoFile = URL.createObjectURL(this.files[0]);
    $('#logo-upload-button').text(this.files[0]['name']);
    logoAnalysis();
  }
});

function logoAnalysis() {
  var context = document.getElementById('logo-canvas').getContext('2d');
  document.getElementById('logo-canvas').height = document.getElementById(
    'logo-canvas'
  ).width;
  var canvasHW = document.getElementById('logo-canvas').width;

  var img = new Image();
  img.onload = function() {
    if (img.height > img.width) {
      tempWidth = canvasHW * (img.width / img.height);
      context.drawImage(
        img,
        (canvasHW - tempWidth) / 2,
        0,
        tempWidth,
        canvasHW
      );
    } else {
      tempHeight = canvasHW * (img.height / img.width);
      context.drawImage(
        img,
        0,
        (canvasHW - tempHeight) / 2,
        canvasHW,
        tempHeight
      );
    }

    var imgData = context.getImageData(0, 0, canvasHW, canvasHW);
    var colorCount = {};
    var i;

    for (i = 0; i < imgData.data.length; i += 4) {
      color = '';
      color = color.concat(
        Math.ceil((imgData.data[i] + 1) / 10) * 10,
        Math.ceil((imgData.data[i + 1] + 1) / 10) * 10,
        Math.ceil((imgData.data[i + 2] + 1) / 25) * 10,
        Math.ceil((imgData.data[i + 3] + 1) / 50) * 10
      );

      if (colorCount[color] >= 0) {
        colorCount[color] += 1;
      } else {
        colorCount[color] = 0;
      }
    }

    for (var x in colorCount) {
      if (colorCount[x] < canvasHW) {
        delete colorCount[x];
      }
    }

    var count = 0;
    for (var x in colorCount) {
      count++;
    }

    if (count > 6) {
      orderDetails.logoColorNum = 6;
      $('#print').text('6+ Colors');
    } else {
      orderDetails.logoColorNum = count - 1;
      $('#print').text(orderDetails.logoColorNum.toString().concat(' Colors'));
    }

    !colorCount['10101010'] ||
      (orderDetails.logoTransparency = (
        1 -
        colorCount['10101010'] / (imgData.data.length / 4)
      ).toFixed(3));
    $('#stitch').text(
      Math.round(orderDetails.logoTransparency * 100)
        .toString()
        .concat('%')
    );
  };

  img.src = orderDetails.logoFile;

  //todo: todataurl on canvas
}

//============================= When excel submitted, upload =============================
$('#text-upload').change(function() {
  orderDetails.textFile = URL.createObjectURL(this.files[0]);
  $('#text-upload-button').text(this.files[0]['name']);
});

//============================= On every mouse click or key click update the estimated price =============================
function updateEstimate() {
  //calc base cost
  if (orderDetails.selectedID && $('#ratified').val() == 'comsoc') {
    basePrice = clothingRecords[orderDetails.selectedID].comPrice || 0;
    margin = margins['COMSOC Margin'];
  } else if (orderDetails.selectedID) {
    basePrice = clothingRecords[orderDetails.selectedID].amsPrice || 0;
    margin = margins['AMS Margin'];
  } else {
    basePrice = 0;
    margin = margins['Other Margin'];
  }

  //calc stitch cost or print cost of logo and setup cost
  if (orderDetails.printType == 'Print') {
    setupCost = printExtraCosts['Setup Charge'];

    textPrice = 0;
    if ($('#text-position-options').val() == 'Back') {
      textPrice = printExtraCosts['Back Name'];
    } else if (
      $('#text-position-options').val() == 'Left' ||
      $('#text-position-options').val() == 'Right'
    ) {
      textPrice = printExtraCosts['Sleeve Print'];
    }

    qPrevious = Object.keys(printCost)[0];
    for (q in printCost) {
      if (parseInt(q) >= orderDetails.quantity) {
        printPrice = printCost[qPrevious][orderDetails.logoColorNum.toString()];
        break;
      }
      qPrevious = q;
    }
  } else if (orderDetails.printType == 'Stitch') {
    stitchCount =
      orderDetails.logoSize * 2 * orderDetails.logoTransparency * 2200;
    orderDetails.logoStitchCount = stitchCount;

    setupCost = (stitchExtraCosts['Digitizing Cost'] * stitchCount) / 1000;

    textPrice = 0;
    if (
      $('#text-position-options').val() == 'Back' ||
      $('#text-position-options').val() == 'Left' ||
      $('#text-position-options').val() == 'Right'
    ) {
      // assume two line text for now
      textPrice = stitchExtraCosts['Two Line Text'];
    }

    qPrevious = Object.keys(stitchCost)[0];
    console.log(qPrevious);
    sPrevious = Object.keys(stitchCost[qPrevious])[0];
    for (q in stitchCost) {
      if (parseInt(q) >= orderDetails.quantity) {
        for (s in stitchCost[qPrevious]) {
          if (parseInt(s) >= stitchCount) {
            printPrice = stitchCost[qPrevious][sPrevious];
          }
          sPrevious = s;
        }
        break;
      }
      qPrevious = q;
    }
  } else {
    printPrice = 0;
    setupCost = 0;
    textPrice = 0;
  }

  //calc additional costs

  //calc
  //estimate price and display
  orderDetails.basePrice = basePrice.toFixed(2);
  orderDetails.printPrice = printPrice.toFixed(2);
  orderDetails.margin = margin;
  orderDetails.setupCost = (setupCost * (1 + margin)).toFixed(2);
  orderDetails.textPrice = (textPrice * (1 + margin)).toFixed(2);

  estimate =
    orderDetails.quantity *
      (basePrice + (textPrice + printPrice) * (1 + margin)) +
    setupCost * (1 + margin);
  orderDetails.totalCost = estimate.toFixed(2);
  !(estimate && $('#estimate').text('$' + estimate.toFixed(2))) &&
    $('#estimate').text('$0.00');
}

//============================= recaptcha to block entry until checked =============================
function recaptchaCallback() {
  $('#start-design').removeAttr('disabled');
  $('#start-design').css('background-color', '#A22C38');
  $('submit-data').removeAttr('disabled');
}
$('#start-design').mouseover(function() {
  $('#start-design').css('background-color', '#A22C38AA');
});
$('#start-design').mouseleave(function() {
  $('#start-design').css('background-color', '#A22C38');
});

//============================= When submit is clicked =============================
$('#submit').click(function() {
  //check if all needed data is
  if (
    !(
      orderDetails.name &&
      orderDetails.colorName &&
      orderDetails.quantity &&
      orderDetails.fullName &&
      orderDetails.email &&
      orderDetails.phone &&
      orderDetails.org &&
      orderDetails.ratified
    )
  ) {
    UIkit.modal.alert(
      'You have not filled out all required fields (denoted by <span class="required-star">*</span>)'
    );
  } else {
    console.log(orderDetails);
    $.post('/email', orderDetails);
    UIkit.modal
      .alert(
        "Your submission has been sent to OTD's sales team and your provided email has been CC'd. They will be in contact with you soon."
      )
      .then(function() {
        window.location.href = 'https://oilthighdesigns.ca/';
      });
  }
});

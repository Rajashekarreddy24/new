"use strict";
window.SaleViewer = window.SaleViewer || {};



var pdf_popup = null;
var sign_popup = null;
var signaturePad = null;
var canvas = null;
var form_name = null;
var share_popup = null;
var res_popup = null;
var a_down = null;

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}

function showResultPDF() {
	var resOptions = {
		width: 820,
		height: 900,
		contentTemplate: function() {
			return $("<div/>").append(
				$("<embed src='http://docs.google.com/gview?embedded=true&url=http://34.124.129.206/static/forms/res/" + form_name + ".pdf&output=embed' width='780px' height='770px' />"),
			);
		},
		showTitle: true,
		title: "Settlement PDF",
		visible: false,
		dragEnabled: false,
		closeOnOutsideClick: true,
		onHidden: function (e) {
			//$("#video_img").attr("src", "");
			
		},
		
	};
	if(res_popup) {
		res_popup.option("contentTemplate", resOptions.contentTemplate.bind(this));
	}
	else {
		res_popup = $("#res_popup").dxPopup(resOptions).dxPopup("instance");
	}	
	res_popup.show();
}

function showSharingOption() {
	var shareOptions = {
		width: 820,
		height: 300,
		contentTemplate: function() {
			return $("<div/>").append(	
				$("<p>Form is ready, click what to do next</p>"),
				
			);
		},
		showTitle: true,
		title: "Sharing Options",
		visible: false,
		dragEnabled: false,
		closeOnOutsideClick: true,
		onHidden: function (e) {
			//$("#video_img").attr("src", "");
			
		},
		toolbarItems: [
		 {
			  widget: 'dxButton',
			  toolbar: 'bottom',
			  location: 'center',
			  options: {
				text: 'Preview Form',
				onClick() {
				  showResultPDF();
				},
			  }
		  },
		  {
			  widget: 'dxButton',
			  toolbar: 'bottom',
			  location: 'center',
			  options: {
				text: 'Download',
				onClick() {
				  //a_down.attr("href", "http://34.124.129.206/static/forms/res/" + form_name + ".pdf");
				  //a_down.prop("href", "/static/forms/res/" + form_name + ".pdf")
				  var a = document.createElement("a");
					a.style = "display: none";
					a.href = "/static/forms/res/" + form_name + ".pdf";
					a.download = "sign.pdf";

					document.body.appendChild(a);
					a.click();
				  //a_down.click();
				},
			  }
		   },
		  {
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'center',
		  options: {
			icon: 'email',
			text: 'Email',
			onClick() {
				
			},
		  },
		}, {
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'center',
		  options: {
			text: 'Share on Whatsapp',
			onClick() {
			  copyTextToClipboard("http://34.124.129.206/static/forms/res/" + form_name + ".pdf");
			},
		  },
		}],
	};
	if(share_popup) {
		share_popup.option("contentTemplate", shareOptions.contentTemplate.bind(this));
	}
	else {
		share_popup = $("#share_popup").dxPopup(shareOptions).dxPopup("instance");
	}	
	share_popup.show();
}

var signOptions = {
		width: '450',
		height: '350',
		contentTemplate: function() {
			return $("<div/>").append(
				$("<p>You'll be suing on all the fields on this from which require your signature:</p>"),
				$("<p>Please sign in the box below </p>"),
				$("<canvas id='sign_pad' width='400' style='touch-action: none;border: 2px solid!important;border-color: black;' height='100'></canvas>"),
			);
		},
		showTitle: true,
		title: "Sign",
		visible: false,
		dragEnabled: false,
		closeOnOutsideClick: true,
		toolbarItems: [{
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'before',
		  options: {
			icon: 'clear',
			text: 'Clear',
			onClick() {
			  signaturePad.clear();
			},
		  },
		}, {
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'after',
		  options: {
			text: 'Done',
			onClick() {
				if (signaturePad.isEmpty()) {
					alert("Please provide a signature first.");
				} else {
					var dataURL = signaturePad.toDataURL();
					var parts = dataURL.split(';base64,');
					$.ajax({
						url: '/bk/SignPDF',
						data: {	'pdf_name': form_name, 'sign_img': parts[1] },
						type: 'POST',
						error: function (result) {
							alert("API has Problem, Try Again!");			
						},
						success: function (result) {
							result = JSON.parse(result);
							//alert("Got sign : " + result.message);
						    showSharingOption();
						}
					});
				}
			},
		  },
		}],
	};

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
  // When zoomed out to less than 100%, for some very strange reason,
  // some browsers report devicePixelRatio as less than 1
  // and only part of the canvas is cleared then.
  var ratio =  Math.max(window.devicePixelRatio || 1, 1);

  // This part causes the canvas to be cleared
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);

  // This library does not listen for canvas changes, so after the canvas is automatically
  // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
  // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
  // that the state of this library is consistent with visual state of the canvas, you
  // have to clear it manually.
  signaturePad.clear();
}



// One could simply use Canvas#toBlob method instead, but it's just to show
// that it can be done using result of SignaturePad#toDataURL.
function dataURLToBlob(dataURL) {
  // Code taken from https://github.com/ebidel/filer.js
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

function showSign()
{
	if(sign_popup) {
		sign_popup.option("contentTemplate", signOptions.contentTemplate.bind(this));
	} else {
		sign_popup = $("#sign_popup").dxPopup(signOptions).dxPopup("instance");
	}	
	sign_popup.show();
	canvas = document.getElementById("sign_pad")
	signaturePad = new SignaturePad(canvas, {
	  // It's Necessary to use an opaque color when saving image as JPEG;
	  // this option can be omitted if only saving as PNG or SVG
	  backgroundColor: 'rgb(255, 255, 255)'
	});
	// On mobile devices it might make more sense to listen to orientation change,
	// rather than window resize events.
	//window.onresize = resizeCanvas;
	//resizeCanvas();
}

function showPDF(pdf_name) {
	var popupOptions = {
		width: 820,
		height: 900,
		contentTemplate: function() {
			return $("<div/>").append(
				//$("<embed src='/static/forms/SMV1407J.pdf' width='400px' height='770px' />"),
				$("<embed src='http://docs.google.com/gview?embedded=true&url=http://34.124.129.206/static/forms/" + pdf_name + ".pdf&output=embed' width='780px' height='770px' />"),
			);
		},
		showTitle: true,
		title: "Settlement PDF",
		visible: false,
		dragEnabled: false,
		closeOnOutsideClick: true,
		onHidden: function (e) {
			//$("#video_img").attr("src", "");
			
		},
		toolbarItems: [{
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'before',
		  options: {
			icon: 'email',
			text: 'Sign',
			onClick() {
				form_name = pdf_name;
			    showSign();
			},
		  },
		}, {
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'after',
		  options: {
			text: 'Close',
			onClick() {
			  pdf_popup.hide();
			},
		  },
		}],
	};
	pdf_popup = $("#pdf_popup").dxPopup(popupOptions).dxPopup("instance");
	pdf_popup.show();
}

$(function () {
	a_down = $('#download');
	const formData = {
	  BankCompany: '',
	  TeleNo: '',
	  FaxNo: '',
	  VehicleNo: '',
	  HPNo:'',
	  ToCompany: '',
	  Name: '',
	  NRICNo:'',
	  MobileNo: ''
	};
	
		
   var formWidget = $('#form').dxForm({
    formData,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,
    items: [{
      itemType: 'group',
      caption: 'Personal Details',
      items: [{
			dataField: 'Name',
				label: {
				  text: 'Name',
				},
				validationRules: [{
				  type: 'required',
				  message: 'Name is required',
				},
				{
				  type: 'pattern',
				  pattern: '^[^0-9]+$',
				  message: 'Do not use digits in the Name',
				}],
			 }, {
			dataField: 'NRICNo',
				label: {
				  text: 'NRIC No',
				},
				validationRules: [{
				  type: 'required',
				  message: 'NRIC is required',
				}],
			  },{
			dataField: 'MobileNo',
				label: {
				  text: 'Mobile No',
				},
				editorOptions: {
				  mask: '0000-0000',
				  maskInvalidMessage: 'The phone must have a correct SG format',
				},
				
			  },
			],
	  }, 
	  {
		  itemType: 'group',
		  caption: 'Company Info',
		  items: [{
			dataField: 'BankCompany',
				label: {
				  text: 'Name of Bank/Finance Company',
				},
				validationRules: [{
				  type: 'required',
				  message: 'Name is required',
				}],
			 },
			 {
				dataField: 'TeleNo',
				label: {
				  text: 'Telephone No',
				},
				editorOptions: {
				  mask: '0000-0000',
				  maskInvalidMessage: 'The phone must have a correct SG format',
				},				 
			 },
			 {
				dataField: 'FaxNo',
				label: {
				  text: 'Fax No',
				},
				validationRules: [{
				  type: 'pattern',
				  pattern: /[0-9]/,
				  message: 'The phone must have a correct phone format',
				}],			 
			 }
			]
	  },
	  {
		  itemType: 'group',
		  caption: 'Others',
		  items: [{
			dataField: 'VehicleNo',
				label: {
				  text: 'Vehicle Registration No',
				},
				validationRules: [{
				  type: 'required',
				  message: 'Vehicle No is required',
				}],
			 },
			 {
				dataField: 'HPNo',
				label: {
				  text: 'HP Agreement No',
				},
				validationRules: [{
				  type: 'required',
				  message: 'Vehicle No is required',
				}],				 
			 },
			 {
				dataField: 'ToCompany',
				label: {
				  text: 'To Company',
				},
				validationRules: [{
				  type: 'required',
				  message: 'Vehicle No is required',
				}],
				 
			 }
			]
	  }
	  ,
	  {
		  itemType: 'button',
		  horizontalAlignment: 'center',
		  buttonOptions: {
			text: 'Next',
			type: 'success',
			onClick() {
				let ss = formWidget.option('formData').VehicleNo;
				$.ajax({
					url: '/bk/GetPDF',
					data: {'BankCompany': formWidget.option('formData').BankCompany, 
								'TeleNo' : formWidget.option('formData').TeleNo,
								'FaxNo' : formWidget.option('formData').FaxNo,
								'VehicleNo': formWidget.option('formData').VehicleNo,
								'HPNo':formWidget.option('formData').HPNo,
								'ToCompany': formWidget.option('formData').ToCompany,
								'Name': formWidget.option('formData').Name,
								'NRICNo':formWidget.option('formData').NRICNo,
								'MobileNo': formWidget.option('formData').MobileNo},
					type: 'POST',
					error: function (result) {
						alert("API has Problem, Try Again!");			
					},
					success: function (result) {
						result = JSON.parse(result);
						
						showPDF(result.message);				
					}
				});
				
			},
		  },
    }],
  }).dxForm('instance');
});


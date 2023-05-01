"use strict";


function isRealValue(obj)
{
	return obj && obj !== 'null' && obj !== 'undefined';
}

var selRouterIP = '';

var res_popup = null;
function show_result(json) {
	var popupOptions = {
		width: 960,
		height: 600,
		contentTemplate: function() {
			return $("<div/>").append(
				//$("<embed src='/static/forms/SMV1407J.pdf' width='400px' height='770px' />"),
				$('<pre style="overflow-y: auto;height: 463px;">').text(json),				
			);
		},
		showTitle: true,
		title: "Result",
		visible: false,
		dragEnabled: false,
		closeOnOutsideClick: true,
		toolbarItems: [ {
		  widget: 'dxButton',
		  toolbar: 'bottom',
		  location: 'after',
		  options: {
			text: 'Close',
			onClick() {
			  res_popup.hide();
			},
		  },
		}],
	};
	res_popup = $("#res_popup").dxPopup(popupOptions).dxPopup("instance");
	res_popup.show();
}

function showSearchForm() {
	const formData = {
		ipAddress: '',
		macAddress: '',
		startDate : '',
		endDate: '',
	  };	  
  
		  
	 var formWidget = $('#searchForm').dxForm({
	  formData:formData,
	  readOnly: false,
	  showColonAfterLabel: true,
	  showValidationSummary: true,    
	  items: [
		{
		  dataField: 'ipAddress',
		  label: {
			text: 'Search IP address',
		  }		    
		},
		{
			itemType: 'button',
			horizontalAlignment: 'center',
			buttonOptions: {
			text: 'Submit',
			type: 'success',
			onClick() {
				var res = formWidget;
				$.ajax({
					url: '/bk/searchIP',
					data: {'ipAddress': formWidget.option('formData').ipAddress, 'routerIP': selRouterIP},
					type: 'POST',
					error: function (result) {
						alert("API has Problem, Try Again!");			
					},
					success: function (result) {					
						result = JSON.parse(result);
						//if (isRealValue(result.result))
						{
							show_result(JSON.stringify(result, undefined, 2));
						}
						
					}
				});
				},
			},
	  	},
		  {
			dataField: 'macAddress',
			label: {
			  text: 'Search MAC address',
			}		    
		  },
		  {
			  itemType: 'button',
			  horizontalAlignment: 'center',
			  buttonOptions: {
			  text: 'Submit',
			  type: 'success',
			  onClick() {
				  var res = formWidget;
				  $.ajax({
					  url: '/bk/searchMAC',
					  data: {'macAddress': formWidget.option('formData').macAddress, 'routerIP': selRouterIP},
					  type: 'POST',
					  error: function (result) {
						  alert("API has Problem, Try Again!");			
					  },
					  success: function (result) {					
						  result = JSON.parse(result);
						  //if (isRealValue(result.result))
						  {
							  show_result(result);
						  }
						  
					  }
				  });
				  },
			  },
		},
		{
			dataField: 'startDate',
			label: {
			  text: 'Start Date:',
			}		    
		  },
		  {
			dataField: 'endDate',
			label: {
			  text: 'End Date:',
			}		    
		  },
		  {
			  itemType: 'button',
			  horizontalAlignment: 'center',
			  buttonOptions: {
			  text: 'Search Date Range, Format YYYY-MM-DD',
			  type: 'success',
			  onClick() {
				  var res = formWidget;
				  $.ajax({
					  url: '/bk/searchDateRange',
					  data: {'startDate': formWidget.option('formData').startDate, 'endDate': formWidget.option('formData').endDate, 'routerIP': selRouterIP},
					  type: 'POST',
					  error: function (result) {
						  alert("API has Problem, Try Again!");			
					  },
					  success: function (result) {					
						  result = JSON.parse(result);
						  //if (isRealValue(result.result))
						  {
							  show_result(result);
						  }
						  
					  }
				  });
				  },
			  },
		},
			{
				  itemType: 'button',
				  horizontalAlignment: 'center',
				  buttonOptions: {
				  text: 'Search duplicate IP/MAC address',
				  type: 'success',
				  onClick() {
					  var res = formWidget;
					  $.ajax({
						  url: '/bk/searchDuplicate',
						  data: {'routerIP': selRouterIP},
						  type: 'POST',
						  error: function (result) {
							  alert("API has Problem, Try Again!");			
						  },
						  success: function (result) {					
							  result = JSON.parse(result);
							  //if (isRealValue(result.result))
							  {
								  show_result(result);
							  }
							  
						  }
					  });
					  },
				  },
			},
			{
				itemType: 'button',
				horizontalAlignment: 'center',
				buttonOptions: {
				text: 'Cleanup database (> 180 days)',
				type: 'success',
				onClick() {
					var res = formWidget;
					$.ajax({
						url: '/bk/cleanUp',
						data: {'routerIP': selRouterIP},
						type: 'POST',
						error: function (result) {
							alert("API has Problem, Try Again!");			
						},
						success: function (result) {					
							result = JSON.parse(result);
							//if (isRealValue(result.result))
							{
								show_result(result);
							}
							
						}
					});
					},
				},
		  }

	],
	}).dxForm('instance');
}

$(function () {
	const formData = {
	  RouterIP: '10.9.10.74',	  
	};
	const RouterIPList = [{ ID: '10.9.10.74', Name:'Huawei Router AR161F'},
		{ID:'10.9.10.74', Name:'Techroute'},
		{ ID: '10.9.10.74', Name:'router'}];

		
   var formWidget = $('#form').dxForm({
    formData:formData,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,    
    items: [{
        dataField: 'RouterIP',
		label: {
          text: 'Router IP',
        },
		editorType: 'dxSelectBox',
        editorOptions: {
          dataSource: RouterIPList,
		  displayExpr: 'Name',
		   valueExpr: 'ID',
		   value: '10.9.10.74',
		   onValueChanged(e) {
			
		  },
        },        
      },
	  {
      itemType: 'button',
      horizontalAlignment: 'center',
      buttonOptions: {
        text: 'Submit',
        type: 'success',
        onClick() {
			
			selRouterIP = formWidget.option('formData').RouterIP;
			$.ajax({
				url: '/bk/updateDB',
				data: {'routerIP': formWidget.option('formData').RouterIP},
				type: 'POST',
				error: function (result) {
					alert("API has Problem, Try Again!");			
					//showSearchForm();
				},
				success: function (result) {	
					showSearchForm();				
					result = JSON.parse(result);
					//if (isRealValue(result.result))
					{
						//show_result(result.message, result.result);
					}
					
				}
			});
		  },
      },
    }],
  }).dxForm('instance');
 
});

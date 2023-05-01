"use strict";
window.SaleViewer = window.SaleViewer || {};

var mode = 0;

const now = new Date();
var send_time = now.toISOString();
var files = null;

$(function () {
	
	$('.box').dxBox({
		direction : 'row',
		width : '100%',
		height : 72,
	});
	$('#box1').dxBox({
		direction : 'row',
		width : '100%',
		height : 250,
	});
	const input_msg = $('#input_msg').dxTextArea({
		value: '',
		placeholder: 'Input Message Here',
		height: 200,
	  }).dxTextArea('instance');

	$('#send_time').dxDateBox({
		type: 'datetime',
		width: 200,
		value: now,
		onValueChanged(data) {
			var dat = new Date(data.value);
			//send_time = dat.format("yyyy-MM-dd hh:mm TT");
			send_time = dat.toISOString();
		},
	});
	const modes = [
		{ id: 0, text: 'Send Now' },
		{ id: 1, text: 'Send In Future' },

	  ];
	const sel_group = $('#sel_mode').dxRadioGroup({
		items: modes,
		valueExpr: 'id',
		displayExpr: 'text',
		layout: 'horizontal',
		onValueChanged(e) {
			
		   	mode = e.value;
			
		},
	  }).dxRadioGroup('instance');
	  sel_group.option('value', modes[0].id);

	  $('#icon-send').dxButton({
		icon: 'fa fa-envelope-o',
		type: 'success',
		text: 'Send',
		onClick() {
			var img_path = '';
			if(files != null)
			{
				if(files.length > 0) img_path = files[0].name;
			}
			$.ajax({
				url: "/bk/SendMsg",
				type: "POST",
				data:  { 'msg_content': input_msg._changedValue, 'mode': mode, 'send_time': send_time, 'img_path': img_path },
				error: function (result) {
					alert("There is a Problem, Try Again!");
				},
				success: function (result) {
					var data = JSON.parse(result);
					if(data['statusCode'] == '400'){
						alert("Send message failed, Try Again!");
						location.reload();
					}
				}
			});
		},
	  });
	  $('#icon-history').dxButton({
		icon: 'fa fa-history',
		type: 'success',
		text: 'History',
		onClick() {
			window.location.href = '/WhatsappHitory';
		},
	  });

	  $('#icon-attach').dxButton({
		icon: 'upload',
		type: 'default',
		text: 'Attach Photo',
		onClick() {
		 
		},
	  });
	  const fileUploader = $('#icon-attach').dxFileUploader({
		selectButtonText: 'Attach photo',
		labelText: '',
		multiple: false,
		accept: 'image/*',
		value: [],
		uploadMode: 'instantly',
		uploadUrl: '/uploader',
		onValueChanged(e) {
		  files = e.value;
		 
		},
	  }).dxFileUploader('instance');
	
	  $('#icon-addtemple').dxButton({
		icon: 'plus',
		type: 'default',
		text: 'Add to Temple',
		onClick() {
		 
		},
	  });
	  $('#icon-savedtemple').dxButton({
		icon: 'save',
		type: 'default',
		text: 'Saved Temple',
		onClick() {
		 
		},
	  });

	  	var gridOptions = {
			keyExpr: "id",
			editing: {
				mode: "popup",
				allowAdding: true,
				allowUpdating: true,
				allowDeleting: true,
				popup: {
					title: "Contact Info",
					showTitle: true,
					width: 470,
					height: 255,
				},
				useIcons: true
			},
			dataSource: {
				store: []
			},
			paging: {
				pageSize: 5
			},
			selection: {
				mode: "single"
			},
			filterRow: {
				visible: true
			},
			columns: [
				{
					dataField: "name",
					alignment: "center",
				},
				{
					dataField: "mobile_num",
					alignment: "center",

				},
				{
					dataField: "dealer_name",
					alignment: "center",
				}
			],
			showBorders: true,
			columnAutoWidth:false,
			showColumnLines: true,
			showRowLines: false,
			width:500,
			repaintChangesOnly: true,
			summary: {
				totalItems: [{
					column: "name",
					summaryType: "count",
					displayFormat: 'Total Contacts: {0}',
				}]
			},
			onRowInserting: function(e) {
				var newData = e.data;
				var empty = false;
				if (Object.keys(e.data).length == 4){
					for (var key in newData){
						if (key == 'name'){
							if (newData[key].trim() == ''){
								empty = true;
								break;
							}
						}
					}
				}
				else{
					empty = true;
				}
				if (!empty){
					$.ajax({
						url: "/bk/Contacts",
						type: "POST",
						data: newData,
						error: function (result) {
							alert("There is a Problem, Try Again!");
						},
						success: function (result) {
							var data = JSON.parse(result);
							if(data['statusCode'] == '400'){
								if(data['message'] == 'user_name'){
									alert("The name is duplicated with other, Try Again!");
								}
								else{
									alert("The email is duplicated with other, Try Again!");
								}
								location.reload();
							}
						}
					});
				}
				else{
					alert('Some item is empty!');
				}
				e.cancel = empty;
			},
			onRowInserted: function(e) {
				//console.log("RowInserted");
			},
			onRowUpdating: function(e) {
				var newData = e.newData;
				var fullData = e.key;
				var empty = false;
				for (var key in newData){
						if (key == 'name'){
							if (newData[key].trim() == ''){
								empty = true;
								break;
							}
						}
					fullData[key] = newData[key];
				}
				if (!empty){
					$.ajax({
						url: "/bk/Contacts",
						type: "PUT",
						data: fullData,
						error: function (result) {
							alert("There is a Problem, Try Again!");
						},
						success: function (result) {
							var data = JSON.parse(result);
							if(data['statusCode'] == '400'){
								if(data['message'] == 'user_name'){
									alert("The name is duplicated with other, Try Again!");
								}
								else{
									alert("The email is duplicated with other, Try Again!");
								}
								location.reload();
							}
						}
					});
				}
				e.cancel = empty;
			},
			onRowUpdated: function(e) {
				//console.log("RowUpdated");
			},
			onRowRemoving: function(e) {
				$.ajax({
					url: "/bk/Contacts",
					type: "DELETE",
					data: e.data,
					error: function (result) {
						alert("There is a Problem, Try Again!");
						e.cancel = true;
					},
					success: function (result) {
					}
				});
			},
			onRowRemoved: function(e) {
				console.log("RowRemoved");
			},
			onSaving: function(e) {
				console.log("Saving");
			},
		};
		var gridContainer = $("#contacts");
        gridContainer.dxDataGrid(gridOptions);
        var grid = gridContainer.data("dxDataGrid");
		var loadOptions = {};

		$.ajax({
			url: '/bk/Contacts',
			data: loadOptions,
			error: function (result) {
				grid.endCustomLoading();
				alert("There is a Problem, Try Again!");			
			},
			success: function (result) {
				grid.option("dataSource", { store: JSON.parse(result)});
				grid.endCustomLoading();
			}
		});	
});


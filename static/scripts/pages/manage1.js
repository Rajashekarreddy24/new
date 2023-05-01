"use strict";
window.SaleViewer = window.SaleViewer || {};

$(function () {
	var gridOptions = {
			editing: {
				mode: "popup",
				allowAdding: true,
				allowUpdating: true,
				allowDeleting: true,
				popup: {
					title: "Car Portal Rule",
					showTitle: true,
					width: 500,
					height: 355,
				},
				useIcons: true
			},
            dataSource: {
                store: []
            },
            paging: {
                pageSize: 10
            },
            selection: {
                mode: "single"
            },
			filterRow: {
                visible: true
            },
			headerFilter: {
				visible: true
			},
			export: {
				enabled: true,
				//allowExportSelectedData: true,
			  },
			summary: {
				totalItems: [{
					column: "key",
					summaryType: "count",
				}]
			},
            columns: [
                {
                    dataField: "id",
					alignment: "left",
					allowEditing: false,
                },
                {
                    dataField: "key",
                    caption: "Rule Words",
					validationRules: [{
						type: "required",
						message: "This field is required"
					}]
                },
				{
                    dataField: "value",
                    caption: "Search Words",
					validationRules: [{
						type: "required",
						message: "This field is required"
					}]
                },
			],
			width:500,
			columnAutoWidth:true,
			repaintChangesOnly: true,
			onRowInserting: function(e) {
				var newData = e.data;
				$.ajax({
					url: "/bk/AddPortalRule",
					type: "POST",
					data: newData,
					error: function (result) {
						alert("There is a Problem, Try Again!");
					},
					success: function (result) {
						var data = JSON.parse(result);
						if(data['statusCode'] == '400'){
							if(data['message'] == 'name'){
								alert("The name is duplicated with other, Try Again!");
							}
						}
						else
						{
							$.ajax({
								url: "http://149.28.158.23/bk/AddPortalRule",
								type: "POST",
								data: newData,
								error: function (result) {
									alert("There is a Problem in Retal Server");
									location.reload();
								},
								success: function (result) {
									location.reload();
								}
							});
						}
						
					}
				});
				
			},
			onRowUpdating: function(e) {
				var newData = e.newData;
				var fullData = e.key;
				var empty = false;
				for (var key in newData){
					if (newData[key].trim() == ''){
						empty = true;
						alert('Some item is empty!');
						break;
					}
					fullData[key] = newData[key];
				}
				if (!empty){
					$.ajax({
						url: "/bk/UpdatePortalRule",
						type: "PUT",
						data: fullData,
						error: function (result) {
							alert("There is a Problem, Try Again!");
						},
						success: function (result) {
							var data = JSON.parse(result);
							if(data['statusCode'] == '400'){
								if(data['message'] == 'name'){
									alert("The name is duplicated with other, Try Again!");
								}
								
							}
							$.ajax({
								url: "http://149.28.158.23/bk/UpdatePortalRule",
								type: "PUT",
								data: fullData,
								error: function (result) {
									alert("There is a Problem in Retal Server");
								},
								success: function (result) {
									
								}
							});
						}
					});
					
				}
				e.cancel = empty;
			},
			onRowRemoving: function(e) {
				$.ajax({
					url: "/bk/RemovePortalRole",
					type: "DELETE",
					data: e.data,
					error: function (result) {
						alert("There is a Problem, Try Again!");
						e.cancel = true;
					},
					success: function (result) {
						$.ajax({
							url: "http://149.28.158.23/bk/RemovePortalRole",
							type: "DELETE",
							data: e.data,
							error: function (result) {
								alert("There is a Problem in Retal Server");
								e.cancel = true;
							},
							success: function (result) {
							}
						});
					}
				});
				
			},
			onExporting(e) {
				const workbook = new ExcelJS.Workbook();
				const worksheet = workbook.addWorksheet('CarPortal');
		  
				DevExpress.excelExporter.exportDataGrid({
				  component: e.component,
				  worksheet,
				  autoFilterEnabled: true,
				}).then(() => {
				  workbook.xlsx.writeBuffer().then((buffer) => {
					saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'car_portal.xlsx');
				  });
				});
				e.cancel = true;
			},
        };
			
		var gridContainer = $("#grid");
        gridContainer.dxDataGrid(gridOptions);
        var grid = gridContainer.data("dxDataGrid");
		var loadOptions = {};       
		grid.beginCustomLoading();
		
		$.ajax({
			url: '/bk/GetOverPortalRole',
			data: loadOptions,
			error: function (result) {
				grid.endCustomLoading();
				alert("There is a Problem, Try Again!");			
			},
			success: function (result) {
				var res = JSON.parse(result);
				grid.option("dataSource", { store: res});
				grid.endCustomLoading();
			}
		});	
 
});


"use strict";
window.SaleViewer = window.SaleViewer || {};

$(function () {
	var gridOptions = {
			
            dataSource: {
                store: []
            },
			grouping: {
				autoExpandAll: false,
			},
			searchPanel: {
				visible: true,
			},
            paging: {
                pageSize: 20
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
			sortByGroupSummaryInfo: [{
				summaryItem: 'count',
			}],
            columns: [
                {
                    dataField: "created_time",
                    caption: "Date Time",
					dataType: 'datetime',
					groupIndex: 0,
                },
				{
                    dataField: "created_time",
                    caption: "Date Time",
					dataType: 'datetime',
                },					
				{
                    dataField: "contact_name",
                    caption: "Name",			
                },
				{
                    dataField: "mobile_num",
                    caption: "Mobile Number",			
                },
				{
                    dataField: "dealer_name",
                    caption: "Dealer Name",			
                },
				{
                    dataField: "msg",
                    caption: "Message Content",			
                },
			],
			summary: {
				groupItems: [{
				  column: 'created_time',
				  summaryType: 'count',
				  displayFormat: '{0} Messages',
				},]
			},
			columnAutoWidth:true,
			repaintChangesOnly: true,			
			onRowRemoving: function(e) {
				$.ajax({
					url: "/bk/RemoveMsgLog",
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
        };
			
		var gridContainer = $("#grid");
        gridContainer.dxDataGrid(gridOptions);
        var grid = gridContainer.data("dxDataGrid");
		var loadOptions = {};       
		grid.beginCustomLoading();
		
		$.ajax({
			url: '/bk/GetMessageLog',
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


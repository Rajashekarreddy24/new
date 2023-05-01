"use strict";

$(function () {
   var purpose_of_visit = $("#purpose_of_visit").dxPieChart({
        palette: "bright",
        dataSource: [],
        title: "Purpose of Visit",
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 4
        },
        "export": {
            enabled: true
        },
        margin: {
            bottom: 20,
        },
        series: [{
            argumentField: "type",
            valueField: "count",
            label: {
                visible: true,
                font: {
                    size: 16
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "columns",
                customizeText: function (arg) {
                    return arg.valueText + " (" + arg.percentText + ")";
                }
            }
        }]
    }).dxPieChart("instance");

    var hourly_visit_traffic = $("#hourly_visit_traffic").dxChart({
        palette: "violet",
        dataSource: [],
        commonSeriesSettings: {
            type: "bar",
            argumentField: "hour"
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        margin: {
            bottom: 20,
			left: 20,
			right: 20,
        },
        series: [],
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: "Hourly Visitor Traffic"
    }).dxChart("instance");

   var anpr_scan = $("#anpr_scan").dxPieChart({
        palette: "bright",
        dataSource: [],
        title: "ANPR scan",
        legend: {
            orientation: "horizontal",
            itemTextPosition: "right",
            horizontalAlignment: "center",
            verticalAlignment: "bottom",
            columnCount: 4
        },
        "export": {
            enabled: true
        },
        margin: {
            bottom: 20,
        },
        series: [{
            argumentField: "type",
            valueField: "count",
            label: {
                visible: true,
                font: {
                    size: 16
                },
                connector: {
                    visible: true,
                    width: 0.5
                },
                position: "columns",
                customizeText: function (arg) {
                    return arg.valueText + " (" + arg.percentText + ")";
                }
            }
        }]
    }).dxPieChart("instance");

    var hourly_vehicle_traffic = $("#hourly_vehicle_traffic").dxChart({
        palette: "violet",
        dataSource: [],
        commonSeriesSettings: {
            type: "spline",
            argumentField: "hour"
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        margin: {
            bottom: 20,
			left: 20,
			right: 20,
        },
        series: [],
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        argumentAxis: {
			valueMarginsEnabled: false,
			discreteAxisDivisionMode: "crossLabels",
			grid: {
				visible: true
			}
        },
        title: "Traffic"
    }).dxChart("instance");

    var weekly_traffic = $("#weekly_traffic").dxChart({
        palette: "violet",
        dataSource: [],
        commonSeriesSettings: {
            type: "bar",
            argumentField: "week"
        },
        customizeLabel: function () {
            if (this.value > 0) {
				return {
					visible: true,
					color: "#ffffff",
					customizeText: function () {
						return this.valueText;
					}
				};
			}
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        margin: {
            bottom: 20,
			left: 20,
			right: 20,
        },
        series: {'valueField': 'Count', 'name': 'Count', color: 'red'},
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
		rotated: true,
        title: "Weekly Traffic"
    }).dxChart("instance");

    var monthly_traffic = $("#monthly_traffic").dxChart({
        palette: "violet",
        dataSource: [],
        commonSeriesSettings: {
            type: "bar",
            argumentField: "month"
        },
        customizeLabel: function () {
            if (this.value > 0) {
				return {
					visible: true,
					color: "#ffffff",
					customizeText: function () {
						return this.valueText;
					}
				};
			}
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        margin: {
            bottom: 20,
			left: 20,
			right: 20,
        },
        series: {'valueField': 'Count', 'name': 'Count', color: 'blue'},
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: "Monthly Traffic"
    }).dxChart("instance");

    var visitors_by_day = $("#visitors_by_day").dxChart({
        palette: "violet",
        dataSource: [],
        commonSeriesSettings: {
            type: "bar",
            argumentField: "day"
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        margin: {
            bottom: 20,
			left: 20,
			right: 20,
        },
        series: {'valueField': 'Count', 'name': 'Count', color: 'red'},
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        title: "Visitors By Day"
    }).dxChart("instance");

    var past_7_days_visitors = $("#past_7_days_visitors").dxChart({
        palette: "violet",
        dataSource: [],
        commonSeriesSettings: {
            type: "spline",
            argumentField: "date"
        },
        commonAxisSettings: {
            grid: {
                visible: true
            }
        },
        customizeLabel: function () {
            if (this.value > 0) {
				return {
					visible: true,
					color: "#ffffff",
					customizeText: function () {
						return this.valueText;
					}
				};
			}
        },
        margin: {
            bottom: 20,
			left: 20,
			right: 20,
        },
        series: {'valueField': 'Count', 'name': 'Count', color: 'blue'},
        tooltip:{
            enabled: true
        },
        legend: {
            verticalAlignment: "top",
            horizontalAlignment: "center"
        },
        "export": {
            enabled: true
        },
        argumentAxis: {
			valueMarginsEnabled: false,
			discreteAxisDivisionMode: "crossLabels",
			grid: {
				visible: true
			}
        },
        title: "Past 7 Days Visitors"
    }).dxChart("instance");

	$.ajax({
		url: '/bk/Dashboard/statistics/Today',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result)
			document.getElementById("visitor_num").textContent = result["visitor_num"];
			document.getElementById("lpr_log_num").textContent = result["lpr_log_num"];
		}
	});

	$.ajax({
		url: '/bk/Dashboard/statistics/Visitor/total',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			purpose_of_visit.beginUpdate();
			purpose_of_visit.option("dataSource", result);
			purpose_of_visit.endUpdate();
		}
	});
	$.ajax({
		url: '/bk/Dashboard/statistics/Visitor/hourly',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			hourly_visit_traffic.beginUpdate();
			hourly_visit_traffic.option("dataSource", result['results']);
			hourly_visit_traffic.option("series", result['series']);
			hourly_visit_traffic.endUpdate();
		}
	});

	$.ajax({
		url: '/bk/Dashboard/statistics/Vehicle/total',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			anpr_scan.beginUpdate();
			anpr_scan.option("dataSource", result);
			anpr_scan.endUpdate();
		}
	});
	$.ajax({
		url: '/bk/Dashboard/statistics/Vehicle/hourly',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			hourly_vehicle_traffic.beginUpdate();
			hourly_vehicle_traffic.option("dataSource", result['results']);
			hourly_vehicle_traffic.option("series", result['series']);
			hourly_vehicle_traffic.endUpdate();
		}
	});

	$.ajax({
		url: '/bk/Dashboard/statistics/Vehicle/weekly',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			weekly_traffic.beginUpdate();
			weekly_traffic.option("dataSource", result);
			weekly_traffic.endUpdate();
		}
	});
	$.ajax({
		url: '/bk/Dashboard/statistics/Vehicle/monthly',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			monthly_traffic.beginUpdate();
			monthly_traffic.option("dataSource", result);
			monthly_traffic.endUpdate();
		}
	});

	$.ajax({
		url: '/bk/Dashboard/statistics/Visitor/weekday',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			visitors_by_day.beginUpdate();
			visitors_by_day.option("dataSource", result);
			visitors_by_day.endUpdate();
		}
	});
	$.ajax({
		url: '/bk/Dashboard/statistics/Visitor/last_7_days',
		error: function (result) {
			alert("There is a Problem, Try Again!");			
		},
		success: function (result) {
			result = JSON.parse(result);
			past_7_days_visitors.beginUpdate();
			past_7_days_visitors.option("dataSource", result);
			past_7_days_visitors.endUpdate();
		}
	});

});

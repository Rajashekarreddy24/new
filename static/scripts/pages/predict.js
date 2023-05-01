"use strict";

const countryList = [{ID: 'AFG', Name: 'Afghanistan'},	
	{ID: 'ALB', Name: 'Albania'},										
	{ID: 'DZA', Name: 'Algeria'},
	{ID: 'ASM', Name: 'American Samoa'},
	{ID: 'AND', Name: 'Andorra'},
	{ID: 'AGO', Name: 'Angola'},
	{ID: 'AIA', Name: 'Anguilla'},
	{ID: 'ATG', Name: 'Antigua and Barbuda'},
	{ID: 'ARG', Name: 'Argentina'},					
	{ID: 'ARM', Name: 'Armenia'},
	{ID: 'ABW', Name: 'Aruba'},
	{ID: 'AUS', Name: 'Australia'},
	{ID: 'AUT', Name: 'Austria'},
	{ID: 'AZE', Name: 'Azerbaijan'},
	{ID: 'BHS', Name: 'Bahamas'},
	{ID: 'BHR', Name: 'Bahrain'},
	{ID: 'BGD', Name: 'Bangladesh'},
	{ID: 'BRB', Name: 'Barbados'},
	{ID: 'BLR', Name: 'Belarus'},
	{ID: 'BEL', Name: 'Belgium'},
	{ID: 'BLZ', Name: 'Belize'},
	{ID: 'BEN', Name: 'Benin'},
	{ID: 'BMU', Name: 'Bermuda'},
	{ID: 'BTN', Name: 'Bhutan'},
	{ID: 'BOL', Name: 'Bolivia'},
	{ID: 'BIH', Name: 'Bosnia and Herzegovina'},
	{ID: 'BWA', Name: 'Botswana'},
	{ID: 'BRA', Name: 'Brazil'},
	{ID: 'BRN', Name: 'Brunei Darussalam'},
	{ID: 'BGR', Name: 'Bulgaria'},
	{ID: 'BFA', Name: 'Burkina Faso'},
	{ID: 'BDI', Name: 'Burundi'},
	{ID: 'KHM', Name: 'Cambodia'},
	{ID: 'CMR', Name: 'Cameroon'},
	{ID: 'CAN', Name: 'Canada'},
	{ID: 'CPV', Name: 'Cape Verde'},

	{ID: 'CHN', Name: 'China'},

	{ID: 'DNK', Name: 'Denmark'},

	{ID: 'DEU', Name: 'Germany'},

	{ID: 'ISL', Name: 'Iceland'},
	{ID: 'IND', Name: 'India'},
	{ID: 'IDN', Name: 'Indonesia'},
	{ID: 'IRN', Name: 'Iran, Islamic Republic of'},
	{ID: 'IRQ', Name: 'Iraq'},
	{ID: 'IRL', Name: 'Ireland'},
	{ID: 'ISR', Name: 'Israel'},
	{ID: 'ITA', Name: 'Italy'},

	{ID: 'JPN', Name: 'Japan'},

	{ID: 'PHL', Name: 'Philippines'},

	{ID: 'REU', Name: 'Reunion'},
	{ID: 'ROU', Name: 'Romania'},
	{ID: 'RUS', Name: 'Russian Federation'},


	{ID: 'ESP', Name: 'Spain'},
	{ID: 'LKA', Name: 'Sri Lanka'},
	{ID: 'SDN', Name: 'Sudan'},
	{ID: 'SUR', Name: 'Suriname'},
	{ID: 'SJM', Name: 'Svalbard and Jan Mayen Islands'},
	{ID: 'SWZ', Name: 'Swaziland'},
	{ID: 'SWE', Name: 'Sweden'},
	{ID: 'CHE', Name: 'Switzerland'},
	{ID: 'SYR', Name: 'Syrian Arab Republic'},
	{ID: 'TWN', Name: 'Taiwan'},
	{ID: 'TJK', Name: 'Tajikistan'},
	{ID: 'TZA', Name: 'Tanzania, United Republic of'},
	{ID: 'THA', Name: 'Thailand'},
	{ID: 'TLS', Name: 'Timor-Leste'},
	{ID: 'TGO', Name: 'Togo'},
	{ID: 'TKL', Name: 'Tokelau'},
	{ID: 'TON', Name: 'Tonga'},
	{ID: 'TTO', Name: 'Trinidad and Tobago'},
	{ID: 'TUN', Name: 'Tunisia'},
	{ID: 'TUR', Name: 'Turkey'},
	{ID: 'TKM', Name: 'Turkmenistan'},
	{ID: 'TCA', Name: 'Turks and Caicos Islands'},
	{ID: 'TUV', Name: 'Tuvalu'},
	{ID: 'UGA', Name: 'Uganda'},
	{ID: 'UKR', Name: 'Ukraine'},
	{ID: 'ARE', Name: 'United Arab Emirates'},
	{ID: 'GBR', Name: 'United Kingdom'},
	{ID: 'USA', Name: 'United States of America'},
	{ID: 'URY', Name: 'Uruguay'},
	{ID: 'UZB', Name: 'Uzbekistan'},
	{ID: 'VUT', Name: 'Vanuatu'},
	{ID: 'VAT', Name: 'Vatican City State (Holy See)'},
	{ID: 'VEN', Name: 'Venezuela'},
	{ID: 'VNM', Name: 'Viet Nam'},
	{ID: 'VGB', Name: 'Virgin Islands (British)'},
	{ID: 'VIR', Name: 'Virgin Islands (U.S.)'},
	{ID: 'WLF', Name: 'Wallis and Futuna Islands'},
	{ID: 'ESH', Name: 'Western Sahara'},
	{ID: 'YEM', Name: 'Yemen'},
	{ID: 'ZMB', Name: 'Zambia'},
	{ID: 'ZWE', Name: 'Zimbabwe'},
]
function isRealValue(obj)
{
	return obj && obj !== 'null' && obj !== 'undefined';
}

var sel_country = "SGD";

var res_popup = null;
function show_result(message, jpg_path) {
	var popupOptions = {
		width: 600,
		height: 480,
		contentTemplate: function() {
			return $("<div/>").append(
				//$("<embed src='/static/forms/SMV1407J.pdf' width='400px' height='770px' />"),
				$("<p>" + message + "</p>"),
				$("<a href='" + jpg_path + "'>Download Logcard</a>"),
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


$(function () {
	const formData = {
	  VehicleNo: '',
	  OwnerIDType: '1',
	  OwnerID: '',
	  Country: '',
	  DeregistrationDate: null,
	  Accepted: false,
	};
	const OwnerIDTypeList = [{ ID: '1', Name:'Singapore NRIC (e.g. S1234567D)'}, {ID: '2', Name:'Malaysia NRIC (e.g. 200312345678)'}, { ID: '3', Name:'Foreign Passport (e.g. 12345678)'}, 
	    { ID: '4', Name:'Government (e.g. T08GA1234A)'}, { ID: '5', Name: 'Statutory Board (e.g. T08GB1234A)'}, { ID: '6', Name:'Business (e.g. 51234567M)'}, 
		{ ID:'7', Name:'Company (e.g. 198912345K)'}, { ID:'8', Name:'Club/Association/Organisation (e.g. T08PQ1234A)'}, { ID:'9', Name:'Professional (e.g. T08PQ1234A)'}, 
		{ ID:'A', Name:'Foreign Company (e.g. T08FC1234A)'}, {ID: 'B', Name:'Limited Liability Partnership (e.g. T08LL1234A)'}, {ID:'C', Name:'Limited Partnership (e.g. T08LP1234A)'},
		{ ID: 'D', Name:'Foreign Identification Number (e.g. F/G/M1234567N)'}];

		
   var formWidget = $('#form').dxForm({
    formData:formData,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,
    validationGroup: 'customerData',
    items: [{

        dataField: 'VehicleNo',
		label: {
          text: 'Vehicle No',
        },
        validationRules: [{
          type: 'required',
          message: 'Vehicle No is required',
        }],
      }, {
        dataField: 'OwnerIDType',
		label: {
          text: 'Owner ID Type',
        },
		editorType: 'dxSelectBox',
        editorOptions: {
          dataSource: OwnerIDTypeList,
		  displayExpr: 'Name',
		   valueExpr: 'ID',
		   value: '1',
		   onValueChanged(e) {
			if(e.value == "3")
			{
				formWidget.itemOption('Country', 'visible', true );
			}
			else
			{
				formWidget.itemOption('Country', 'visible', false );
			}

		  },
        },
        validationRules: [{
          type: 'required',
          message: 'required',
        }],
      },
	  {
		  name: 'Country',
		  dataField: 'Country',
		  label: {
			text: 'Country/Region',
		  },
		  visible: false,
		  editorType: 'dxSelectBox',
		  editorOptions: {
			dataSource: countryList,
			displayExpr: 'Name',
			 valueExpr: 'ID',
			 value: '',
			 onValueChanged(e) {
				sel_country = e.value;	
			  },
		  },
		  validationRules: [{
			type: 'required',
			message: 'required',
		  }],
		},{
        dataField: 'OwnerID',
		label: {
          text: 'Owner ID(Input last 4 characters e.g. 567D)',
        },
        validationRules: [{
          type: 'required',
          message: 'Vehicle No is required',
        }],

    }, {
      itemType: 'button',
      horizontalAlignment: 'center',
      buttonOptions: {
        text: 'Submit',
        type: 'success',
        onClick() {
			var res = formWidget;
			$.ajax({
				url: '/bk/GetTestInfo',
				data: {'VehicleNo': formWidget.option('formData').VehicleNo, 'OwnerID': formWidget.option('formData').OwnerID, 'OwnerIDType': formWidget.option('formData').OwnerIDType, 'Country': sel_country},
				type: 'POST',
				error: function (result) {
					alert("API has Problem, Try Again!");			
				},
				success: function (result) {
					
					result = JSON.parse(result);
					//if (isRealValue(result.result))
					{
						show_result(result.message, result.result);
					}
					
				}
			});
		  },
      },
    }],
  }).dxForm('instance');
 
});

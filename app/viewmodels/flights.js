define(['jquery', 'knockout', 'durandal/app', 'durandal/system', 'plugins/router', 'knockout-mapping'], function ($, ko, app, system, router, komapping) {

	'use strict';

	function displayDialogMsg(mesg) {
		app.showMessage(mesg, 'Flight Manager', ['Close'], true);
	}

	var
	flightList = ko.observableArray(),
	serverUrlDeleteOne = 'http://serverhost/removeFlight',
	serverUrlGetFlightList = 'http://serverhost/giveAllFlights',
	serverUrlUpdateFlight= 'http://serverhost/updateFlight',
	selectedFlight = ko.observable(),
	activate = function activate() {
		$.ajax({
			url : serverUrlGetFlightList,
			success : function (result) {
				//elements from server result are transformed 
				var resultMapped = $.map(result, function (item) {
						return ko.mapping.fromJS(item);
					});
				flightList(resultMapped);
			},
			error : function () {
				displayDialogMsg('Error while loading flights from server');
			}
		});
	},
	deactivate = function () {
		
	};
	
	return {
		flightList : flightList,
		edit : function (flight) {
			selectedFlight(flight);
		},
		updateOne : function (selected) {
			delete selected.__ko_mapping__; //remove field added by knockout
			var jsonFlightBackToServer = ko.toJSON(selected);

			$.ajax(serverUrlUpdateFlight, {
				contentType : 'application/json; charset=utf-8',
				data : jsonFlightBackToServer,
				type : 'POST',
				dataType : 'json',
				success : function (result) {
					if (result) {
						displayDialogMsg('Flight updated successfully !!');
						selectedFlight(null);
					} else {
						displayDialogMsg('Error when saving one flight to server');
					}					
				},
				error : function () {
					displayDialogMsg('Error while sending data');
				}
			});
		},
		deleteOne : function (flightToDelete) {
			app.showMessage('Are you sure you want to delete flight ' + flightToDelete.flightNumber() + ' ?', 'FlighTTool check', ['Yes', 'No']).then(function (dialogResult) {
				if (dialogResult === "Yes") {
					delete flightToDelete.__ko_mapping__; //remove field added by knockout
					var jsonFlightDeleteToServer = ko.toJSON(flightToDelete);

					$.ajax(serverUrlDeleteOne, {
						contentType : 'application/json; charset=utf-8',
						data : jsonFlightDeleteToServer,
						type : 'POST',
						dataType : 'json',
						success : function (result) {
							if (result) {
								displayDialogMsg('Flight deleted successfully !!');
								flightList.remove(flightToDelete);
							} else {
								displayDialogMsg('Error when deleting the flight to server');
							}
						
						},
						error : function () {
							displayDialogMsg('Error while sending data, try again');							
						}
					});
				} 
			});
		},
		cancelEdit : function () {
			selectedFlight(null);
		},
		selectedFlight : selectedFlight,
		activate : activate,
		deactivate : deactivate
	};
});

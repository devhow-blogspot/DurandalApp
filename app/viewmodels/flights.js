define(['jquery', 'knockout', 'durandal/app', 'durandal/system', 'plugins/router', 'knockout-mapping'], function ($, ko, app, system, router, komapping) {

	'use strict';

	function displayDialogMsg(mesg) {
		app.showMessage(mesg, 'Flight Manager', ['Close'], true);
	}

	var
	flightList = ko.observableArray(),
	serverUrlDeleteOne = 'http://localhost:8080/DurandalBackEnd/flight/delete',
	showForm = ko.observable(false),
	selectedFlight = ko.observable(),
	activate = function activate() {
		$.ajax({
			url : 'http://localhost:8080/DurandalBackEnd/flights',
			success : function (result) {
				var resultMapped = $.map(result, function (item) {
						return ko.mapping.fromJS(item);
					});

				flightList(resultMapped);
				showForm(false);

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
			showForm(true);
		},
		showForm : showForm,
		updateOne : function (selected) {
			delete selected.__ko_mapping__; //remove field added by knockout
			var jsonFlightBackToServer = ko.toJSON(selected);

			$.ajax('http://localhost:8080/DurandalBackEnd/flight/update', {
				contentType : 'application/json; charset=utf-8',
				data : jsonFlightBackToServer,
				type : 'POST',
				dataType : 'json',
				success : function (result) {
					if (result) {
						displayDialogMsg('Flight updated successfully !!');
					} else {
						displayDialogMsg('Error when saving one flight to server');
					}
					//self.removeSaveAction();
					showForm(false);
				},
				error : function () {
					displayDialogMsg('Error while sending data');
					showForm(false);
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
							showForm(false);
						},
						error : function () {
							displayDialogMsg('Error while sending data, try again');
							showForm(false);
						}
					});
				} else {
					//
				}
			});

		},
		cancelEdit : function () {
			showForm(false);
		},
		selectedFlight : selectedFlight,
		activate : activate,
		deactivate : deactivate
	};
});

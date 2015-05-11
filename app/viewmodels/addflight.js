define(["jquery", "knockout", "durandal/app", "durandal/system", "plugins/router", 'knockout-validation', 'callServiceGet'], function ($, ko, app, system, router, kovalid, restCall) {

	'use strict';

	function FlightData(data) {
		this.origin = data.selectedFromCity().join();
		this.destination = data.selectedToCity().join();
		this.airline = data.selectedCompany().join();
		this.departureHour = data.departureHour;
		this.arrivalHour = data.arrivalHour;
		this.tarif = data.tarif;
	}

	var FlightModel = function (app, router) {
		var self = this;
		self.selectedFromCity = ko.observable();
		self.selectedToCity = ko.observable();
		self.date = ko.observable();
		self.selectedCompany = ko.observable();
		self.departureHour = ko.observable().extend({
				minLength : 1,
				number : true,
				required : {
					params : true,
					message : 'The departure hour is required.'
				}
			});
		self.arrivalHour = ko.observable().extend({
				minLength : 1,
				number : true,
				required : {
					params : true,
					message : 'The arrival hour is required.'
				}
			});
		self.tarif = ko.observable().extend({
				minLength : 2,
				number : true,
				required : {
					params : true,
					message : 'The price is required.'
				}
			});
	},
	loadCompanies = function (data) {
		availableCompanies(data);
		availableCompanies.sort();
	},
	loadCities = function (data) {
		availableCities(data);
		availableCities.sort();
	},
	save = function (data) {
		var jsonBackToServer = ko.toJSON(new FlightData(data));
		//send data to server layer
		restCall.postData('http://serverhost/addMyFlight', jsonBackToServer);

	},

	// Handlers
	availableCities = ko.observableArray(),
	availableCompanies = ko.observableArray(),
	// Lifecycle

	activate = function () {
		//loading resources from server
		restCall.getData('http://serverhost/giveMeCities', loadCities);
		restCall.getData('http://serverhost/giveMeAirlines', loadCompanies);
	},
	deactivate = function () {};

	return {
		activate : activate,
		deactivate : deactivate,
		availableCities : availableCities,
		availableCompanies : availableCompanies,
		viewModel : new FlightModel(),
		save : save
	};
});

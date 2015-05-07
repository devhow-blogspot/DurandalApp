define(["jquery", "knockout", "durandal/app", "durandal/system", "plugins/router", 'knockout-validation'], function ($, ko, app, system, router, kovalid) {

	'use strict';

	function FlightData(data) {
		this.date = data.date;
		this.origin = data.selectedFromCity().join();
		this.destination = data.selectedToCity().join();
		this.airline = data.selectedCompany().join();
		this.departureHour = data.departureHour;
		this.arrivalHour = data.arrivalHour;
		this.tarif = data.tarif;
		this.id = data.id;
	}

	var FlightModel = function (app, router) {
		var self = this;
		self.selectedFromCity = ko.observable();
		self.selectedToCity = ko.observable();
		self.date = ko.observable();
		self.selectedCompany = ko.observable();
		self.departureHour = ko.observable().extend({
				minLength : 1,
				required : true
			});
		self.arrivalHour = ko.observable().extend({
				minLength : 1,
				required : true
			});
		self.tarif = ko.observable().extend({
				minLength : 2,
				required : true
			});
		self.id = ko.observable();

	},
	loadCompanies = function () {
		$.ajax({
			url : 'http://localhost:8080/DurandalBackEnd/airlines',
			success : function (result) {

				if (result !== 'undefined') {
					var mappedComp = $.map(result, function (item) {
							return item.name;
						});
					availableCompanies(mappedComp);
					availableCompanies.sort();

				} else {
					app.showMessage('Error while loading companies from Server');
				}
			},
			error : function () {
				app.showMessage('Error while loading companies from Server');
			}
		});

	},
	loadCities = function () {

		$.ajax({
			url : 'http://localhost:8080/DurandalBackEnd/cities',
			success : function (result) {

				if (result !== 'undefined') {
					var mappedCities = $.map(result, function (item) {
							return item.name;
						});
					availableCities(mappedCities);
					availableCities.sort();

				} else {
					app.showMessage('Error while loading cities from Server');
				}
			},
			error : function () {
				app.showMessage('Error while loading cities from Server');
			}
		});

	},
	save = function (data) {
		var jsonBackToServer = ko.toJSON(new FlightData(data));

		$.ajax('http://localhost:8080/DurandalBackEnd/addFlight', {
			contentType : 'application/json; charset=utf-8',
			data : jsonBackToServer,
			type : 'POST',
			dataType : 'json',
			success : function (result) {
				if (result) {
					app.showMessage('Data saved successfully !!');//then
					router.navigate('#flights');
				} else {
					app.showMessage('Error when saving data to server');
				}

			},
			error : function () {
				app.showMessage('Error while sending data');

			}
		});

	},

	// Handlers
	availableCities = ko.observableArray(),
	availableCompanies = ko.observableArray(),
	// Lifecycle

	activate = function () {
		loadCities();
		loadCompanies();
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

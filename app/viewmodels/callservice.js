define(['jquery','plugins/router','durandal/app'], function ($,router,app) {
	'use strict';

	function loadFromServer(urlGet, callBack) {
		var returnedData;

		$.ajax({
			url : urlGet,
			success : function (result) {
				if (result !== 'undefined') {
					var mappedResult = $.map(result, function (item) {
							return item.name;
						});
					returnedData = mappedResult;
				} else {
					app.showMessage('Error while loading data from Server');
				}
			},
			error : function () {
				app.showMessage('Error while loading data from Server');
			}
		}).then(function () {
			callBack(returnedData);
		});
	}

	function postToServer(urlPost, jsonBackToServer) {

		$.ajax(urlPost, {
			contentType : 'application/json; charset=utf-8',
			data : jsonBackToServer,
			type : 'POST',
			dataType : 'json',
			success : function (result) {
				if (result) {
					app.showMessage('Data saved successfully !!').then(
					router.navigate('#flights')
					);
				} else {
					app.showMessage('Error when saving data to server');
				}
			},
			error : function () {
				app.showMessage('Error while sending data');
			}
		});
	}
	return {
		getData : loadFromServer,
		postData : postToServer
	};

});

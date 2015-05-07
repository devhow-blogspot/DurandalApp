define(["plugins/router", "durandal/app"], function (router, app) {
	
	'use strict';
    return {
        router: router,

        search: function() {
            app.showMessage('Not Implemented', 'Error');
        },

        activate: function () {
            router.map([
                { route: '', moduleId: 'viewmodels/home', title: 'Home', nav: true },
                {'route':'flights','moduleId':'viewmodels/flights','title':'Flights',nav:true},
				{"route":"editflight/:id","moduleId":"viewmodels/editflight","title":"Edit a flight"},
                {"route":"addflight","moduleId":"viewmodels/addflight","title":"Flight creation",nav:true},
                /*{durandal:routes}*/
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});
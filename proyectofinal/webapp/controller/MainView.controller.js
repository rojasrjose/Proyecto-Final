sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */    

    function (Controller) {
        'use strict';

         function on_Init() {          
        };

        function createEmployees(){
            
            //var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            //oRouter.navTo("RouteOrderDetails", {
              //  OrderId : orderID
            //});
            oRouter.navTo("RouteWizard");
        };

        return Controller.extend("proyectofinal.proyectofinal.controller.MainView", {
            onInit: on_Init,
            createEmployees: createEmployees
            
        });
    });

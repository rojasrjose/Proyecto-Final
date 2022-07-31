sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */    
    function (Controller, JSONModel) {
        'use strict';

         function on_Init() {                   
          
        };

        function createEmployees(){                   
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteWizard");
        };

        function viewEmployees(){
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteViewEmployees");
        };

        return Controller.extend("proyectofinal.proyectofinal.controller.MainView", {
            onInit: on_Init,
            createEmployees: createEmployees,
            viewEmployees: viewEmployees
            
        });
    });

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

         function onInit() {                  
            this._bus = sap.ui.getCore().getEventBus();
        };

        function showEmployees(oEvent){           
            var path = oEvent.getSource().getBindingContext("dataEmployeesModel").getPath();
            this._bus.publish("flexible", "showEmployees", path);
        };
        
        return Controller.extend("proyectofinal.proyectofinal.controller.MasterEmployees", {
            onInit: onInit,
            showEmployees: showEmployees
            
        });
    });
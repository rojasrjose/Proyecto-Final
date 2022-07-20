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
        

        return Controller.extend("proyectofinal.proyectofinal.controller.ViewEmployees", {
           
            onInit: function() {                  
                
                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployees", this.showEmployeesDetails, this);
            },
            showEmployeesDetails: function(category, nameEvent, path){
                var detailsView = this.getView().byId("employeesDetailsView");
                detailsView.bindElement("dataEmployeesModel>" + path);
            },                        
        });
    });

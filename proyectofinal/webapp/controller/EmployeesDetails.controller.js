sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "proyectofinal/proyectofinal/model/formatter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */    

    function (Controller, JSONModel, formatter) {
        'use strict';

        function on_Init() {                  
           
        };
        
        return Controller.extend("proyectofinal.proyectofinal.controller.EmployeesDetails", {
            onInit: on_Init,
            Formatter: formatter
            
        });
    });
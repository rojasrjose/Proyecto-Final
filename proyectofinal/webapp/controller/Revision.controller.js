sap.ui.define([
    "proyectofinal/proyectofinal/controller/Base.controller",
    "sap/ui/model/json/JSONModel"    
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */    

    function (Base, JSONModel, Fragment) {
        'use strict';
        
        return Base.extend("proyectofinal.proyectofinal.controller.Revision", {
                   
      /**   _onObjectMatch: function(oEvent){
            this.getView().bindElement({
                path: "/" + window.decodeURIComponent(oEvent.getParameter("arguments").employeesPath),
                model: "dataEmployeesModel"     
            });
        },*/

        onInit: function(oEvent) {    
            let oModelTipo = oEvent.getSource().getModel("dataEmployeesModel");
    /**         const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteRevision").attachPatternMatched(this._onObjectMatch, this);*/
        },
        
        });      
        
    });
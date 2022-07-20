sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",    
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      */
    function (Controller, History, MessageBox, Fragment) {
        'use strict';

         function on_Init() {     

        };

        function on_CancelWizard() {
            var oWizard = this.byId("createEmployees");
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox["confirm"](oResourceBundle.getText("cancelMsgWizard"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {
                        var oHistory = History.getInstance();
                        var sPreviousHash = oHistory.getPreviousHash();

                        if (sPreviousHash !== undefined) {
                            window.history.go(-1);
                        } else {
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteMainView", true);
                        }
                        oWizard.discardProgress(oWizard.getSteps()[0]);
                    }
                }.bind(this)
            });
        };


  /**       function on_PressReview(oEvent){
            
            var dataEmployeesModel = this.getView().getModel("dataEmployeesModel");
    
            var oContext = dataEmployeesModel.createEntry("/Users", {
                properties: {Type : "Laptop X", 
                              FirstName:"New Laptop", 
                              LastName:"1000", 
                              Dni : "USD",
                              CreationDate: "",
                              Comments: ""}});    
            
                              dataEmployeesModel.refresh();    
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteRevision");        
            };*/
         
        return Controller.extend("proyectofinal.proyectofinal.controller.Base", {
            onInit: on_Init,
            onCancelWizard: on_CancelWizard
            //onPressReview: on_PressReview
        });
    });
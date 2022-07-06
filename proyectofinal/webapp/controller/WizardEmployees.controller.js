sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      */
    function (Controller, JSONModel, History, MessageToast, MessageBox) {
        'use strict';

        function on_Init() {
          //  var oWizard = this.byId("createEmployees"); 
          //  oWizard.setShowNextButton(false);
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

        function on_MoveStepsDatos() {
           var oWizard = this.byId("createEmployees"); 
           var oFirstStep = oWizard.getSteps()[0]; 
           var oCurrStep = this.getView().byId('dataEmployees');
           
            oWizard.discardProgress(oFirstStep);            
            oWizard.setCurrentStep(oCurrStep);               
        };

        function discardProgress() {
            var oWizard = this.byId("createEmployees"); 
            
			oWizard.discardProgress(this.byId("typeEmployees"));

			var clearContent = function (content) {
				for (var i = 0; i < content.length; i++) {
					if (content[i].setValue) {
						content[i].setValue("");
					}

					if (content[i].getContent) {
						clearContent(content[i].getContent());
					}
				}
			};
			
			clearContent(oWizard.getSteps());
		};	

        return Controller.extend("proyectofinal.proyectofinal.controller.WizardEmployees", {
            onInit: on_Init,
            onCancelWizard: on_CancelWizard,          
            onMoveStepsDatos: on_MoveStepsDatos

        });
    });          
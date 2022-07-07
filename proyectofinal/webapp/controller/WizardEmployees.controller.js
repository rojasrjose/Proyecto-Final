sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/Control",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller} Controller
      */
    function (Controller, JSONModel, History, Control, MessageToast, MessageBox) {
        'use strict';

        function on_Init() {
            this._bus = sap.ui.getCore().getEventBus();
            //var oWizard = this.byId("createEmployees"); 
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

        function on_MoveStepsDatos(oEvent) {
            let oButtonI = this.getView().byId("btnTypeInterno");
            let oButtonA = this.getView().byId("btnTypeAutonomo");            
            let oWizard = this.byId("createEmployees");
            let oFirstStep = oWizard.getSteps()[0];
            let oCurrStep = this.getView().byId('dataEmployees');

            oWizard.discardProgress(oFirstStep);
            oWizard.setCurrentStep(oCurrStep);

            var dataEmployeesView = this.getView();
            var dataEmployeesModel = new JSONModel();
            dataEmployeesView.setModel(dataEmployeesModel, "dataEmployeesModel");
        
            if (oButtonI._buttonPressed === 0) {
                dataEmployeesModel.setProperty("/Type", '0');
            } else if (oButtonA._buttonPressed === 0) {
                dataEmployeesModel.setProperty("/Type", '1');
            } else {
                dataEmployeesModel.setProperty("/Type", '2');
            };
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

        function on_ValidateDni(oEvent) {
            var inputDni = this.byId("inputDni");
            var dni = oEvent.getParameter("value");
            var number;
            var letter;
            var letterList;
            var regularExp = /^\d{8}[a-zA-Z]$/;
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            //Se comprueba que el formato es válido
            if (regularExp.test(dni) === true) {

                number = dni.substr(0, dni.length - 1); //Número            
                letter = dni.substr(dni.length - 1, 1); //Letra
                number = number % 23;
                letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                letterList = letterList.substring(number, number + 1);
                if (letterList !== letter.toUpperCase()) {
                    inputDni.setDescription(oResourceBundle.getText("textError"));//Error
                } else {
                    inputDni.setDescription(oResourceBundle.getText("textCorrecto"));//Correcto
                }
            } else {
                inputDni.setDescription(oResourceBundle.getText("textError"));//Error
            }
        };

        return Controller.extend("proyectofinal.proyectofinal.controller.WizardEmployees", {
            onInit: on_Init,
            onCancelWizard: on_CancelWizard,
            onMoveStepsDatos: on_MoveStepsDatos,
            onValidateDni: on_ValidateDni
        });
    });          
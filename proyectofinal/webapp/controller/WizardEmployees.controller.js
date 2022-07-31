sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageBox'
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller, Fragment} Controller
      */
    function (Controller, JSONModel, MessageBox) {
        'use strict';
                
        function on_Init() {

            var oModel = new JSONModel();

            oModel.setData({
                FirstNameState: "None",
                LastNameState: "None",
                DniState: "None",
                CreationDateState: "None",
            });

            this.getView().setModel(oModel, "employeesModel");
            
        };

        function on_MoveStepsDatos(oEvent) {

            let createEmployeesWizard = this.byId("createEmployees");
            let oButtonI = this.getView().byId("btnTypeInterno");
            let oButtonA = this.getView().byId("btnTypeAutonomo");

            var oModel = this.getView().getModel("employeesModel");

            if (oButtonI._buttonPressed === 0) {
                oModel.setProperty("/Type", "0");
                oModel.setProperty("/Amount", 24000);
            } else if (oButtonA._buttonPressed === 0) {
                oModel.setProperty("/Type", "1");
                oModel.setProperty("/Amount", 400);
            } else {
                oModel.setProperty("/Type", "2");
                oModel.setProperty("/Amount", 70000);
            };

            oModel.refresh();

            if (createEmployeesWizard.getCurrentStep().includes("typeEmployees")) {
                createEmployeesWizard.nextStep();
            }
        };

        function data_Validation(oEvent) {

            var error = "";
            var oView = this.getView();
            var oModel = oEvent.getSource().getModel("employeesModel");
            
            var firstNameEmployees = oModel.getProperty("/FirstName");
            var lastNameEmployees = oModel.getProperty("/LastName");

            if (firstNameEmployees === "" || firstNameEmployees === undefined) {

                oModel.setProperty("/FirstNameState", "Error");
                error = "X";

            } else {
                oModel.setProperty("/FirstNameState", "None");
            }

            if (lastNameEmployees === "" || lastNameEmployees === undefined) {

                oModel.setProperty("/LastNameState", "Error");
                error = "X";

            } else {

                oModel.setProperty("/LastNameState", "None");

            };
            
            var oInputDni = oView.byId("inputDni");
            var dni = oInputDni.getValue(); 
            var number;
            var letter;
            var letterList;
            var regularExp = /^\d{8}[a-zA-Z]$/;

            let employeesType = oModel.getProperty("/Type");
            if (employeesType !== '1') {
                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {

                    number = dni.substr(0, dni.length - 1); //Número            
                    letter = dni.substr(dni.length - 1, 1); //Letra
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        oModel.setProperty("/DniState", 'Error');
                        error = "X";

                    } else {
                        oModel.setProperty("/DniState", 'None');                        
                    }
                } else {
                    oModel.setProperty("/DniState", 'Error');
                    error = "X";

                }
            }
            else {
                if (dni === "" || dni === undefined) {

                    oModel.setProperty("/DniState", "Error");
                    error = "X";

                } else {

                    oModel.setProperty("/DniState", "None");

                }
            };

            //Validamos el formato de fecha y que el campo no este vacio

            var inputDateCreation = oView.byId("inputDateCreation");
            var dateCreation = inputDateCreation.getValue();

            if (dateCreation) {

                if ((!oEvent.getSource().isValidValue() && oEvent.getSource().getValue() != "") || (oEvent.getSource().isValidValue() && oEvent.getSource().getValue() === "")) {

                    oModel.setProperty("/CreationDateState", 'Error');
                    error = "X";
                } else {
                    oModel.setProperty("/CreationDateState", 'None');

                }
            }
            else {
                oModel.setProperty("/CreationDateState", 'Error');
                error = "X";
            }

            oModel.refresh();

            var createEmployeesWizard = this.byId("createEmployees");
            if (error === "X") {
                createEmployeesWizard.invalidateStep(this.byId("dataEmployees"));
            } else {
                createEmployeesWizard.validateStep(this.byId("dataEmployees"));
            };

        };

        function on_PressReview(oEvent) {

            var oModel = this.getView().getModel("employeesModel");
            var idNavContainer = this.byId("idWizardNavCont");

            var files = "";
            var oUploadCollection = this.byId("uploadCollection");

            for (var i = 0; i < oUploadCollection.getItems().length; i++) {
                files = files + " " + oUploadCollection.getItems()[i].getFileName();
            }

            oModel.setProperty("/Files", files);

            idNavContainer.to(this.byId("idRevisionPage"));

        };

        function on_FileChange(oEvent) {

            var oModel = this.getView().getModel("dataEmployeesModel");
            let oUploadCollection = oEvent.getSource();

            // Header Toker CSRF - Cross-Site RequestForgery
            let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({

                name: "x-csrf-token",
                value: oModel.getSecurityToken()
            });

            oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

        };

        function on_FileBeforeUploadStarts(oEvent) {

            let fileName = oEvent.getParameter("fileName");
            let sapId = this.getOwnerComponent().SapId;

            let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                name: "slug",
                value: sapId + ";" + this._idemployees + ";" + fileName
            });

            oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

        };

        function on_CancelWizard() {

            var oModel = this.getView().getModel("employeesModel");
            var createEmployeesWizard = this.byId("createEmployees");
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox["confirm"](oResourceBundle.getText("cancelMsgWizard"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                        var oUploadCollection = this.byId("uploadCollection");

                        oModel.setProperty("/FirstNameState", "Error");
                        oModel.setProperty("/FirstName", "");
                        oModel.setProperty("/LastNameState", "Error");
                        oModel.setProperty("/LastName", "");
                        oModel.setProperty("/DniState", "Error");
                        oModel.setProperty("/Dni", "");
                        oModel.setProperty("/CreationDateState", "Error");
                        oModel.setProperty("/CreationDate", null);
                        oModel.setProperty("/Comments", "");

                        oUploadCollection.removeAllItems();

                        createEmployeesWizard.discardProgress(this.byId("typeEmployees"));
                        createEmployeesWizard.discardProgress(this.byId("dataEmployees"));
                        createEmployeesWizard.invalidateStep(this.byId("typeEmployees"));

                        this._navigationToStep(0);

                        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        oRouter.navTo("RouteMainView", true);
                    }
                }.bind(this),

            });
        };

        function on_SaveWinzard(oEvent) {
            var oModel = this.getView().getModel("employeesModel");
            var createEmployeesWizard = this.byId("createEmployees");
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

            MessageBox["confirm"](oResourceBundle.getText("saveMsgWizard"), {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.YES) {

                        var valueType = oModel.getProperty("/Type");
                        var valueFirstName = oModel.getProperty("/FirstName");
                        var valueLastName = oModel.getProperty("/LastName");
                        var valueDni = oModel.getProperty("/Dni");
                        var valueAmount = oModel.getProperty("/Amount");
                        var valueCreationDate = oModel.getProperty("/CreationDate");
                        var valueComments = oModel.getProperty("/Comments");

                        var body = {
                            SapId: this.getOwnerComponent().SapId,
                            Type: valueType,
                            FirstName: valueFirstName,
                            LastName: valueLastName,
                            Dni: valueDni,
                            CreationDate: valueCreationDate,
                            Comments: valueComments,
                            UserToSalary: [{
                                Amount: parseFloat(valueAmount).toString(),
                                Comments: valueComments,
                                Waers: "EUR"
                            }]
                        }

                        this.getView().getModel("dataEmployeesModel").create("/Users", body, {

                            success: function (data) {

                                this._idemployees = data.EmployeeId;

                                var oUploadCollection = this.byId("uploadCollection");

                                sap.m.MessageToast.show(oResourceBundle.getText("textSaveEmployees"));

                                oModel.setProperty("/FirstNameState", "Error");
                                oModel.setProperty("/FirstName", "");
                                oModel.setProperty("/LastNameState", "Error");
                                oModel.setProperty("/LastName", "");
                                oModel.setProperty("/DniState", "Error");
                                oModel.setProperty("/Dni", "");
                                oModel.setProperty("/CreationDateState", "Error");
                                oModel.setProperty("/CreationDate", null);
                                oModel.setProperty("/Comments", "");

                                oUploadCollection.upload();
                                oUploadCollection.removeAllItems();

                                createEmployeesWizard.discardProgress(this.byId("typeEmployees"));
                                createEmployeesWizard.discardProgress(this.byId("dataEmployees"));
                                createEmployeesWizard.invalidateStep(this.byId("typeEmployees"));
                                
                                this._navigationToStep(0);
           

                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                oRouter.navTo("RouteMainView", true);

                            }.bind(this),

                            error: function (e) {

                                sap.m.MessageToast.show(oResourceBundle.getText("textSaveError"));

                            }.bind(this)

                        });

                    }
                }.bind(this),

            });

        };

        function _navigationToStep(stepNumber) {
            
            var createEmployeesWizard = this.byId("createEmployees");
            var idNavContainer = this.byId("idWizardNavCont");
            var idWizardContentPage = this.byId("idWizardContentPage");

            var afterNavigate = function () {

                createEmployeesWizard.goToStep(createEmployeesWizard.getSteps()[stepNumber]);
                idNavContainer.detachAfterNavigate(afterNavigate);
            }.bind(this);

            idNavContainer.attachAfterNavigate(afterNavigate);
            idNavContainer.backToPage(idWizardContentPage.getId());

        };

        function on_EditPress(oEvent) {

            let idLinkType = this.getView().byId("idLinkType").sId;
            let idLinkData = this.getView().byId("idLinkData").sId;
            let idLinkInfAd = this.getView().byId("idLinkInfAd").sId;

            if (idLinkType === oEvent.getSource().sId) {
                this._navigationToStep(0);
            } else if (idLinkData === oEvent.getSource().sId) {
                this._navigationToStep(1);
            } else if (idLinkInfAd === oEvent.getSource().sId){
                this._navigationToStep(2);
            }          
         };
        
        return Controller.extend("proyectofinal.proyectofinal.controller.WizardEmployees", {
            onInit: on_Init,
            onMoveStepsDatos: on_MoveStepsDatos,
            onCancelWizard: on_CancelWizard,
            onSaveWinzard: on_SaveWinzard,       
            dataValidation: data_Validation,
            onPressReview: on_PressReview,
            onFileChange: on_FileChange,
            onFileBeforeUploadStarts: on_FileBeforeUploadStarts,
            _navigationToStep: _navigationToStep,
            onEditPress: on_EditPress
        });

    });          
sap.ui.define([
    "proyectofinal/proyectofinal/controller/Base.controller",     
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment'
],
    /**
      * @param {typeof sap.ui.core.mvc.Controller, Fragment} Controller
      */
    function (Base, JSONModel, Fragment) {
        'use strict';

        function on_Init() {
            
            var oView = this.getView();
            var oJSONModelTipo = new JSONModel({
                valueTipo: ''
            });
            oView.setModel(oJSONModelTipo, "jsonModelTipo");

            //this._bus = sap.ui.getCore().getEventBus();
            //var oWizard = this.byId("createEmployees"); 
            //  oWizard.setShowNextButton(false);
        };
       
        function on_MoveStepsDatos(oEvent) {
            let oButtonI = this.getView().byId("btnTypeInterno");
            let oButtonA = this.getView().byId("btnTypeAutonomo");
            let oWizard = this.byId("createEmployees");
            let oFirstStep = oWizard.getSteps()[0];
            let oCurrStep = this.getView().byId('dataEmployees');
        
            var oModel = this.getView().getModel("jsonModelTipo");             

            if (oButtonI._buttonPressed === 0) {
                oModel.setProperty("/valueTipo", '0');
            } else if (oButtonA._buttonPressed === 0) {
                oModel.setProperty("/valueTipo", '1');
            } else {
                oModel.setProperty("/valueTipo", '2');
            };
            //dataEmployeesModel._ValidateDate = false;

            oModel.refresh();
            
            oWizard.discardProgress(oFirstStep);
            oWizard.setCurrentStep(oCurrStep);
        };

        function on_ValidateDni(oEvent) {
            //            var inputDni = this.byId("inputDni");
            var dni = oEvent.getParameter("value");
            var number;
            var letter;
            var letterList;
            var regularExp = /^\d{8}[a-zA-Z]$/;

            let oModelTipo = oEvent.getSource().getModel("jsonModelTipo");
            if (oModelTipo.oData.valueTipo !== '1') {
                //Se comprueba que el formato es válido
                if (regularExp.test(dni) === true) {

                    number = dni.substr(0, dni.length - 1); //Número            
                    letter = dni.substr(dni.length - 1, 1); //Letra
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        oModelTipo.setProperty("/DniState", 'Error');
                    } else {
                        oModelTipo.setProperty("/DniState", 'None');
                    }
                } else {
                    oModelTipo.setProperty("/DniState", 'Error');
                }
                oModelTipo.refresh();
            };
        };

        function update_CreationDate(oEvent) {

            var oModelTipo = oEvent.getSource().getModel("jsonModelTipo");

            if (!oEvent.getSource().isValidValue()) {
                oModelTipo._ValidateDate = false;
                oModelTipo.setProperty("/CreationDateState", 'Error');
            } else {
                oModelTipo._ValidateDate = true;
                oModelTipo.setProperty("/CreationDateState", 'None');
            };
            oModelTipo.refresh();

        };

        function additional_InfoValidation(){

        };

        function datos_Validation(){
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          //  oRouter.navTo("RouteRevision");
        };
        
        function _onCreate(oEvent){

        };

       function on_PressReview(oEvent){
            
        var dataEmployeesModel = this.getView().getModel("dataEmployeesModel");

        var oContext = dataEmployeesModel.createEntry("/Users", {
            properties: {Type : "Laptop X", 
                          FirstName:"New Laptop", 
                          LastName:"1000", 
                          Dni : "USD",
                          CreationDate: "",
                          Comments: ""}});    
            
            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteRevision");
         //, {
         //       employeesPath: window.encodeURIComponent(oContext.getPath().substr(1))           
         //   } );
              
        };

           return Base.extend("proyectofinal.proyectofinal.controller.WizardEmployees", {
            onInit: on_Init,            
            onMoveStepsDatos: on_MoveStepsDatos,
            onValidateDni: on_ValidateDni,
            updateCreationDate: update_CreationDate,
            additionalInfoValidation: additional_InfoValidation,
            datosValidation: datos_Validation,
            onPressReview: on_PressReview       
            
        });
    });          
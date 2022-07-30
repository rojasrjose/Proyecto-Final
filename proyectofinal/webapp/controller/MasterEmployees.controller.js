sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/core/routing/History'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */

    function (Controller, JSONModel, Filter, FilterOperator, History) {
        'use strict';

        function onBeforeRendering() {

            this.getView().byId("employeesList").getBinding("items").refresh();
            this._bus.publish("flexible", "detailSplit", "");


        };

        function _onObjectMatched(oEvent) {

            this.getView().byId("employeesList").getBinding("items").refresh();

            var oFilterSapId = new Filter("SapId",
                sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);
            // manual filtering
            this.getView().byId("employeesList").getBinding("items").filter(oFilterSapId);

            this._bus.publish("flexible", "detailSplit", "");
        //    var splitApp = this.getView().byId("splitappid");
        //    splitApp.to(this.getView().byId("detailtitlepageid"));

        };

        function onInit() {
            
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteViewEmployees").attachPatternMatched(_onObjectMatched, this);
            
            this._bus = sap.ui.getCore().getEventBus();
            
        };

        function onPressBack(oEvent){
            var oHistory = History.getInstance();
            var sPreviewHash = oHistory.getPreviousHash();

            if (sPreviewHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMainView", true);
            }
        };

        function showEmployees(oEvent) {
            var path = oEvent.getSource().getBindingContext("dataEmployeesModel").getPath();
            this._bus.publish("flexible", "showEmployees", path);
        };

        function onFilterEmployees(oEvent) {
            let employeesFilter = [];
            let sQuery = oEvent.getParameter("query");

            if (sQuery) {               

                var InputFilter = new Filter({
                    filters: [
                        new Filter("FirstName", FilterOperator.Contains, sQuery),
                        new Filter("LastName", FilterOperator.Contains, sQuery),
                        new Filter("Dni", FilterOperator.Contains, sQuery),
                    ],
                    and: false
                });

                employeesFilter.push(InputFilter);
            }
            employeesFilter.push(new Filter("SapId",FilterOperator.EQ, this.getOwnerComponent().SapId));

            var oList = this.byId("employeesList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(employeesFilter);

        };

        return Controller.extend("proyectofinal.proyectofinal.controller.MasterEmployees", {
            onBeforeRendering: onBeforeRendering,
            onInit: onInit,
            onPressBack: onPressBack,
            showEmployees: showEmployees,
            onFilterEmployees: onFilterEmployees

        });
    });
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */

    function (Controller, JSONModel, ODataModel, MessageToast, MessageBox) {
        'use strict';


        return Controller.extend("proyectofinal.proyectofinal.controller.ViewEmployees", {

            onInit: function () {

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployees", this.showEmployeesDetails, this);
                this._bus.subscribe("flexible", "detailSplit", this.detailSplitDetails, this);

                this.byId("idTimeline").setCustomGrouping(function (oDate) {
                    return {
                        key: oDate.getFullYear(),
                        title: oDate.getFullYear(),
                        date: oDate
                    };
                });
            },

            showEmployeesDetails: function (category, nameEvent, path) {

                var detailsView = this.getView();
                detailsView.bindElement("dataEmployeesModel>" + path);

                var oUploadCollection = detailsView.byId("uploadCollection");

                oUploadCollection.bindAggregation("items", {

                    path: "dataEmployeesModel>UserToAttachment",
                    template: new sap.m.UploadCollectionItem({
                        documentId: "{dataEmployeesModel>AttId}",
                        visibleEdit: false,
                        fileName: "{dataEmployeesModel>DocName}"

                    }).attachPress(this.downloadFile)
                });

                var splitContainer = this.getView().byId("FormSplitscreen");
                var detailsPageid = this.getView().byId("idPageDetail");

                splitContainer.to(detailsPageid);
            },

            detailSplitDetails: function (category, nameEvent, path) {

                var splitContainer = this.getView().byId("FormSplitscreen");
                splitContainer.to(this.getView().byId("idPageInitial"));
            },

            onFileBeforeUploadStarts: function (oEvent) {

                let filename = oEvent.getParameter("fileName");
                let oModel = oEvent.getSource().getBindingContext("dataEmployeesModel");
                let objContext = oModel.getObject();
                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: objContext.SapId + ";" + objContext.EmployeeId + ";" + filename
                });

                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileDeleted: function (oEvent) {

                var uploadCollection = oEvent.getSource();
                var sPath = oEvent.getParameter("item").getBindingContext("dataEmployeesModel").getPath();
                this.getView().getModel("dataEmployeesModel").remove(sPath, {

                    success: function () {
                        uploadCollection.getBinding("items").refresh();
                    },
                    error: function () {
                    }
                });

            },

            downloadFile: function (oEvent) {

                const sPath = oEvent.getSource().getBindingContext("dataEmployeesModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV/" + sPath + "/$value");

            },

            onFileUploadComplete: function (oEvent) {

                oEvent.getSource().getBinding("items").refresh();

            },

            onFileChange: function (oEvent) {

                let oUploadCollection = oEvent.getSource();

                // Header Toker CSRF - Cross-Site RequestForgery
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({

                    name: "x-csrf-token",
                    value: this.getView().getModel("dataEmployeesModel").getSecurityToken()
                });

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);

            },

            unsubscribeEmployees: function (oEvent) {

                var oModel = oEvent.getSource().getBindingContext("dataEmployeesModel");
                var oEmployees = oModel.getObject();
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var splitContainer = this.getView().byId("FormSplitscreen");
                var oView = this.getView();

                MessageBox["confirm"](oResourceBundle.getText("textDeleteEmployee"), {

                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],

                    onClose: function (oAction) {

                        if (oAction === MessageBox.Action.YES) {

                            oView.getModel("dataEmployeesModel").remove("/Users(EmployeeId='" + oEmployees.EmployeeId + "',SapId='" + oEmployees.SapId + "')", {

                                success: function (data) {

                                    var text = oResourceBundle.getText("textDeleteOk") + "( " + oEmployees.EmployeeId + " )";
                                    sap.m.MessageToast.show(text);
                                    //                                           
                                    splitContainer.to(oView.byId("idPageInitial"));
                                }.bind(this),

                                error: function (e) {

                                    sap.m.MessageToast.show(oResourceBundle.getText("textDeleteNKo"));

                                }.bind(this)

                            });
                        }

                    }

                });
            },

            ascendEmployees: function (oEvent) {

                var oModel = new JSONModel();

                oModel.setData({

                    valueAmount: 0,
                    valueAmountStatus: "Error",
                    valueCreationDate: null,
                    valueCreationDateStatus: "Error",
                    valueComments: ""

                });

                this.getView().setModel(oModel, "employeesModel");

                var iconPressed = oEvent.getSource();                
                var oContext = iconPressed.getBindingContext("dataEmployeesModel");

                this._EmployeeId = oContext.getObject().EmployeeId;
                this._SapId = oContext.getObject().SapId;
                this._detailView = this.getView();

                if (!this._oDialogEmployees) {
                    this._oDialogEmployees = sap.ui.xmlfragment("proyectofinal.proyectofinal.fragment.DialogAscendEmployee", this);
                    this.getView().addDependent(this._oDialogEmployees);

                }
                this._oDialogEmployees.open();
            },

            dialogValidation: function (oEvent) {

                var oModel = this.getView().getModel("employeesModel");
                var valueAmount = parseInt(oModel.getProperty("/valueAmount"));

                if (isNaN(valueAmount)) {
                    oModel.setProperty("/valueAmountStatus", "Error");
                } else {
                    oModel.setProperty("/valueAmountStatus", "None");
                }

                if (oEvent.getSource().getId().includes("picker")) {

                    if ((!oEvent.getSource().isValidValue() && oEvent.getSource().getValue() != "") || (oEvent.getSource().isValidValue() && oEvent.getSource().getValue() === "")) {
                        oModel.setProperty("/valueCreationDateStatus", "Error");
                    } else {
                        oModel.setProperty("/valueCreationDateStatus", "None");
                    }

                }
            },

            acceptAscend: function (oEvent) {

                var oModel = this.getView().getModel("employeesModel");
                var valueAmountStatus = oModel.getProperty("/valueAmountStatus");
                var valueCreationDateStatus = oModel.getProperty("/valueCreationDateStatus");
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                if (valueAmountStatus === "None" && valueCreationDateStatus === "None") {

                    var valueAmount = oModel.getProperty("/valueAmount");
                    var valueCreationDate = oModel.getProperty("/valueCreationDate");
                    var valueComments = oModel.getProperty("/valueComments");

                    var body = {
                        SapId: this._SapId,
                        EmployeeId: this._EmployeeId,
                        CreationDate: valueCreationDate,
                        Amount: parseFloat(valueAmount).toString(),
                        Waers: "EUR",
                        Comments: valueComments
                    }

                    this.getView().getModel("dataEmployeesModel").create("/Salaries", body, {

                        success: function (data) {

                            this.getView().byId("idTimeline").getBinding("content").refresh();
                            sap.m.MessageToast.show(oResourceBundle.getText("textAscendEmployeeS"));
                            this._oDialogEmployees.close();

                        }.bind(this),

                        error: function (e) {

                            sap.m.MessageToast.show(oResourceBundle.getText("textAscendEmployeeE"));

                            this._oDialogEmployees.close();

                        }.bind(this)

                    });

                } else {

                    sap.m.MessageToast.show(oResourceBundle.getText("textDataComplet"));

                }

            },

            cancelAscend: function (oEvent) {

                this._oDialogEmployees.close();

            },

        });
    });

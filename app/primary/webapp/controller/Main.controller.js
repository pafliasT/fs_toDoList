sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/CheckBox",
],
    function (Controller, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, ColumnListItem, Text, Input, Button, CheckBox) {
        "use strict";

        return Controller.extend("com.todolist.primary.controller.Main", {
            onInit: function () {
                const oStateModel = new JSONModel({ selectedTodoList:  null, mode: 'HideMode' });
                this.getView().setModel(oStateModel, "state");

                this.updateTodoListStatistics();
            },
            onSelectTodoList: function (oEvent) {
                const sTodoListID = oEvent.getSource().getBindingContext().getProperty("ID");
                this.getView().getModel("state").setProperty("/selectedTodoList", sTodoListID);
                this.bindTodoListNameToMasterTitle(sTodoListID);
                this.displayTodoListItems(sTodoListID);
            },
            onCreateTodoList: function () {
                const sEndpoint = "/todoapi/createTodoList";
                const oPayload = {
                    ID:   uuid.v4(),
                    name: "New List"
                };

                axios.post(sEndpoint, oPayload)
                    .then(function () {
                        MessageToast.show("Todo List created successfully!");
                        this.byId("todolist-panel").getBinding("content").refresh();
                        this.updateTodoListStatistics();
                    }.bind(this))
                    .catch(function (oError) {
                        const sErrorMessage = oError && oError.responseJSON && oError.responseJSON.error ? oError.responseJSON.error.message : "An unexpected error occurred";
                        MessageBox.error(sErrorMessage, { title: "Error Creating Todo List" });
                    });
            },
            onStartEditTodoList: function () {
                const oTitleControl = this.byId("todolist-title");
                const oTitleInputControl = this.byId("todolist-title-input");

                oTitleControl.setVisible(false);
                oTitleInputControl.setVisible(true);
            },
            onFinishEditTodoList: function () {
                const oTitleControl = this.byId("todolist-title");
                const oTitleInputControl = this.byId("todolist-title-input");
                const oTodoListsPanelControl = this.byId("todolist-panel");

                oTitleControl.setText(oTitleInputControl.getValue());
                oTodoListsPanelControl.getBinding("content").refresh();
                this.updateTodoListStatistics();
                
                oTitleControl.setVisible(true);
                oTitleInputControl.setVisible(false);
            },
            onDeleteTodoList: function () {
                const sEndpoint = "/todoapi/deleteTodoList";
                const oPayload = { ID: this.getView().getModel("state").getProperty("/selectedTodoList") };

                axios.post(sEndpoint, oPayload)
                    .then(function () {
                        MessageToast.show("Todo List deleted succesfully!");
                        this.byId("todolist-panel").getBinding("content").refresh();
                        this.updateTodoListStatistics();
                    }.bind(this))
                    .catch(function (oError) {
                        console.log(oError);
                        const sErrorMessage = oError && oError.responseJSON && oError.responseJSON.error ? oError.responseJSON.error.message : "An unexpected error occurred";
                        MessageBox.error(sErrorMessage, { title: "Error Deleting Todo List" });
                    });
            },
            onCreateTodoItem: function () {
                const sSelectedTodoListID = this.getView().getModel("state").getProperty("/selectedTodoList");
                const sEndpoint = "/todoapi/createTodoItem";
                const oPayload = {
                    ID: uuid.v4(),
                    name: "New Item",
                    todoList_ID: sSelectedTodoListID
                };

                axios.post(sEndpoint, oPayload)
                    .then(function () {
                        MessageToast.show("Todo Item created successfully!");
                        this.displayTodoListItems(sSelectedTodoListID);
                        this.updateTodoListStatistics();
                    }.bind(this))
                    .catch(function (oError) {
                        const sErrorMessage = oError && oError.responseJSON && oError.responseJSON.error ? oError.responseJSON.error.message : "An unexpected error occurred";
                        MessageBox.error(sErrorMessage, { title: "Error Creating Todo Item" });
                    });
            },
            onDeleteTodoItem: function (oEvent) {
                const sTodoItemID = oEvent.getSource().getBindingContext().getProperty("ID");
                const sTodoListID = this.getView().getModel("state").getProperty("/selectedTodoList");
                const sEndpoint = "/todoapi/deleteTodoItem";
                const oPayload = { ID: sTodoItemID };

                axios.post(sEndpoint, oPayload)
                    .then(function () {
                        MessageToast.show("Todo Item deleted succesfully!");
                        this.displayTodoListItems(sTodoListID);
                        this.updateTodoListStatistics();
                    }.bind(this))
                    .catch(function (oError) {
                        console.log(oError);
                        const sErrorMessage = oError && oError.responseJSON && oError.responseJSON.error ? oError.responseJSON.error.message : "An unexpected error occurred";
                        MessageBox.error(sErrorMessage, { title: "Error Deleting Todo Item" });
                    });
            },
            bindTodoListNameToMasterTitle: function (sTodoListID) {
                const oTitleControl = this.getView().byId("todolist-title");
                const oTitleInputControl = this.getView().byId("todolist-title-input");

                oTitleControl.bindElement({ path: `/TodoList(${ sTodoListID })` });
                oTitleControl.bindProperty("text", { path: `name` });

                oTitleInputControl.bindElement({ path: `/TodoList(${ sTodoListID })` });
                oTitleInputControl.bindProperty("value", { path: `name` });
            },
            updateTodoListStatistics: function () {
                this.getOwnerComponent().getModel().bindList("/TodoItem").requestContexts().then(function (aContexts) {
                    const aTodoItems = aContexts.map(oContext => oContext.getObject());
                    const mTodoListDetails = new Map();

                    for(const oData of aTodoItems) {
                        const oTodoListDetails = mTodoListDetails.get(oData.todoList_ID) || { total: 0, complete: 0 };

                        oTodoListDetails.total++;
                        if(oData.completed) oTodoListDetails.complete++;

                        mTodoListDetails.set(oData.todoList_ID, oTodoListDetails);
                    }

                    const oTileListContent = this.byId("todolist-panel").getAggregation("content");
                    for(const oTile of oTileListContent) {
                        const todoListId = oTile.getBindingContext().getProperty("ID");
                        const oCurrentTodoListDetails = mTodoListDetails.get(todoListId) || { total: 0, complete: 0 };

                        oTile.setSubheader(`Total - ${oCurrentTodoListDetails.total}\nComplete - ${oCurrentTodoListDetails.complete}`);
                    }
                    console.log(mTodoListDetails);
                }.bind(this));
            },
            displayTodoListItems: function(sTodoListId) {
                const oDetails = this.getView().byId("todolist-items");

                oDetails.bindAggregation("items", {
                    path: "/TodoItem",
                    filters: new Filter("todoList_ID", FilterOperator.EQ, sTodoListId),
                    template: new ColumnListItem({ 
                        cells: [
                            new CheckBox({ selected: "{completed}", select: this.updateTodoListStatistics.bind(this) }),
                            new Text({ text: "{name}" }),
                            new Button({ icon: "sap-icon://edit", type: "Transparent" }),
                            new Button({ icon: "sap-icon://delete", type: "Transparent", press: this.onDeleteTodoItem.bind(this) })
                        ]
                    })
                });
            },
        });
    });
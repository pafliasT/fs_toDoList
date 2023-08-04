sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
],
    function (Controller, MessageToast, MessageBox, JSONModel) {
        "use strict";

        return Controller.extend("com.todolist.primary.controller.Main", {
            onInit: function () {
                const oStateModel = new JSONModel({ selectedTodoList:  null });
                this.getView().setModel(oStateModel, "state");

                this.updateTodoListStatistics();
            },
            onSelectTodoList: function (oEvent) {
                const sTodoListID = oEvent.getSource().getBindingContext().getProperty("ID");
                this.getView().getModel("state").setProperty("/selectedTodoList", sTodoListID);
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
            }
        });
    });

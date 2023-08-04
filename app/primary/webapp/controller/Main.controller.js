sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
],
    function (Controller, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("com.todolist.primary.controller.Main", {
            onInit: function () {
                this.updateTodoListStatistics();
            },
            onCreateTodoList: async function () {
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

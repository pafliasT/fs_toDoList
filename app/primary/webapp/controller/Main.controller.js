sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("com.todolist.primary.controller.Main", {
            onInit: function () {
                this.updateTodoListStatistics();
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

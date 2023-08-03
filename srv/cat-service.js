const handleErrors = (operation, req, error) => {
    console.error(`Error while ${operation} Todo:`, error.message);
    return req.reject(error.code || 500, error.message);
};

const createTodoItem = async (req, TodoItem) => {
    const { ID, name, completed } = req.data;
    const existingTodo = await SELECT.one.from(TodoItem).where({ ID });

    if (existingTodo) {
        return req.error(409, `Todo with ID ${ID} already exists`);
    }

    await INSERT.into(TodoItem).entries([{ ID, name, completed }]);
    return `Todo with ID ${ID} created successfully`;
};

const updateTodoItem = async (req, TodoItem) => {
    const { ID, name, completed } = req.data;
    await UPDATE(TodoItem).set({ name, completed }).where({ ID });
    return `Todo with ID ${ID} updated successfully`;
};

const deleteTodoItem = async (req, TodoItem) => {
    const { ID } = req.data;
    const existingTodo = await SELECT.one.from(TodoItem).where({ ID });

    if (!existingTodo) {
        return req.error(404, `Todo with ID ${ID} does not exist`);
    }

    await DELETE.from(TodoItem).where({ ID });
    return `Todo with ID ${ID} deleted successfully`;
};

const createTodoList = async (req, TodoList) => {
    const { ID, name } = req.data;

    const existingTodoList = await SELECT.one.from(TodoList).where({ ID });
    if (existingTodoList) return req.error(409, `Todo list with ID ${ID} already exists`);

    await INSERT.into(TodoList).entries([{ ID, name }]);
    return `Todo list with ${ID} created successfully`;
}

const updateTodoList = async (req, TodoList) => {
    const { ID, name } = req.data;

    await UPDATE(TodoList).set({ name }).where({ ID });
    return `Todo list with ${ID} updated successfully`;
};

const deleteTodoList = async (req, TodoList) => {
    const { ID } = req.data;
    const existingTodoList = await SELECT.one.from(TodoList).where({ ID });   

    if(!existingTodoList) return req.error(404, `Todo with ID ${ID} does not exist`);

    await DELETE.from(TodoList).where({ ID });
    return `Todo list with ID ${ID} deleted successfully`;
};

module.exports = (srv) => {
    const { TodoItem, TodoList } = srv.entities;

    srv.on("createTodoItem", async (req) => {
        try {
            return await createTodoItem(req, TodoItem);
        } catch (error) {
            return handleErrors('adding', req, error);
        }
    });

    srv.on("updateTodoItem", async (req) => {
        try {
            return await updateTodoItem(req, TodoItem);
        } catch (error) {
            return handleErrors('updating', req, error);
        }
    });

    srv.on("deleteTodoItem", async (req) => {
        try {
            return await deleteTodoItem(req, TodoItem);
        } catch (error) {
            return handleErrors('deleting', req, error);
        }
    });

    srv.on("createTodoList", async (req) => {
        try {
            return await createTodoList(req, TodoList);
        } catch (error) {
            return handleErrors('adding', req, error);
        }
    });

    srv.on("updateTodoList", async (req) => {
        try {
            return await updateTodoList(req, TodoList);
        } catch (error) {
            return handleErrors('updating', req, error);
        }
    });

    srv.on("deleteTodoList", async (req) => {
        try {
            return await deleteTodoList(req, TodoList);
        } catch (error) {
            return handleErrors('deleting', req, error);
        }
    });
};
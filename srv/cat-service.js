const cds = require("@sap/cds");
const { TodoItem } = cds.entities("toDoList.TodoItem")

module.exports = (srv) => {

    srv.on("createTodo", async (req) => {
        const { ID, name, completed } = req.data;

        try {
            // Check if the user with the given ID already exists
            const existingTodo = await SELECT.one.from(TodoItem).where({ ID: ID });

            if (existingTodo) {
                return req.error(409, `Todo with ID ${ID} already exists`);
            }

            // Insert the new user into the database
            await INSERT.into(TodoItem).entries([{ ID: ID, name: name, completed: completed }])

            // Return a success message
            return `Todo with ID ${ID} created successfully`;
        } catch (error) {
            console.error('Error adding Todo:', error.message);
            return req.reject(error.code || 500, error.message);
        }
    });
}


// await UPDATE(Gare)
//         .set({ Annullata: true })
//         .where({ ID: IDGara })

// await INSERT.into(VersioniGare).entries([{ to_pianoGare_ID: idPianoGare, Descrizione: descrizione, DataStoricizzazione: formattedToday }])
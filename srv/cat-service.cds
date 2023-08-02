using toDoList from '../db/schema';

service catalogService @(path: '/todoapi') {

    entity TodoItem as projection on toDoList.TodoItem;
    entity TodoList as projection on toDoList.TodoList;
    action createTodo(ID : UUID, name : String, completed : Boolean)
}

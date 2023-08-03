using toDoList from '../db/schema';

service catalogService @(path: '/todoapi') {
    entity TodoItem as projection on toDoList.TodoItem;
    entity TodoList as projection on toDoList.TodoList;

    action createTodoItem(ID : UUID, name : String, completed : Boolean) returns String;
    action updateTodoItem(ID : UUID, name : String, completed : Boolean) returns String;
    action deleteTodoItem(ID : UUID)                                     returns String;

    action createTodoList(ID : UUID, name : String) returns String;
    action updateTodoList(ID : UUID, name : String) returns String;
    action deleteTodoList(ID : UUID) returns String;
}

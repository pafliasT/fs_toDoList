using toDoList from '../db/schema';

service catalogService {

    entity TodoItem as projection on toDoList.TodoItem;
    entity TodoList as projection on toDoList.TodoList;

}

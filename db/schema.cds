namespace toDoList;

using {managed} from '@sap/cds/common';

entity TodoItem : managed {
    key ID        : UUID;
        name      : String;
        completed : Boolean;
        todoList  : Association to TodoList;
}

entity TodoList : managed {
    key ID        : UUID;
        name      : String;
        todoItems : Association to many TodoItem
                        on todoItems.todoList = $self;
}

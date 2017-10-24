import { Component, OnInit } from '@angular/core';
import { Todo } from './todo';
import { TodoService } from './todo.service';

@Component({
    selector: 'app',
    templateUrl: 'todo.html',
    styles: [
        'div { margin : 12px; min-height: 10px }',
        'span, input, md-progress-bar { width : 400px; }',
        'span, input, button { margin : 10px; }',
        '.red { color : red }'
    ],
    providers: [TodoService]
})
export class AppComponent implements OnInit {
    public isBusy: boolean;

    public errorMessage: string;

    public todos: Todo[];

    public todo: Todo;

    private selectedTodo: Todo;

    public constructor(private todoService: TodoService) { }

    public ngOnInit(): void {
        this.todo = new Todo();
        this.callService(todoService => todoService.all().subscribe(todos => this.todos = todos, this.onError.bind(this), this.onComplete.bind(this)));
    }

    public onAddClick(): void {
        this.callService(todoService => todoService.insert(this.todo).subscribe(todo => this.todos.push(todo), this.onError.bind(this), this.onComplete.bind(this)));
        this.todo = new Todo();
    }

    public onEditClick(todo: Todo): void {
        this.selectedTodo = { ...todo };
        todo.isEditing = true;
    }

    public onUpdateClick(todo: Todo): void {
        todo.isEditing = false;
        this.callService(todoService => todoService.update(todo).subscribe(todo => todo = todo, this.onError.bind(this), this.onComplete.bind(this)));
    }

    public onDeleteClick(todo: Todo, index: number): void {
        this.callService(todoService => todoService.delete(todo).subscribe(todo => this.todos.splice(index, 1), this.onError.bind(this), this.onComplete.bind(this)));
    }

    public onCancelClick(todo: Todo, index: number): void {
        todo.isEditing = false;
        this.todos[index] = this.selectedTodo;
    }

    private onError(error: any): void {
        this.errorMessage = error;
        this.isBusy = false;
    }

    private onComplete(): void {
        this.errorMessage = null;
        this.isBusy = false;
    }

    private callService(method: (todoService: TodoService) => void) {
        this.isBusy = true;
        method(this.todoService);
    }
}
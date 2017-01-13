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

    private selectedTodo: string;

    public constructor(private todoService: TodoService) { }

    public ngOnInit(): void {
        this.isBusy = true;
        this.todo = new Todo();
        this.todoService.all().subscribe(todos => this.todos = todos, this.onError.bind(this), this.onComplete.bind(this));
    }

    public onAddClick(): void {
        this.isBusy = true;
        this.todoService.insert(this.todo).subscribe(todo => this.todos.push(todo), this.onError.bind(this), this.onComplete.bind(this));
        this.todo = new Todo();
    }

    public onEditClick(todo: Todo): void {
        this.selectedTodo = JSON.stringify(todo);
        todo.isEditing = true;
    }

    public onUpdateClick(todo: Todo): void {
        todo.isEditing = false;
        this.isBusy = true;
        this.todoService.update(todo).subscribe(todo => todo = todo, this.onError.bind(this), this.onComplete.bind(this));
    }

    public onDeleteClick(todo: Todo, index: number): void {
        this.isBusy = true;
        this.todoService.delete(todo).subscribe(todo => this.todos.splice(index, 1), this.onError.bind(this), this.onComplete.bind(this));
    }

    public onCancelClick(todo: Todo, index: number): void {
        todo.isEditing = false;
        this.todos[index] = JSON.parse(this.selectedTodo);
    }

    private onError(error: any): void {
        this.errorMessage = error;
        this.isBusy = false;
    }

    private onComplete(): void {
        this.errorMessage = null;
        this.isBusy = false;
    }
}
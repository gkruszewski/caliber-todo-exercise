import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Todo } from './todo';

@Injectable()
export class TodoService {
    private url = 'api/todo/';

    public constructor(private http: Http) { }

    public all(): Observable<Todo[]> {
        return this.http.get(this.url)
            .map(response => <Todo[]>response.json(), this)
            .catch(this.handleError);
    }

    public insert(todo: Todo): Observable<Todo> {
        return this.http.post(this.url, todo, this.createRequestOptions())
            .map(response => <Todo>response.json(), this)
            .catch(this.handleError);
    }

    public update(todo: Todo): Observable<Todo> {
        return this.http.put(this.url, todo, this.createRequestOptions())
            .map(() => todo)
            .catch(this.handleError);
    }

    public delete(todo: Todo): Observable<Todo> {
        return this.http.delete(this.url + todo.id)
            .map(() => todo)
            .catch(this.handleError);
    }

    private handleError(error: Response | any) {
        console.error(error);

        return Observable.throw(error.json().error || 'Server error');
    }

    private createRequestOptions(): RequestOptions {
        return new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    }
}
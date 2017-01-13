import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Todo } from './todo';

@Injectable()
export class TodoService {
    private url = 'api/todo';

    public constructor(private http: Http) { }

    public all(): Observable<Todo[]> {
        return this.http.get(this.url)
            .map(this.mapResponses, this)
            .catch(this.handleError);
    }

    public insert(todo: Todo): Observable<Todo> {
        return this.http.post(this.url, todo, this.createRequestOptions())
            .map(this.mapResponse, this)
            .catch(this.handleError);
    }

    public update(todo: Todo): Observable<Todo> {
        return this.http.put(this.url, todo, this.createRequestOptions())
            .map(() => todo)
            .catch(this.handleError);
    }

    public delete(todo: Todo): Observable<Todo> {
        return this.http.delete(this.url + '/' + todo.id)
            .map(() => todo)
            .catch(this.handleError);
    }

    private mapResponses(response: Response): Todo[] {
        return response.json().map(this.map, this);
    }

    private mapResponse(response: Response): Todo {
        return this.map(response.json());
    }

    private map(body: any): Todo {
        return {
            id: body.id,
            description: body.description,
            isEditing: false
        };
    }

    private handleError(error: Response | any) {
        let errorMesssage: string;

        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);

            errorMesssage = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errorMesssage = error.message ? error.message : 'There was a problem with your request';
        }

        console.error(errorMesssage);

        return Observable.throw(errorMesssage);
    }

    private createRequestOptions(): RequestOptions {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        return new RequestOptions({ headers: headers });
    }
}

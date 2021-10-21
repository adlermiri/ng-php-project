import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Article } from '../models/article.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private url = `http://localhost:8000/api/articles`;
    
    articles$: BehaviorSubject<Article[]> = new BehaviorSubject([]);
    articles: Array<Article> = [];

    constructor(private http: HttpClient) {}

    get() {
        this.http.get<Article[]>(this.url).pipe(
            take(1),
            catchError(error => {
                return of([]);
            })
        ).subscribe((articles: any) => {
            this.articles = articles.data;
            this.articles$.next(this.articles);
        });
    }

    add(Article: Article) {
        this.http.post<any>(`${this.url}`, Article).pipe(
            take(1),
            catchError(error => {
                return EMPTY;
            })
        ).subscribe(res => {
            Article.id = res.data.id;
            this.articles.push(Article);
            this.articles$.next(this.articles);
        });
    }

    edit(Article: Article) {
        let findElem = this.articles.find(p => p.id == Article.id);
        findElem.title = Article.title;
        findElem.content = Article.content;
        findElem.updated_at = new Date().toString();

        this.http.put<any>(`${this.url}/${Article.id}`, findElem).pipe(
            take(1),
            catchError(error => {
                return EMPTY;
            })
        ).subscribe(() => {
            this.articles$.next(this.articles);
        });
    }

    remove(id: number) {
        this.http.delete<any>(`${this.url}/${id}`).pipe(
            take(1),
            catchError(error => {
                return EMPTY;
            })
        ).subscribe(() => {
            this.articles = this.articles.filter(p => {
                return p.id != id
            });

            this.articles$.next(this.articles);
        });
    }
}
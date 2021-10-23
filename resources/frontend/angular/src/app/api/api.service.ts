import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Article } from '../models/article.interface';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private url = `http://localhost:8000/api/articles`;
    articles$: BehaviorSubject<Article[]>;
    articles: Array<Article> = [];

    constructor(
        private http: HttpClient
    ) {
        this.articles$ = new BehaviorSubject([]);
    }

    get() {
        this.http.get<Article[]>(this.url).pipe(
            first()
        ).subscribe((articles: any) => {
            this.articles = articles.data;
            this.articles$.next(articles.data);
        });
    }

    add(article: Article) {
        this.http.post<any>(`${this.url}`, article).pipe(
            first()
        ).subscribe(res => {
            article.id = res.data.id;
            this.articles.push(article);
            this.articles$.next(this.articles);
        });
    }

    edit(article: Article) {
        let findElem = this.articles.find(p => p.id == article.id);
        findElem.title = article.title;
        findElem.content = article.content;
        findElem.updated_at = new Date().toString();

        this.http.put<any>(`${this.url}/${article.id}`, findElem).pipe(
            first()
        ).subscribe(() => {
            this.articles$.next(this.articles);
        });
    }

    remove(id: number) {
        this.http.delete<any>(`${this.url}/${id}`).pipe(
            first()
        ).subscribe(() => {
            this.articles = this.articles.filter(p => {return p.id != id});
            this.articles$.next(this.articles);
        });
    }
}
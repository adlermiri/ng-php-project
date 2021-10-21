//app.component.ts
import { Component, ViewChild } from '@angular/core';

import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { Article } from './models/article.interface';
import { ApiService } from './api/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayedColumns: string[] = ['id', 'title', 'content', 'updated_at', 'created_at', 'action'];
  dataSource: Article[] = [];

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) { }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == 'Add') {
          this.addArticle(result.data);
        } else if (result.event == 'Update') {
          this.updateArticle(result.data);
        } else if (result.event == 'Delete') {
          this.deleteArticle(result.data);
        }
      }
    });
  }

  addArticle(article: Article) {
    this.apiService.add(article);
    this.dataSource.push(article);
    this.table.renderRows();
  }

  updateArticle(article: Article) {
    let index = this.dataSource.findIndex(a => a.id === article.id);
    if (index !== -1) {
      this.apiService.edit(article);
      this.dataSource[index] = article;
      this.table.renderRows();
    }
  }

  deleteArticle(article: Article) {
    this.apiService.remove(article.id);
    this.dataSource = this.dataSource.filter(a => a.id !== article.id);
    this.table.renderRows();
  }
}
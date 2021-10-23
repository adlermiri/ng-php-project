//app.component.ts
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { Article } from './models/article.interface';
import { ApiService } from './api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'content', 'updated_at', 'created_at', 'action'];
  dataSource: MatTableDataSource<Article>;

  private sub: Subscription;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Article>();
  }
  
  ngOnInit(): void {
    this.apiService.get();
    this.sub = this.apiService.articles$
      .subscribe(articles => {
        this.dataSource.data = articles;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub = undefined;
  }

  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      width: '250px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event == 'Add') {
          this.apiService.add(result.data);
        } else if (result.event == 'Update') {
          this.apiService.edit(result.data);
        } else if (result.event == 'Delete') {
          this.apiService.remove(result.data.id);
        }
      }
    });
  }
}
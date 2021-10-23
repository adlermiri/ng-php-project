//dialog-box.component.ts
import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Article } from '../models/article.interface';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {

  form: FormGroup;
  action: string;
  local_data: any;

  constructor(
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Article) {
    
    this.local_data = { ...data };
    this.action = this.local_data.action;

    this.form = new FormGroup({
      "id": new FormControl({ value: data.id ?? '', disabled: !!data.id ? true : false }),
      "title": new FormControl(data.title ?? ''),
      "content": new FormControl(data.content ?? ''),
      "updated_at": new FormControl({ value: data.updated_at ?? null, disabled: true }),
      "created_at": new FormControl({ value: data.created_at ?? null, disabled: true }),
    });
  }

  doAction() {
    this.dialogRef.close({
      event: this.action, data: {
        id: this.data.id,
        title: this.form.value.title,
        content: this.form.value.content,
        updated_at: new Date().toISOString(),
        created_at: this.data.created_at ?? new Date().toISOString(),
    } as Article });
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
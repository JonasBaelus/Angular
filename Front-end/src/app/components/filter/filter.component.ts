import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Input() placeholderText: string = '';

  @Output() searchNameChange = new EventEmitter<string>();
  
  searchName: string = '';
  faCross = faXmark;

  onSearchNameChange(value: string) {
    this.searchName = value;
  }

  submit() {
    this.searchNameChange.emit(this.searchName);
  }
}

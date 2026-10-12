import { Component, inject, OnInit, signal } from '@angular/core';
import { ReportResponse, ReportService } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class Reports implements OnInit {
  private readonly reportService = inject(ReportService);

  selectedCategory = 'All';
  searchText = signal('');
  reports = signal<ReportResponse[]>([]);

  ngOnInit(): void {
    this.reportService.getReports().subscribe({
      next: (response) => {
        this.reports.set(response);
      },
    });
  }

  categoryClicked(category: string): void {
    this.selectedCategory = category;
  }

  searchTextChanged(event: Event): void {
    const box = event.target as HTMLInputElement;
    this.searchText.set(box.value);
  }

  visibleReports(): ReportResponse[] {
    const rows = this.reports();
    let categoryRows: ReportResponse[];

    if (this.selectedCategory === 'All') {
      categoryRows = rows;
    }
    else {
      categoryRows = rows.filter(report => report.category === this.selectedCategory);
    }

    return categoryRows.filter(report =>
      this.rowMatches([report.reportName, report.description]));
  }

  private rowMatches(values: string[]): boolean {
    const typed = this.searchText().trim().toLowerCase();

    if (typed === '') {
      return true;
    }

    for (const value of values) {
      if (value.toLowerCase().includes(typed)) {
        return true;
      }
    }

    return false;
  }

  displayDate(value: string): string {
    const parts = value.split('-');
    const year = parts[0];
    const monthNumber = Number(parts[1]);
    const day = parts[2];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return day + ' ' + months[monthNumber - 1] + ' ' + year;
  }
}

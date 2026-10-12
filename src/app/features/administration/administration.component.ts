import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdministrationService, StaffResponse, StaffSave } from '../../services/administration.service';

@Component({
  selector: 'app-administration',
  imports: [FormsModule],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss',
})
export class Administration implements OnInit {
  private readonly administrationService = inject(AdministrationService);

  selectedStatus = 'All';
  searchText = signal('');
  staff = signal<StaffResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingUserName = '';
  form: StaffSave = this.emptyForm();

  ngOnInit(): void {
    this.loadStaff();
  }

  loadStaff(): void {
    this.administrationService.getStaff().subscribe({
      next: (response) => {
        this.staff.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingUserName = '';
    this.formMessage.set('');
    this.form = this.emptyForm();
    this.formOpen.set(true);
  }

  updateClicked(person: StaffResponse): void {
    this.editingUserName = person.userName;
    this.formMessage.set('');
    this.form = {
      displayName: person.displayName,
      userName: person.userName,
      jobTitle: person.jobTitle,
      area: person.area,
      status: person.status,
      isAdmin: person.isAdmin,
      password: '',
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body: StaffSave = {
      displayName: this.form.displayName,
      userName: this.form.userName,
      jobTitle: this.form.jobTitle,
      area: this.form.area,
      status: this.form.status,
      isAdmin: this.form.isAdmin,
      password: this.form.password,
    };

    const request = this.editingUserName === ''
      ? this.administrationService.createStaff(body)
      : this.administrationService.updateStaff(this.editingUserName, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadStaff();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this staff member.');
      },
    });
  }

  deleteClicked(person: StaffResponse): void {
    const sure = confirm('Are you sure you want to delete ' + person.displayName + '?');

    if (!sure) {
      return;
    }

    this.administrationService.deleteStaff(person.userName).subscribe({
      next: () => {
        this.loadStaff();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this staff member.');
      },
    });
  }

  statusClicked(status: string): void {
    this.selectedStatus = status;
  }

  searchTextChanged(event: Event): void {
    const box = event.target as HTMLInputElement;
    this.searchText.set(box.value);
  }

  visibleStaff(): StaffResponse[] {
    const rows = this.staff();
    let statusRows: StaffResponse[];

    if (this.selectedStatus === 'All') {
      statusRows = rows;
    }
    else {
      statusRows = rows.filter(person => person.status === this.selectedStatus);
    }

    return statusRows.filter(person =>
      this.rowMatches([person.displayName, person.userName]));
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

  countByStatus(status: string): number {
    return this.staff().filter(person => person.status === status).length;
  }

  countByArea(area: string): number {
    return this.staff().filter(person => person.area === area).length;
  }

  statusTone(status: string): string {
    if (status === 'Active') {
      return 'green';
    }

    return 'teal';
  }

  roleText(person: StaffResponse): string {
    if (person.isAdmin) {
      return 'Admin';
    }

    return 'Consultant';
  }

  private emptyForm(): StaffSave {
    return {
      displayName: '',
      userName: '',
      jobTitle: '',
      area: 'Claims',
      status: 'Active',
      isAdmin: false,
      password: '',
    };
  }
}

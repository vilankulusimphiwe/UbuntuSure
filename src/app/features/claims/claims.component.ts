import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClaimResponse, ClaimSave, ClaimService } from '../../services/claim.service';
import { CustomerResponse, CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-claims',
  imports: [FormsModule],
  templateUrl: './claims.component.html',
  styleUrl: './claims.component.scss',
})
export class Claims implements OnInit {
  private readonly claimService = inject(ClaimService);
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  selectedStatus = 'All';
  searchText = signal('');
  claims = signal<ClaimResponse[]>([]);
  customerChoices = signal<CustomerResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingNumber = '';
  form: ClaimSave = {
    claimNumber: '',
    customerNumber: '',
    claimType: '',
    status: 'Registered',
    claimDate: '',
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const typed = params.get('q');

      if (typed) {
        this.searchText.set(typed);
      }
    });

    this.loadClaims();
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customerChoices.set(response);
      },
    });
  }

  loadClaims(): void {
    this.claimService.getClaims().subscribe({
      next: (response) => {
        this.claims.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingNumber = '';
    this.formMessage.set('');
    this.form = {
      claimNumber: '',
      customerNumber: this.customerChoices()[0]?.customerNumber ?? '',
      claimType: '',
      status: 'Registered',
      claimDate: '',
    };
    this.formOpen.set(true);
  }

  updateClicked(claim: ClaimResponse): void {
    this.editingNumber = claim.claimNumber;
    this.formMessage.set('');
    this.form = {
      claimNumber: claim.claimNumber,
      customerNumber: this.customerNumberFor(claim.customerName),
      claimType: claim.claimType,
      status: claim.status,
      claimDate: claim.claimDate,
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body = {
      claimNumber: this.form.claimNumber,
      customerNumber: this.form.customerNumber,
      claimType: this.form.claimType,
      status: this.form.status,
      claimDate: this.form.claimDate,
    };

    const request = this.editingNumber === ''
      ? this.claimService.createClaim(body)
      : this.claimService.updateClaim(this.editingNumber, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadClaims();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this claim.');
      },
    });
  }

  deleteClicked(claim: ClaimResponse): void {
    const sure = confirm('Are you sure you want to delete ' + claim.claimNumber + '?');

    if (!sure) {
      return;
    }

    this.claimService.deleteClaim(claim.claimNumber).subscribe({
      next: () => {
        this.loadClaims();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this claim.');
      },
    });
  }

  private customerNumberFor(name: string): string {
    const match = this.customerChoices().find(customer => customer.customerName === name);
    return match?.customerNumber ?? '';
  }

  statusClicked(status: string): void {
    this.selectedStatus = status;
  }

  searchTextChanged(event: Event): void {
    const box = event.target as HTMLInputElement;
    this.searchText.set(box.value);
  }

  visibleClaims(): ClaimResponse[] {
    const rows = this.claims();
    let statusRows: ClaimResponse[];

    if (this.selectedStatus === 'All') {
      statusRows = rows;
    }
    else {
      statusRows = rows.filter(claim => claim.status === this.selectedStatus);
    }

    return statusRows.filter(claim =>
      this.rowMatches([claim.customerName, claim.claimNumber]));
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
    return this.claims().filter(claim => claim.status === status).length;
  }

  statusTone(status: string): string {
    if (status === 'Under Review') {
      return 'amber';
    }

    if (status === 'Approved') {
      return 'green';
    }

    if (status === 'Pending Info') {
      return 'teal';
    }

    return 'blue';
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

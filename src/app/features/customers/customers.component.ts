import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerResponse, CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
})

export class Customers implements OnInit {

  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  // All is selected when the page opens.
  selectedStatus = 'All';
  searchText = signal('');

  // Filled by GET /api/customers. Empty until the API answers.
  // A signal updates the page when the list arrives.
  customers = signal<CustomerResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingNumber = '';
  form: CustomerResponse = {
    customerNumber: '',
    customerName: '',
    customerType: 'Person',
    town: '',
    policyCount: 0,
    status: 'Active',
    memberSince: '',
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const typed = params.get('q');

      if (typed) {
        this.searchText.set(typed);
      }
    });

    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customers.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingNumber = '';
    this.formMessage.set('');
    this.form = {
      customerNumber: '',
      customerName: '',
      customerType: 'Person',
      town: '',
      policyCount: 0,
      status: 'Active',
      memberSince: '',
    };
    this.formOpen.set(true);
  }

  updateClicked(customer: CustomerResponse): void {
    this.editingNumber = customer.customerNumber;
    this.formMessage.set('');
    this.form = {
      customerNumber: customer.customerNumber,
      customerName: customer.customerName,
      customerType: customer.customerType,
      town: customer.town,
      policyCount: customer.policyCount,
      status: customer.status,
      memberSince: customer.memberSince,
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body = {
      customerNumber: this.form.customerNumber,
      customerName: this.form.customerName,
      customerType: this.form.customerType,
      town: this.form.town,
      policyCount: Number(this.form.policyCount),
      status: this.form.status,
      memberSince: this.form.memberSince,
    };

    const request = this.editingNumber === ''
      ? this.customerService.createCustomer(body)
      : this.customerService.updateCustomer(this.editingNumber, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadCustomers();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this customer.');
      },
    });
  }

  deleteClicked(customer: CustomerResponse): void {
    const sure = confirm('Are you sure you want to delete ' + customer.customerName + '?');

    if (!sure) {
      return;
    }

    this.customerService.deleteCustomer(customer.customerNumber).subscribe({
      next: () => {
        this.loadCustomers();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this customer.');
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

  // All shows every row. Active, Prospect, and Lapsed show that status only.
  // The search box then keeps rows whose name or number contains the text.
  visibleCustomers(): CustomerResponse[] {
    const rows = this.customers();
    let statusRows: CustomerResponse[];

    if (this.selectedStatus === 'All') {
      statusRows = rows;
    }
    else {
      statusRows = rows.filter(customer => customer.status === this.selectedStatus);
    }

    return statusRows.filter(customer =>
      this.rowMatches([customer.customerName, customer.customerNumber]));
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

  // How many rows have this status. The cards use this.
  countByStatus(status: string): number {
    return this.customers().filter(customer => customer.status === status).length;
  }

  // Active is green, Prospect is blue, Lapsed is amber.
  statusTone(status: string): string {
    if (status === 'Prospect') {
      return 'blue';
    }

    if (status === 'Lapsed') {
      return 'amber';
    }

    return 'green';
  }

  // The API sends 2024-01-12. The table shows 12 Jan 2024.
  memberSinceText(memberSince: string): string {
    const parts = memberSince.split('-');
    const year = parts[0];
    const monthNumber = Number(parts[1]);
    const day = parts[2];

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[monthNumber - 1];

    return day + ' ' + month + ' ' + year;
  }
}

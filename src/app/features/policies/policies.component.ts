import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerResponse, CustomerService } from '../../services/customer.service';
import { PolicyResponse, PolicySave, PolicyService } from '../../services/policy.service';

@Component({
  selector: 'app-policies',
  imports: [FormsModule],
  templateUrl: './policies.component.html',
  styleUrl: './policies.component.scss',
})
export class Policies implements OnInit {
  private readonly policyService = inject(PolicyService);
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  selectedStatus = 'All';
  searchText = signal('');
  policies = signal<PolicyResponse[]>([]);
  customerChoices = signal<CustomerResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingNumber = '';
  form: PolicySave = {
    policyNumber: '',
    customerNumber: '',
    product: '',
    premium: 0,
    status: 'In force',
    renewalDate: '',
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const typed = params.get('q');

      if (typed) {
        this.searchText.set(typed);
      }
    });

    this.loadPolicies();
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customerChoices.set(response);
      },
    });
  }

  loadPolicies(): void {
    this.policyService.getPolicies().subscribe({
      next: (response) => {
        this.policies.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingNumber = '';
    this.formMessage.set('');
    this.form = {
      policyNumber: '',
      customerNumber: this.customerChoices()[0]?.customerNumber ?? '',
      product: '',
      premium: 0,
      status: 'In force',
      renewalDate: '',
    };
    this.formOpen.set(true);
  }

  updateClicked(policy: PolicyResponse): void {
    this.editingNumber = policy.policyNumber;
    this.formMessage.set('');
    this.form = {
      policyNumber: policy.policyNumber,
      customerNumber: this.customerNumberFor(policy.customerName),
      product: policy.product,
      premium: policy.premium,
      status: policy.status,
      renewalDate: policy.renewalDate,
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body = {
      policyNumber: this.form.policyNumber,
      customerNumber: this.form.customerNumber,
      product: this.form.product,
      premium: Number(this.form.premium),
      status: this.form.status,
      renewalDate: this.form.renewalDate,
    };

    const request = this.editingNumber === ''
      ? this.policyService.createPolicy(body)
      : this.policyService.updatePolicy(this.editingNumber, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadPolicies();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this policy.');
      },
    });
  }

  deleteClicked(policy: PolicyResponse): void {
    const sure = confirm('Are you sure you want to delete ' + policy.policyNumber + '?');

    if (!sure) {
      return;
    }

    this.policyService.deletePolicy(policy.policyNumber).subscribe({
      next: () => {
        this.loadPolicies();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this policy.');
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

  visiblePolicies(): PolicyResponse[] {
    const rows = this.policies();
    let statusRows: PolicyResponse[];

    if (this.selectedStatus === 'All') {
      statusRows = rows;
    }
    else {
      statusRows = rows.filter(policy => policy.status === this.selectedStatus);
    }

    return statusRows.filter(policy =>
      this.rowMatches([policy.customerName, policy.policyNumber]));
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
    return this.policies().filter(policy => policy.status === status).length;
  }

  statusTone(status: string): string {
    if (status === 'In force') {
      return 'green';
    }

    if (status === 'Due soon') {
      return 'amber';
    }

    return 'teal';
  }

  moneyText(amount: number): string {
    const rounded = Math.round(amount);
    const text = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return 'R ' + text;
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

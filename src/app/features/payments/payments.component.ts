import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentResponse, PaymentSave, PaymentService } from '../../services/payment.service';
import { PolicyResponse, PolicyService } from '../../services/policy.service';

@Component({
  selector: 'app-payments',
  imports: [FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.scss',
})
export class Payments implements OnInit {
  private readonly paymentService = inject(PaymentService);
  private readonly policyService = inject(PolicyService);
  private readonly route = inject(ActivatedRoute);

  selectedStatus = 'All';
  searchText = signal('');
  payments = signal<PaymentResponse[]>([]);
  policyChoices = signal<PolicyResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingNumber = '';
  form: PaymentSave = {
    receiptNumber: '',
    policyNumber: '',
    amount: 0,
    method: 'Debit order',
    status: 'Paid',
    paymentDate: '',
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const typed = params.get('q');

      if (typed) {
        this.searchText.set(typed);
      }
    });

    this.loadPayments();
    this.policyService.getPolicies().subscribe({
      next: (response) => {
        this.policyChoices.set(response);
      },
    });
  }

  loadPayments(): void {
    this.paymentService.getPayments().subscribe({
      next: (response) => {
        this.payments.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingNumber = '';
    this.formMessage.set('');
    this.form = {
      receiptNumber: '',
      policyNumber: this.policyChoices()[0]?.policyNumber ?? '',
      amount: 0,
      method: 'Debit order',
      status: 'Paid',
      paymentDate: '',
    };
    this.formOpen.set(true);
  }

  updateClicked(payment: PaymentResponse): void {
    this.editingNumber = payment.receiptNumber;
    this.formMessage.set('');
    this.form = {
      receiptNumber: payment.receiptNumber,
      policyNumber: payment.policyNumber,
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      paymentDate: payment.paymentDate,
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body = {
      receiptNumber: this.form.receiptNumber,
      policyNumber: this.form.policyNumber,
      amount: Number(this.form.amount),
      method: this.form.method,
      status: this.form.status,
      paymentDate: this.form.paymentDate,
    };

    const request = this.editingNumber === ''
      ? this.paymentService.createPayment(body)
      : this.paymentService.updatePayment(this.editingNumber, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadPayments();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this payment.');
      },
    });
  }

  deleteClicked(payment: PaymentResponse): void {
    const sure = confirm('Are you sure you want to delete ' + payment.receiptNumber + '?');

    if (!sure) {
      return;
    }

    this.paymentService.deletePayment(payment.receiptNumber).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this payment.');
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

  visiblePayments(): PaymentResponse[] {
    const rows = this.payments();
    let statusRows: PaymentResponse[];

    if (this.selectedStatus === 'All') {
      statusRows = rows;
    }
    else {
      statusRows = rows.filter(payment => payment.status === this.selectedStatus);
    }

    return statusRows.filter(payment =>
      this.rowMatches([payment.customerName, payment.receiptNumber, payment.policyNumber]));
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
    return this.payments().filter(payment => payment.status === status).length;
  }

  statusTone(status: string): string {
    if (status === 'Paid') {
      return 'green';
    }

    if (status === 'Pending') {
      return 'amber';
    }

    return 'red';
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

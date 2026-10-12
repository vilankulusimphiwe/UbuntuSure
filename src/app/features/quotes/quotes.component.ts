import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CustomerResponse, CustomerService } from '../../services/customer.service';
import { QuoteResponse, QuoteSave, QuoteService } from '../../services/quote.service';

@Component({
  selector: 'app-quotes',
  imports: [FormsModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss',
})
export class Quotes implements OnInit {
  private readonly quoteService = inject(QuoteService);
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);

  selectedStatus = 'All';
  searchText = signal('');
  quotes = signal<QuoteResponse[]>([]);
  customerChoices = signal<CustomerResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingNumber = '';
  form: QuoteSave = {
    quoteNumber: '',
    customerNumber: '',
    product: '',
    premium: 0,
    status: 'Pending',
    quoteDate: '',
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const typed = params.get('q');

      if (typed) {
        this.searchText.set(typed);
      }
    });

    this.loadQuotes();
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customerChoices.set(response);
      },
    });
  }

  loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (response) => {
        this.quotes.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingNumber = '';
    this.formMessage.set('');
    this.form = {
      quoteNumber: '',
      customerNumber: this.customerChoices()[0]?.customerNumber ?? '',
      product: '',
      premium: 0,
      status: 'Pending',
      quoteDate: '',
    };
    this.formOpen.set(true);
  }

  updateClicked(quote: QuoteResponse): void {
    this.editingNumber = quote.quoteNumber;
    this.formMessage.set('');
    this.form = {
      quoteNumber: quote.quoteNumber,
      customerNumber: this.customerNumberFor(quote.customerName),
      product: quote.product,
      premium: quote.premium,
      status: quote.status,
      quoteDate: quote.quoteDate,
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body = {
      quoteNumber: this.form.quoteNumber,
      customerNumber: this.form.customerNumber,
      product: this.form.product,
      premium: Number(this.form.premium),
      status: this.form.status,
      quoteDate: this.form.quoteDate,
    };

    const request = this.editingNumber === ''
      ? this.quoteService.createQuote(body)
      : this.quoteService.updateQuote(this.editingNumber, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadQuotes();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this quote.');
      },
    });
  }

  deleteClicked(quote: QuoteResponse): void {
    const sure = confirm('Are you sure you want to delete ' + quote.quoteNumber + '?');

    if (!sure) {
      return;
    }

    this.quoteService.deleteQuote(quote.quoteNumber).subscribe({
      next: () => {
        this.loadQuotes();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this quote.');
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

  visibleQuotes(): QuoteResponse[] {
    const rows = this.quotes();
    let statusRows: QuoteResponse[];

    if (this.selectedStatus === 'All') {
      statusRows = rows;
    }
    else {
      statusRows = rows.filter(quote => quote.status === this.selectedStatus);
    }

    return statusRows.filter(quote =>
      this.rowMatches([quote.customerName, quote.quoteNumber]));
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
    return this.quotes().filter(quote => quote.status === status).length;
  }

  statusTone(status: string): string {
    if (status === 'Pending') {
      return 'amber';
    }

    if (status === 'Accepted') {
      return 'green';
    }

    if (status === 'Quoted') {
      return 'blue';
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

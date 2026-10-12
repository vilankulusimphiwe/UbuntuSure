import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ClaimService } from '../../services/claim.service';
import { LoginService } from '../../services/login.service';
import { PaymentService } from '../../services/payment.service';
import { PolicyService } from '../../services/policy.service';
import { QuoteService } from '../../services/quote.service';
import { SearchMatch, SearchService } from '../../services/search.service';

interface Notice {
  title: string;
  detail: string;
  kind: string;
  link: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class Header implements OnInit {
  private readonly loginService = inject(LoginService);
  private readonly searchService = inject(SearchService);
  private readonly quoteService = inject(QuoteService);
  private readonly policyService = inject(PolicyService);
  private readonly paymentService = inject(PaymentService);
  private readonly claimService = inject(ClaimService);
  private readonly router = inject(Router);

  // Work that still needs a person. The red number is this list's length.
  notices = signal<Notice[]>([]);
  showNotices = signal(false);

  ngOnInit(): void {
    this.loadNotices();
  }

  // The employee saved at sign-in. Read it each time the header draws.
  headerUser() {
    return this.loginService.loginResponse;
  }

  initials(): string {
    const headerUser = this.headerUser();

    // "Sarah Nkosi", or "" when nobody is signed in.
    const name = headerUser?.displayName ?? '';

    // ["Sarah", "Nkosi"]. filter drops empty pieces from a double space.
    const words = name.split(' ').filter((part) => part.length > 0);

    // First two words only, so a long name still becomes two letters.
    const firstTwoWords = words.slice(0, 2);

    // First letter of each word, in capitals: ["S", "N"].
    const letters = firstTwoWords.map((part) => part[0]?.toUpperCase() ?? '');

    // "SN"
    return letters.join('');
  }

  // Tell the layout that the header menu icon was clicked.
    @Output() menuClick = new EventEmitter<void>();

    menuClicked() {
    this.menuClick.emit();
  }

  // The words currently typed in the header search box.
  searchText = '';

  // Matches from GET /api/search. Shown after Enter.
  matches = signal<SearchMatch[]>([]);
  showResults = signal(false);

  // Copy the box text into searchText each time a letter changes.
  searchTextChanged(event: Event): void {
    const box = event.target as HTMLInputElement;
    this.searchText = box.value;
    this.showResults.set(false);
  }

  // Ask the API for customers, policies, and claims that contain the text.
  search(): void {
    const typed = this.searchText.trim();

    if (typed === '') {
      this.matches.set([]);
      this.showResults.set(false);
      return;
    }

    this.showNotices.set(false);
    this.searchService.search(typed).subscribe({
      next: (response) => {
        this.matches.set(response);
        this.showResults.set(true);
      },
    });
  }

  openMatch(match: SearchMatch): void {
    this.showResults.set(false);
    this.showNotices.set(false);
    void this.router.navigate([match.link], { queryParams: { q: match.detail } });
  }

  // Open or close the list under the bell.
  bellClicked(): void {
    this.showResults.set(false);
    this.showNotices.set(!this.showNotices());
    this.loadNotices();
  }

  openNotice(notice: Notice): void {
    this.showNotices.set(false);
    void this.router.navigate([notice.link], { queryParams: { q: notice.detail } });
  }

  // Pending quotes, policies due soon, payments still open or failed,
  // and claims that are under review or waiting for information.
  private loadNotices(): void {
    forkJoin({
      quotes: this.quoteService.getQuotes().pipe(catchError(() => of([]))),
      policies: this.policyService.getPolicies().pipe(catchError(() => of([]))),
      payments: this.paymentService.getPayments().pipe(catchError(() => of([]))),
      claims: this.claimService.getClaims().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (lists) => {
        const notices: Notice[] = [];

        for (const quote of lists.quotes) {
          if (quote.status === 'Pending') {
            notices.push({
              title: quote.customerName + ' · ' + quote.product,
              detail: quote.quoteNumber,
              kind: 'Pending quote',
              link: '/quotes',
            });
          }
        }

        for (const policy of lists.policies) {
          if (policy.status === 'Due soon') {
            notices.push({
              title: policy.customerName + ' · ' + policy.product,
              detail: policy.policyNumber,
              kind: 'Policy due soon',
              link: '/policies',
            });
          }
        }

        for (const payment of lists.payments) {
          if (payment.status === 'Pending' || payment.status === 'Failed') {
            notices.push({
              title: payment.customerName + ' · ' + payment.status,
              detail: payment.receiptNumber,
              kind: 'Payment',
              link: '/payments',
            });
          }
        }

        for (const claim of lists.claims) {
          if (claim.status === 'Under Review' || claim.status === 'Pending Info') {
            notices.push({
              title: claim.customerName + ' · ' + claim.claimType,
              detail: claim.claimNumber,
              kind: claim.status,
              link: '/claims',
            });
          }
        }

        this.notices.set(notices);
      },
    });
  }
}

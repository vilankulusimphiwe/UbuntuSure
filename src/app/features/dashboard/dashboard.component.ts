import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class Dashboard {

  private readonly loginService = inject(LoginService);

  // "Sarah" from the employee saved at sign-in.
  firstName(): string {

    const FullLoginResponse = this.loginService.loginResponse;
    const OnlyFirstname = FullLoginResponse?.firstName ?? '';
    return OnlyFirstname;
  }

  today():string{

    const today = new Date();

    const dateText = today.toLocaleDateString('en-ZA', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',});

  return dateText;

  }

  // Graph and bar
  // Sample counts for the four boxes. Real numbers will come from SQL later.
  cards = [
    {
      label: 'Active Policies',
      value: '12,421',
      change: '+5%',
      note: 'vs last month',
      icon: 'description',
      tone: 'blue',
    },
    {
      label: 'Open Claims',
      value: '248',
      change: '+12%',
      note: 'vs last month',
      icon: 'directions_car',
      tone: 'red',
    },
    {
      label: 'Pending Quotes',
      value: '73',
      change: '-8%',
      note: 'vs last month',
      icon: 'request_quote',
      tone: 'green',
    },
    {
      label: 'Customers',
      value: '1,892',
      change: '+3%',
      note: 'vs last month',
      icon: 'people',
      tone: 'yellow',
    },
  ];


  // One slice of the ring per status. color is also the dot beside the name.
  claimStatuses = [
    { label: 'Registered', count: 45, color: '#1f6fb5' },
    { label: 'Under Review', count: 78, color: '#3db5c8' },
    { label: 'Assessment', count: 62, color: '#5cb85c' },
    { label: 'Pending Info', count: 28, color: '#c5d045' },
    { label: 'Approved', count: 24, color: '#f0a202' },
    { label: 'Repudiated', count: 11, color: '#e5534b' },
  ];

  // Add every count. 45 + 78 + 62 + 28 + 24 + 11 = 248.
  openClaimsTotal(): number {
    let total = 0;

    for (const status of this.claimStatuses) {
      total = total + status.count;
    }

    return total;
  }

  // Paint the ring. Each status owns a slice equal to its share of 248.
  ringBackground(): string {
    const total = this.openClaimsTotal();
    let start = 0;
    const slices: string[] = [];

    for (const status of this.claimStatuses) {
      const share = (status.count / total) * 100;
      const end = start + share;
      const oneSlice = status.color + ' ' + start + '% ' + end + '%';

      slices.push(oneSlice);
      start = end;
    }

    return 'conic-gradient(' + slices.join(', ') + ')';
  }

// Sample policy counts. 8,000 is the top line of the chart.
policyProducts = [
  { label: 'Motor', value: 6500 },
  { label: 'Home Buildings', value: 3200 },
  { label: 'Home Contents', value: 2100 },
  { label: 'Portable Possessions', value: 1500 },
  { label: 'Other', value: 800 },
];

// 6500 of 8000 becomes "81%". That percent is the bar height.
barHeight(value: number): string {
  const topOfChart = 8000;
  const percent = Math.round((value / topOfChart) * 100);

  return percent + '%';
}

// Sample rows for the Recent Claims table. Real rows will come from SQL later.
// number, customer, type, status, and date are the five columns.
// tone is only the pill colour: yellow, blue, orange, or green.
recentClaims = [
  { number: 'CLM-2026-001245', customer: 'Thabo Molefe', type: 'Motor Accident', status: 'Under Review', tone: 'yellow', date: '02 Oct 2026' },
  { number: 'CLM-2026-001240', customer: 'Nomsa Dlamini', type: 'Theft', status: 'Assessment', tone: 'blue', date: '02 Oct 2026' },
  { number: 'CLM-2026-001238', customer: 'Johan Botha', type: 'Water Damage', status: 'Pending Info', tone: 'orange', date: '01 Oct 2026' },
  { number: 'CLM-2026-001230', customer: 'Lerato Mkhize', type: 'Accidental Damage', status: 'Approved', tone: 'green', date: '01 Oct 2026' },
  { number: 'CLM-2026-001201', customer: 'Sipho Nkosi', type: 'Motor Accident', status: 'Registered', tone: 'blue', date: '30 Sep 2026' },
];

// Sample rows for the Recent Quotes table. Same idea as recentClaims.
// product is the cover they asked for. tone colours the status pill.
recentQuotes = [
  { number: 'QT-2026-00789', customer: 'Thabo Molefe', product: 'Motor', status: 'Pending', tone: 'yellow', date: '03 Oct 2026' },
  { number: 'QT-2026-00785', customer: 'Candice Peters', product: 'Home', status: 'Pending', tone: 'yellow', date: '02 Oct 2026' },
  { number: 'QT-2026-00780', customer: 'Johan Botha', product: 'Motor', status: 'Accepted', tone: 'green', date: '02 Oct 2026' },
  { number: 'QT-2026-00776', customer: 'Lerato Mkhize', product: 'Contents', status: 'Quoted', tone: 'blue', date: '01 Oct 2026' },
  { number: 'QT-2026-00771', customer: 'Sipho Nkosi', product: 'Motor', status: 'Expired', tone: 'red', date: '30 Sep 2026' },
];
}



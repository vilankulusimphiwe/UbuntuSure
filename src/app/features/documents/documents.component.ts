import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerResponse, CustomerService } from '../../services/customer.service';
import { DocumentResponse, DocumentSave, DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-documents',
  imports: [FormsModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class Documents implements OnInit {
  private readonly documentService = inject(DocumentService);
  private readonly customerService = inject(CustomerService);

  selectedType = 'All';
  searchText = signal('');
  documents = signal<DocumentResponse[]>([]);
  customerChoices = signal<CustomerResponse[]>([]);
  formOpen = signal(false);
  formMessage = signal('');
  editingId = 0;
  form: DocumentSave = {
    documentName: '',
    customerNumber: '',
    documentType: 'Policy schedule',
    linkedTo: '',
    status: 'Filed',
    addedOn: '',
  };

  ngOnInit(): void {
    this.loadDocuments();
    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customerChoices.set(response);
      },
    });
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe({
      next: (response) => {
        this.documents.set(response);
      },
    });
  }

  newClicked(): void {
    this.editingId = 0;
    this.formMessage.set('');
    this.form = {
      documentName: '',
      customerNumber: this.customerChoices()[0]?.customerNumber ?? '',
      documentType: 'Policy schedule',
      linkedTo: '',
      status: 'Filed',
      addedOn: '',
    };
    this.formOpen.set(true);
  }

  updateClicked(document: DocumentResponse): void {
    this.editingId = document.documentId;
    this.formMessage.set('');
    this.form = {
      documentName: document.documentName,
      customerNumber: this.customerNumberFor(document.customerName),
      documentType: document.documentType,
      linkedTo: document.linkedTo,
      status: document.status,
      addedOn: document.addedOn,
    };
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  saveClicked(): void {
    const body = {
      documentName: this.form.documentName,
      customerNumber: this.form.customerNumber,
      documentType: this.form.documentType,
      linkedTo: this.form.linkedTo,
      status: this.form.status,
      addedOn: this.form.addedOn,
    };

    const request = this.editingId === 0
      ? this.documentService.createDocument(body)
      : this.documentService.updateDocument(this.editingId, body);

    request.subscribe({
      next: () => {
        this.formOpen.set(false);
        this.loadDocuments();
      },
      error: (err) => {
        this.formMessage.set(err.error?.message ?? 'Could not save this document.');
      },
    });
  }

  deleteClicked(document: DocumentResponse): void {
    const sure = confirm('Are you sure you want to delete ' + document.documentName + '?');

    if (!sure) {
      return;
    }

    this.documentService.deleteDocument(document.documentId).subscribe({
      next: () => {
        this.loadDocuments();
      },
      error: (err) => {
        alert(err.error?.message ?? 'Could not delete this document.');
      },
    });
  }

  private customerNumberFor(name: string): string {
    const match = this.customerChoices().find(customer => customer.customerName === name);
    return match?.customerNumber ?? '';
  }

  typeClicked(documentType: string): void {
    this.selectedType = documentType;
  }

  searchTextChanged(event: Event): void {
    const box = event.target as HTMLInputElement;
    this.searchText.set(box.value);
  }

  visibleDocuments(): DocumentResponse[] {
    const rows = this.documents();
    let typeRows: DocumentResponse[];

    if (this.selectedType === 'All') {
      typeRows = rows;
    }
    else {
      typeRows = rows.filter(document => document.documentType === this.selectedType);
    }

    return typeRows.filter(document =>
      this.rowMatches([document.documentName, document.customerName, document.linkedTo]));
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
    return this.documents().filter(document => document.status === status).length;
  }

  statusTone(status: string): string {
    if (status === 'Filed') {
      return 'green';
    }

    if (status === 'Waiting') {
      return 'amber';
    }

    return 'teal';
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

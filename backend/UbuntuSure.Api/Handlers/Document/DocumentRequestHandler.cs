using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Document;

public class DocumentRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public DocumentRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<DocumentResponse> Handle(DocumentRequest request)
    {
        List<Models.Document> documents = _db.Documents.OrderBy(document => document.DocumentId).ToList();
        List<Models.Customer> customers = _db.Customers.ToList();

        List<DocumentResponse> response = new List<DocumentResponse>();

        foreach (Models.Document document in documents)
        {
            DocumentResponse row = new DocumentResponse();
            row.DocumentId = document.DocumentId;
            row.DocumentName = document.DocumentName;
            row.CustomerName = FindCustomerName(customers, document.CustomerId);
            row.DocumentType = document.DocumentType;
            row.LinkedTo = document.LinkedTo;
            row.Status = document.Status;
            row.AddedOn = document.AddedOn.ToString("yyyy-MM-dd");

            response.Add(row);
        }

        return response;
    }

    private string FindCustomerName(List<Models.Customer> customers, int customerId)
    {
        foreach (Models.Customer customer in customers)
        {
            if (customer.CustomerId == customerId)
            {
                return customer.CustomerName;
            }
        }

        return string.Empty;
    }

    public SaveResult Create(DocumentSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DocumentName) || string.IsNullOrWhiteSpace(request.LinkedTo))
        {
            return SaveResult.Fail("Enter the document name and what it is linked to.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (!DateOnly.TryParse(request.AddedOn, out DateOnly addedOn))
        {
            return SaveResult.Fail("Enter the date added.");
        }

        Models.Document row = new Models.Document();
        row.DocumentName = request.DocumentName.Trim();
        row.CustomerId = customer.CustomerId;
        row.DocumentType = request.DocumentType.Trim();
        row.LinkedTo = request.LinkedTo.Trim();
        row.Status = request.Status.Trim();
        row.AddedOn = addedOn;

        _db.Documents.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(int documentId, DocumentSaveRequest request)
    {
        Models.Document? row = _db.Documents.SingleOrDefault(document => document.DocumentId == documentId);

        if (row is null)
        {
            return SaveResult.Fail("This document was not found.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (string.IsNullOrWhiteSpace(request.DocumentName) || string.IsNullOrWhiteSpace(request.LinkedTo))
        {
            return SaveResult.Fail("Enter the document name and what it is linked to.");
        }

        if (!DateOnly.TryParse(request.AddedOn, out DateOnly addedOn))
        {
            return SaveResult.Fail("Enter the date added.");
        }

        row.DocumentName = request.DocumentName.Trim();
        row.CustomerId = customer.CustomerId;
        row.DocumentType = request.DocumentType.Trim();
        row.LinkedTo = request.LinkedTo.Trim();
        row.Status = request.Status.Trim();
        row.AddedOn = addedOn;

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(int documentId)
    {
        Models.Document? row = _db.Documents.SingleOrDefault(document => document.DocumentId == documentId);

        if (row is null)
        {
            return SaveResult.Fail("This document was not found.");
        }

        _db.Documents.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    private Models.Customer? FindCustomer(string customerNumber)
    {
        return _db.Customers.SingleOrDefault(customer => customer.CustomerNumber == customerNumber);
    }
}

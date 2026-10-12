using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Customer;

public class CustomerRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public CustomerRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<CustomerResponse> Handle(CustomerRequest request)
    {
        List<Models.Customer> rows = _db.Customers.ToList();

        List<CustomerResponse> response = new List<CustomerResponse>();

        foreach (Models.Customer row in rows)
        {
            CustomerResponse customer = new CustomerResponse();
            customer.CustomerNumber = row.CustomerNumber;
            customer.CustomerName = row.CustomerName;
            customer.CustomerType = row.CustomerType;
            customer.Town = row.Town;
            customer.PolicyCount = row.PolicyCount;
            customer.Status = row.Status;
            customer.MemberSince = row.MemberSince.ToString("yyyy-MM-dd");

            response.Add(customer);
        }

        return response;
    }

    public SaveResult Create(CustomerSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CustomerNumber) || string.IsNullOrWhiteSpace(request.CustomerName))
        {
            return SaveResult.Fail("Enter the customer number and name.");
        }

        string number = request.CustomerNumber.Trim();
        bool exists = _db.Customers.Any(customer => customer.CustomerNumber == number);

        if (exists)
        {
            return SaveResult.Fail("That customer number is already used.");
        }

        if (!DateOnly.TryParse(request.MemberSince, out DateOnly memberSince))
        {
            return SaveResult.Fail("Enter the member since date.");
        }

        Models.Customer row = new Models.Customer();
        row.CustomerNumber = number;
        row.CustomerName = request.CustomerName.Trim();
        row.CustomerType = request.CustomerType.Trim();
        row.Town = request.Town.Trim();
        row.PolicyCount = request.PolicyCount;
        row.Status = request.Status.Trim();
        row.MemberSince = memberSince;

        _db.Customers.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(string customerNumber, CustomerSaveRequest request)
    {
        Models.Customer? row = _db.Customers.SingleOrDefault(customer => customer.CustomerNumber == customerNumber);

        if (row is null)
        {
            return SaveResult.Fail("This customer was not found.");
        }

        if (string.IsNullOrWhiteSpace(request.CustomerName))
        {
            return SaveResult.Fail("Enter the customer name.");
        }

        if (!DateOnly.TryParse(request.MemberSince, out DateOnly memberSince))
        {
            return SaveResult.Fail("Enter the member since date.");
        }

        row.CustomerName = request.CustomerName.Trim();
        row.CustomerType = request.CustomerType.Trim();
        row.Town = request.Town.Trim();
        row.PolicyCount = request.PolicyCount;
        row.Status = request.Status.Trim();
        row.MemberSince = memberSince;

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(string customerNumber)
    {
        Models.Customer? row = _db.Customers.SingleOrDefault(customer => customer.CustomerNumber == customerNumber);

        if (row is null)
        {
            return SaveResult.Fail("This customer was not found.");
        }

        bool hasQuotes = _db.Quotes.Any(quote => quote.CustomerId == row.CustomerId);
        bool hasPolicies = _db.Policies.Any(policy => policy.CustomerId == row.CustomerId);
        bool hasClaims = _db.Claims.Any(claim => claim.CustomerId == row.CustomerId);
        bool hasPayments = _db.Payments.Any(payment => payment.CustomerId == row.CustomerId);
        bool hasDocuments = _db.Documents.Any(document => document.CustomerId == row.CustomerId);

        if (hasQuotes || hasPolicies || hasClaims || hasPayments || hasDocuments)
        {
            return SaveResult.Fail("This customer still has quotes, policies, claims, payments, or documents.");
        }

        _db.Customers.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }
}

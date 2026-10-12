using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Policy;

public class PolicyRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public PolicyRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<PolicyResponse> Handle(PolicyRequest request)
    {
        List<Models.Policy> policies = _db.Policies.OrderBy(policy => policy.PolicyId).ToList();
        List<Models.Customer> customers = _db.Customers.ToList();

        List<PolicyResponse> response = new List<PolicyResponse>();

        foreach (Models.Policy policy in policies)
        {
            PolicyResponse row = new PolicyResponse();
            row.PolicyNumber = policy.PolicyNumber;
            row.CustomerName = FindCustomerName(customers, policy.CustomerId);
            row.Product = policy.Product;
            row.Premium = policy.Premium;
            row.Status = policy.Status;
            row.RenewalDate = policy.RenewalDate.ToString("yyyy-MM-dd");

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

    public SaveResult Create(PolicySaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PolicyNumber) || string.IsNullOrWhiteSpace(request.Product))
        {
            return SaveResult.Fail("Enter the policy number and product.");
        }

        string number = request.PolicyNumber.Trim();
        bool exists = _db.Policies.Any(policy => policy.PolicyNumber == number);

        if (exists)
        {
            return SaveResult.Fail("That policy number is already used.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (!DateOnly.TryParse(request.RenewalDate, out DateOnly renewalDate))
        {
            return SaveResult.Fail("Enter the renewal date.");
        }

        Models.Policy row = new Models.Policy();
        row.PolicyNumber = number;
        row.CustomerId = customer.CustomerId;
        row.Product = request.Product.Trim();
        row.Premium = request.Premium;
        row.Status = request.Status.Trim();
        row.RenewalDate = renewalDate;

        _db.Policies.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(string policyNumber, PolicySaveRequest request)
    {
        Models.Policy? row = _db.Policies.SingleOrDefault(policy => policy.PolicyNumber == policyNumber);

        if (row is null)
        {
            return SaveResult.Fail("This policy was not found.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (string.IsNullOrWhiteSpace(request.Product))
        {
            return SaveResult.Fail("Enter the product.");
        }

        if (!DateOnly.TryParse(request.RenewalDate, out DateOnly renewalDate))
        {
            return SaveResult.Fail("Enter the renewal date.");
        }

        row.CustomerId = customer.CustomerId;
        row.Product = request.Product.Trim();
        row.Premium = request.Premium;
        row.Status = request.Status.Trim();
        row.RenewalDate = renewalDate;

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(string policyNumber)
    {
        Models.Policy? row = _db.Policies.SingleOrDefault(policy => policy.PolicyNumber == policyNumber);

        if (row is null)
        {
            return SaveResult.Fail("This policy was not found.");
        }

        bool hasPayments = _db.Payments.Any(payment => payment.PolicyId == row.PolicyId);

        if (hasPayments)
        {
            return SaveResult.Fail("This policy still has payments.");
        }

        _db.Policies.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    private Models.Customer? FindCustomer(string customerNumber)
    {
        return _db.Customers.SingleOrDefault(customer => customer.CustomerNumber == customerNumber);
    }
}

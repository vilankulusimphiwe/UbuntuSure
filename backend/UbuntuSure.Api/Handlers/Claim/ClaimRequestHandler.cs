using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Claim;

public class ClaimRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public ClaimRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<ClaimResponse> Handle(ClaimRequest request)
    {
        List<Models.Claim> claims = _db.Claims.OrderBy(claim => claim.ClaimId).ToList();
        List<Models.Customer> customers = _db.Customers.ToList();

        List<ClaimResponse> response = new List<ClaimResponse>();

        foreach (Models.Claim claim in claims)
        {
            ClaimResponse row = new ClaimResponse();
            row.ClaimNumber = claim.ClaimNumber;
            row.CustomerName = FindCustomerName(customers, claim.CustomerId);
            row.ClaimType = claim.ClaimType;
            row.Status = claim.Status;
            row.ClaimDate = claim.ClaimDate.ToString("yyyy-MM-dd");

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

    public SaveResult Create(ClaimSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ClaimNumber) || string.IsNullOrWhiteSpace(request.ClaimType))
        {
            return SaveResult.Fail("Enter the claim number and type.");
        }

        string number = request.ClaimNumber.Trim();
        bool exists = _db.Claims.Any(claim => claim.ClaimNumber == number);

        if (exists)
        {
            return SaveResult.Fail("That claim number is already used.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (!DateOnly.TryParse(request.ClaimDate, out DateOnly claimDate))
        {
            return SaveResult.Fail("Enter the claim date.");
        }

        Models.Claim row = new Models.Claim();
        row.ClaimNumber = number;
        row.CustomerId = customer.CustomerId;
        row.ClaimType = request.ClaimType.Trim();
        row.Status = request.Status.Trim();
        row.ClaimDate = claimDate;

        _db.Claims.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(string claimNumber, ClaimSaveRequest request)
    {
        Models.Claim? row = _db.Claims.SingleOrDefault(claim => claim.ClaimNumber == claimNumber);

        if (row is null)
        {
            return SaveResult.Fail("This claim was not found.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (string.IsNullOrWhiteSpace(request.ClaimType))
        {
            return SaveResult.Fail("Enter the claim type.");
        }

        if (!DateOnly.TryParse(request.ClaimDate, out DateOnly claimDate))
        {
            return SaveResult.Fail("Enter the claim date.");
        }

        row.CustomerId = customer.CustomerId;
        row.ClaimType = request.ClaimType.Trim();
        row.Status = request.Status.Trim();
        row.ClaimDate = claimDate;

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(string claimNumber)
    {
        Models.Claim? row = _db.Claims.SingleOrDefault(claim => claim.ClaimNumber == claimNumber);

        if (row is null)
        {
            return SaveResult.Fail("This claim was not found.");
        }

        _db.Claims.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    private Models.Customer? FindCustomer(string customerNumber)
    {
        return _db.Customers.SingleOrDefault(customer => customer.CustomerNumber == customerNumber);
    }
}

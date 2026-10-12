using backend.UbuntuSure.Api.Data;

namespace backend.UbuntuSure.Api.Handlers.Search;

public class SearchRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public SearchRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<SearchResponse> Handle(SearchRequest request)
    {
        string typed = request.Text.Trim();
        List<SearchResponse> response = new List<SearchResponse>();

        if (typed == string.Empty)
        {
            return response;
        }

        List<Models.Customer> customers = _db.Customers.OrderBy(customer => customer.CustomerId).ToList();
        List<Models.Policy> policies = _db.Policies.OrderBy(policy => policy.PolicyId).ToList();
        List<Models.Claim> claims = _db.Claims.OrderBy(claim => claim.ClaimId).ToList();

        foreach (Models.Customer customer in customers)
        {
            if (Contains(customer.CustomerName, typed) || Contains(customer.CustomerNumber, typed))
            {
                SearchResponse row = new SearchResponse();
                row.Kind = "Customer";
                row.Title = customer.CustomerName;
                row.Detail = customer.CustomerNumber;
                row.Link = "/customers";
                response.Add(row);
            }
        }

        foreach (Models.Policy policy in policies)
        {
            string customerName = FindCustomerName(customers, policy.CustomerId);

            if (Contains(customerName, typed) || Contains(policy.PolicyNumber, typed))
            {
                SearchResponse row = new SearchResponse();
                row.Kind = "Policy";
                row.Title = customerName;
                row.Detail = policy.PolicyNumber;
                row.Link = "/policies";
                response.Add(row);
            }
        }

        foreach (Models.Claim claim in claims)
        {
            string customerName = FindCustomerName(customers, claim.CustomerId);

            if (Contains(customerName, typed) || Contains(claim.ClaimNumber, typed))
            {
                SearchResponse row = new SearchResponse();
                row.Kind = "Claim";
                row.Title = customerName;
                row.Detail = claim.ClaimNumber;
                row.Link = "/claims";
                response.Add(row);
            }
        }

        return response;
    }

    private bool Contains(string value, string typed)
    {
        return value.Contains(typed, StringComparison.OrdinalIgnoreCase);
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
}

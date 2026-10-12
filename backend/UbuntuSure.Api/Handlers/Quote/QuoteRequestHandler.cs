using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Quote;

public class QuoteRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public QuoteRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<QuoteResponse> Handle(QuoteRequest request)
    {
        List<Models.Quote> quotes = _db.Quotes.OrderBy(quote => quote.QuoteId).ToList();
        List<Models.Customer> customers = _db.Customers.ToList();

        List<QuoteResponse> response = new List<QuoteResponse>();

        foreach (Models.Quote quote in quotes)
        {
            QuoteResponse row = new QuoteResponse();
            row.QuoteNumber = quote.QuoteNumber;
            row.CustomerName = FindCustomerName(customers, quote.CustomerId);
            row.Product = quote.Product;
            row.Premium = quote.Premium;
            row.Status = quote.Status;
            row.QuoteDate = quote.QuoteDate.ToString("yyyy-MM-dd");

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

    public SaveResult Create(QuoteSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.QuoteNumber) || string.IsNullOrWhiteSpace(request.Product))
        {
            return SaveResult.Fail("Enter the quote number and product.");
        }

        string number = request.QuoteNumber.Trim();
        bool exists = _db.Quotes.Any(quote => quote.QuoteNumber == number);

        if (exists)
        {
            return SaveResult.Fail("That quote number is already used.");
        }

        Models.Customer? customer = FindCustomer(request.CustomerNumber);

        if (customer is null)
        {
            return SaveResult.Fail("Choose a customer.");
        }

        if (!DateOnly.TryParse(request.QuoteDate, out DateOnly quoteDate))
        {
            return SaveResult.Fail("Enter the quote date.");
        }

        Models.Quote row = new Models.Quote();
        row.QuoteNumber = number;
        row.CustomerId = customer.CustomerId;
        row.Product = request.Product.Trim();
        row.Premium = request.Premium;
        row.Status = request.Status.Trim();
        row.QuoteDate = quoteDate;

        _db.Quotes.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(string quoteNumber, QuoteSaveRequest request)
    {
        Models.Quote? row = _db.Quotes.SingleOrDefault(quote => quote.QuoteNumber == quoteNumber);

        if (row is null)
        {
            return SaveResult.Fail("This quote was not found.");
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

        if (!DateOnly.TryParse(request.QuoteDate, out DateOnly quoteDate))
        {
            return SaveResult.Fail("Enter the quote date.");
        }

        row.CustomerId = customer.CustomerId;
        row.Product = request.Product.Trim();
        row.Premium = request.Premium;
        row.Status = request.Status.Trim();
        row.QuoteDate = quoteDate;

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(string quoteNumber)
    {
        Models.Quote? row = _db.Quotes.SingleOrDefault(quote => quote.QuoteNumber == quoteNumber);

        if (row is null)
        {
            return SaveResult.Fail("This quote was not found.");
        }

        _db.Quotes.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    private Models.Customer? FindCustomer(string customerNumber)
    {
        return _db.Customers.SingleOrDefault(customer => customer.CustomerNumber == customerNumber);
    }
}

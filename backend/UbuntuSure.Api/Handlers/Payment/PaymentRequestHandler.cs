using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Payment;

public class PaymentRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public PaymentRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<PaymentResponse> Handle(PaymentRequest request)
    {
        List<Models.Payment> payments = _db.Payments.OrderBy(payment => payment.PaymentId).ToList();
        List<Models.Customer> customers = _db.Customers.ToList();
        List<Models.Policy> policies = _db.Policies.ToList();

        List<PaymentResponse> response = new List<PaymentResponse>();

        foreach (Models.Payment payment in payments)
        {
            PaymentResponse row = new PaymentResponse();
            row.ReceiptNumber = payment.ReceiptNumber;
            row.CustomerName = FindCustomerName(customers, payment.CustomerId);
            row.PolicyNumber = FindPolicyNumber(policies, payment.PolicyId);
            row.Amount = payment.Amount;
            row.Method = payment.Method;
            row.Status = payment.Status;
            row.PaymentDate = payment.PaymentDate.ToString("yyyy-MM-dd");

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

    private string FindPolicyNumber(List<Models.Policy> policies, int policyId)
    {
        foreach (Models.Policy policy in policies)
        {
            if (policy.PolicyId == policyId)
            {
                return policy.PolicyNumber;
            }
        }

        return string.Empty;
    }

    public SaveResult Create(PaymentSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ReceiptNumber))
        {
            return SaveResult.Fail("Enter the receipt number.");
        }

        string number = request.ReceiptNumber.Trim();
        bool exists = _db.Payments.Any(payment => payment.ReceiptNumber == number);

        if (exists)
        {
            return SaveResult.Fail("That receipt number is already used.");
        }

        Models.Policy? policy = FindPolicy(request.PolicyNumber);

        if (policy is null)
        {
            return SaveResult.Fail("Choose a policy.");
        }

        if (!DateOnly.TryParse(request.PaymentDate, out DateOnly paymentDate))
        {
            return SaveResult.Fail("Enter the payment date.");
        }

        Models.Payment row = new Models.Payment();
        row.ReceiptNumber = number;
        row.CustomerId = policy.CustomerId;
        row.PolicyId = policy.PolicyId;
        row.Amount = request.Amount;
        row.Method = request.Method.Trim();
        row.Status = request.Status.Trim();
        row.PaymentDate = paymentDate;

        _db.Payments.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(string receiptNumber, PaymentSaveRequest request)
    {
        Models.Payment? row = _db.Payments.SingleOrDefault(payment => payment.ReceiptNumber == receiptNumber);

        if (row is null)
        {
            return SaveResult.Fail("This payment was not found.");
        }

        Models.Policy? policy = FindPolicy(request.PolicyNumber);

        if (policy is null)
        {
            return SaveResult.Fail("Choose a policy.");
        }

        if (!DateOnly.TryParse(request.PaymentDate, out DateOnly paymentDate))
        {
            return SaveResult.Fail("Enter the payment date.");
        }

        row.CustomerId = policy.CustomerId;
        row.PolicyId = policy.PolicyId;
        row.Amount = request.Amount;
        row.Method = request.Method.Trim();
        row.Status = request.Status.Trim();
        row.PaymentDate = paymentDate;

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(string receiptNumber)
    {
        Models.Payment? row = _db.Payments.SingleOrDefault(payment => payment.ReceiptNumber == receiptNumber);

        if (row is null)
        {
            return SaveResult.Fail("This payment was not found.");
        }

        _db.Payments.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    private Models.Policy? FindPolicy(string policyNumber)
    {
        return _db.Policies.SingleOrDefault(policy => policy.PolicyNumber == policyNumber);
    }
}

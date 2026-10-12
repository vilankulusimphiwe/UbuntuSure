namespace backend.UbuntuSure.Api.Handlers.Payment;

public class PaymentSaveRequest
{
    public string ReceiptNumber { get; set; } = string.Empty;
    public string PolicyNumber { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string PaymentDate { get; set; } = string.Empty;
}

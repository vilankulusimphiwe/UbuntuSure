namespace backend.UbuntuSure.Api.Handlers.Quote;

public class QuoteSaveRequest
{
    public string QuoteNumber { get; set; } = string.Empty;
    public string CustomerNumber { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public string Status { get; set; } = string.Empty;
    public string QuoteDate { get; set; } = string.Empty;
}

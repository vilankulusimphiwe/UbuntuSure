namespace backend.UbuntuSure.Api.Handlers.Quote;

public class QuoteResponse
{
    public string QuoteNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public string Status { get; set; } = string.Empty;
    public string QuoteDate { get; set; } = string.Empty;
}

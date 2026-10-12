namespace backend.UbuntuSure.Api.Models;

public class Quote
{
    public int QuoteId { get; set; }
    public string QuoteNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string Product { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateOnly QuoteDate { get; set; }
}

namespace backend.UbuntuSure.Api.Models;

public class Policy
{
    public int PolicyId { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string Product { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateOnly RenewalDate { get; set; }
}

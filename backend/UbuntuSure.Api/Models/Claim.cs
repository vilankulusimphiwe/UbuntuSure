namespace backend.UbuntuSure.Api.Models;

public class Claim
{
    public int ClaimId { get; set; }
    public string ClaimNumber { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string ClaimType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateOnly ClaimDate { get; set; }
}

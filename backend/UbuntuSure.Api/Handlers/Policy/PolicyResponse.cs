namespace backend.UbuntuSure.Api.Handlers.Policy;

public class PolicyResponse
{
    public string PolicyNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public string Status { get; set; } = string.Empty;
    public string RenewalDate { get; set; } = string.Empty;
}

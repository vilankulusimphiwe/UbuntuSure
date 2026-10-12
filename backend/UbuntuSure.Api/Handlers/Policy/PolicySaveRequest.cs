namespace backend.UbuntuSure.Api.Handlers.Policy;

public class PolicySaveRequest
{
    public string PolicyNumber { get; set; } = string.Empty;
    public string CustomerNumber { get; set; } = string.Empty;
    public string Product { get; set; } = string.Empty;
    public decimal Premium { get; set; }
    public string Status { get; set; } = string.Empty;
    public string RenewalDate { get; set; } = string.Empty;
}

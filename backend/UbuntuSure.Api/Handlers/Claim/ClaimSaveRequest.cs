namespace backend.UbuntuSure.Api.Handlers.Claim;

public class ClaimSaveRequest
{
    public string ClaimNumber { get; set; } = string.Empty;
    public string CustomerNumber { get; set; } = string.Empty;
    public string ClaimType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ClaimDate { get; set; } = string.Empty;
}

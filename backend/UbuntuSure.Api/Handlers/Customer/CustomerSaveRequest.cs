namespace backend.UbuntuSure.Api.Handlers.Customer;

public class CustomerSaveRequest
{
    public string CustomerNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerType { get; set; } = string.Empty;
    public string Town { get; set; } = string.Empty;
    public int PolicyCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public string MemberSince { get; set; } = string.Empty;
}

namespace backend.UbuntuSure.Api.Models;

public class Customer
{
    public int CustomerId { get; set; }
    public string CustomerNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerType { get; set; } = string.Empty;
    public string Town { get; set; } = string.Empty;
    public int PolicyCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateOnly MemberSince { get; set; }
}

namespace backend.UbuntuSure.Api.Handlers.Administration;

public class StaffSaveRequest
{
    public string DisplayName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string Area { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsAdmin { get; set; }
    public string Password { get; set; } = string.Empty;
}

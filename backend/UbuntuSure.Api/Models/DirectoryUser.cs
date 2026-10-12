namespace backend.UbuntuSure.Api.Models;

public class DirectoryUser
{
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public byte[] PasswordHash { get; set; } = [];
    public string DisplayName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? JobTitle { get; set; }
    public string? Area { get; set; }
    public bool IsActive { get; set; }
    public bool IsAdmin { get; set; }
}
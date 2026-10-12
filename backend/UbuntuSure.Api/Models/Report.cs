namespace backend.UbuntuSure.Api.Models;

public class Report
{
    public int ReportId { get; set; }
    public string ReportName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateOnly LastRun { get; set; }
}

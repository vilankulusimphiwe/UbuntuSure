namespace backend.UbuntuSure.Api.Handlers.Report;

public class ReportResponse
{
    public string ReportName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string LastRun { get; set; } = string.Empty;
}

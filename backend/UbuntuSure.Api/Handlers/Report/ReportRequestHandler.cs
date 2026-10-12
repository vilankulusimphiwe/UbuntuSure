using backend.UbuntuSure.Api.Data;

namespace backend.UbuntuSure.Api.Handlers.Report;

public class ReportRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public ReportRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<ReportResponse> Handle(ReportRequest request)
    {
        List<Models.Report> reports = _db.Reports.OrderBy(report => report.ReportId).ToList();

        List<ReportResponse> response = new List<ReportResponse>();

        foreach (Models.Report report in reports)
        {
            ReportResponse row = new ReportResponse();
            row.ReportName = report.ReportName;
            row.Description = report.Description;
            row.Category = report.Category;
            row.LastRun = report.LastRun.ToString("yyyy-MM-dd");

            response.Add(row);
        }

        return response;
    }
}

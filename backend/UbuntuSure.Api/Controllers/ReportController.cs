using backend.UbuntuSure.Api.Handlers.Report;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportController : ControllerBase
{
    private readonly ReportRequestHandler _reportRequestHandler;

    public ReportController(ReportRequestHandler reportRequestHandler)
    {
        _reportRequestHandler = reportRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<ReportResponse>> GetReports()
    {
        ReportRequest request = new ReportRequest();

        List<ReportResponse> response = _reportRequestHandler.Handle(request);

        return Ok(response);
    }
}

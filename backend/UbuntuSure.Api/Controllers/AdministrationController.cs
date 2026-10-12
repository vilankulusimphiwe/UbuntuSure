using backend.UbuntuSure.Api.Handlers.Administration;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/administration")]
public class AdministrationController : ControllerBase
{
    private readonly StaffRequestHandler _staffRequestHandler;

    public AdministrationController(StaffRequestHandler staffRequestHandler)
    {
        _staffRequestHandler = staffRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<StaffResponse>> GetStaff()
    {
        StaffRequest request = new StaffRequest();

        List<StaffResponse> response = _staffRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(StaffSaveRequest request)
    {
        return Save(_staffRequestHandler.Create(request));
    }

    [HttpPut("{userName}")]
    public ActionResult Update(string userName, StaffSaveRequest request)
    {
        return Save(_staffRequestHandler.Update(userName, request));
    }

    [HttpDelete("{userName}")]
    public ActionResult Delete(string userName)
    {
        return Save(_staffRequestHandler.Delete(userName));
    }

    private ActionResult Save(SaveResult result)
    {
        if (!result.Saved)
        {
            return BadRequest(new { message = result.Message });
        }

        return Ok();
    }
}

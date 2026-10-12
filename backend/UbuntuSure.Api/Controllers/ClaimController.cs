using backend.UbuntuSure.Api.Handlers.Claim;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/claims")]
public class ClaimController : ControllerBase
{
    private readonly ClaimRequestHandler _claimRequestHandler;

    public ClaimController(ClaimRequestHandler claimRequestHandler)
    {
        _claimRequestHandler = claimRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<ClaimResponse>> GetClaims()
    {
        ClaimRequest request = new ClaimRequest();

        List<ClaimResponse> response = _claimRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(ClaimSaveRequest request)
    {
        return Save(_claimRequestHandler.Create(request));
    }

    [HttpPut("{claimNumber}")]
    public ActionResult Update(string claimNumber, ClaimSaveRequest request)
    {
        return Save(_claimRequestHandler.Update(claimNumber, request));
    }

    [HttpDelete("{claimNumber}")]
    public ActionResult Delete(string claimNumber)
    {
        return Save(_claimRequestHandler.Delete(claimNumber));
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

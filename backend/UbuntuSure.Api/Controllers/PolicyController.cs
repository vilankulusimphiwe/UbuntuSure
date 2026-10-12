using backend.UbuntuSure.Api.Handlers.Policy;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/policies")]
public class PolicyController : ControllerBase
{
    private readonly PolicyRequestHandler _policyRequestHandler;

    public PolicyController(PolicyRequestHandler policyRequestHandler)
    {
        _policyRequestHandler = policyRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<PolicyResponse>> GetPolicies()
    {
        PolicyRequest request = new PolicyRequest();

        List<PolicyResponse> response = _policyRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(PolicySaveRequest request)
    {
        return Save(_policyRequestHandler.Create(request));
    }

    [HttpPut("{policyNumber}")]
    public ActionResult Update(string policyNumber, PolicySaveRequest request)
    {
        return Save(_policyRequestHandler.Update(policyNumber, request));
    }

    [HttpDelete("{policyNumber}")]
    public ActionResult Delete(string policyNumber)
    {
        return Save(_policyRequestHandler.Delete(policyNumber));
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

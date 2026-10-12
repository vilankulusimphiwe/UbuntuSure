using backend.UbuntuSure.Api.Handlers.Quote;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/quotes")]
public class QuoteController : ControllerBase
{
    private readonly QuoteRequestHandler _quoteRequestHandler;

    public QuoteController(QuoteRequestHandler quoteRequestHandler)
    {
        _quoteRequestHandler = quoteRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<QuoteResponse>> GetQuotes()
    {
        QuoteRequest request = new QuoteRequest();

        List<QuoteResponse> response = _quoteRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(QuoteSaveRequest request)
    {
        return Save(_quoteRequestHandler.Create(request));
    }

    [HttpPut("{quoteNumber}")]
    public ActionResult Update(string quoteNumber, QuoteSaveRequest request)
    {
        return Save(_quoteRequestHandler.Update(quoteNumber, request));
    }

    [HttpDelete("{quoteNumber}")]
    public ActionResult Delete(string quoteNumber)
    {
        return Save(_quoteRequestHandler.Delete(quoteNumber));
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

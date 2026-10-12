using backend.UbuntuSure.Api.Handlers.Search;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/search")]
public class SearchController : ControllerBase
{
    private readonly SearchRequestHandler _searchRequestHandler;

    public SearchController(SearchRequestHandler searchRequestHandler)
    {
        _searchRequestHandler = searchRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<SearchResponse>> Search([FromQuery] string? text)
    {
        SearchRequest request = new SearchRequest();
        request.Text = text ?? string.Empty;

        List<SearchResponse> response = _searchRequestHandler.Handle(request);

        return Ok(response);
    }
}

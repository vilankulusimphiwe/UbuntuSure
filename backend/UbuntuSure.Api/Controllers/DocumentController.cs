using backend.UbuntuSure.Api.Handlers.Document;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/documents")]
public class DocumentController : ControllerBase
{
    private readonly DocumentRequestHandler _documentRequestHandler;

    public DocumentController(DocumentRequestHandler documentRequestHandler)
    {
        _documentRequestHandler = documentRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<DocumentResponse>> GetDocuments()
    {
        DocumentRequest request = new DocumentRequest();

        List<DocumentResponse> response = _documentRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(DocumentSaveRequest request)
    {
        return Save(_documentRequestHandler.Create(request));
    }

    [HttpPut("{documentId:int}")]
    public ActionResult Update(int documentId, DocumentSaveRequest request)
    {
        return Save(_documentRequestHandler.Update(documentId, request));
    }

    [HttpDelete("{documentId:int}")]
    public ActionResult Delete(int documentId)
    {
        return Save(_documentRequestHandler.Delete(documentId));
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

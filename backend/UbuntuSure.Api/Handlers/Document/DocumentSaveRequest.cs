namespace backend.UbuntuSure.Api.Handlers.Document;

public class DocumentSaveRequest
{
    public string DocumentName { get; set; } = string.Empty;
    public string CustomerNumber { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string LinkedTo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string AddedOn { get; set; } = string.Empty;
}

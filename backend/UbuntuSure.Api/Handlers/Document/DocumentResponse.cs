namespace backend.UbuntuSure.Api.Handlers.Document;

public class DocumentResponse
{
    public int DocumentId { get; set; }
    public string DocumentName { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string LinkedTo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string AddedOn { get; set; } = string.Empty;
}

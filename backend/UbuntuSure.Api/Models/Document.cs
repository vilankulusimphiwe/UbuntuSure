namespace backend.UbuntuSure.Api.Models;

public class Document
{
    public int DocumentId { get; set; }
    public string DocumentName { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string DocumentType { get; set; } = string.Empty;
    public string LinkedTo { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateOnly AddedOn { get; set; }
}

namespace backend.UbuntuSure.Api.Models;

public class SaveResult
{
    public bool Saved { get; set; }
    public string Message { get; set; } = string.Empty;

    public static SaveResult Done()
    {
        SaveResult result = new SaveResult();
        result.Saved = true;
        return result;
    }

    public static SaveResult Fail(string message)
    {
        SaveResult result = new SaveResult();
        result.Saved = false;
        result.Message = message;
        return result;
    }
}

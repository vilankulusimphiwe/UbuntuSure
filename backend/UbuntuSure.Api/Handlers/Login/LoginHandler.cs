using System.Security.Cryptography;
using System.Text;
using backend.UbuntuSure.Api.Models;
using backend.UbuntuSure.Api.Services;

namespace backend.UbuntuSure.Api.Handlers.Login;

public class LoginHandler
{
    private readonly UserDirectoryService _directory;

    public LoginHandler(UserDirectoryService directory)
    {
        _directory = directory;
    }

    public LoginResponse? Handle(LoginRequest request)
    {
        DirectoryUser? user = _directory.FindActiveUser(request.UserName);

        if (user is null)
        {
            return null;
        }

        byte[] typedHash = SHA256.HashData(Encoding.Unicode.GetBytes(request.Password));

        if (!CryptographicOperations.FixedTimeEquals(user.PasswordHash, typedHash))
        {
            return null;
        }

        return new LoginResponse
        {
            UserName = user.UserName,
            DisplayName = user.DisplayName,
            FirstName = user.FirstName,
            JobTitle = user.JobTitle ?? string.Empty
        };
    }
}

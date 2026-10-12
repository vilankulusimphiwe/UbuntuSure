using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Services;

public class UserDirectoryService
{
    private readonly UbuntuSureDbContext _db;

    public UserDirectoryService(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public DirectoryUser? FindActiveUser(string userName)
    {
        return _db.Users.SingleOrDefault(user =>
            user.UserName == userName && user.IsActive);
    }
}
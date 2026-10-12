using System.Security.Cryptography;
using System.Text;
using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Models;

namespace backend.UbuntuSure.Api.Handlers.Administration;

public class StaffRequestHandler
{
    private readonly UbuntuSureDbContext _db;

    public StaffRequestHandler(UbuntuSureDbContext db)
    {
        _db = db;
    }

    public List<StaffResponse> Handle(StaffRequest request)
    {
        List<DirectoryUser> users = _db.Users.OrderBy(user => user.UserId).ToList();

        List<StaffResponse> response = new List<StaffResponse>();

        foreach (DirectoryUser user in users)
        {
            StaffResponse row = new StaffResponse();
            row.DisplayName = user.DisplayName;
            row.UserName = user.UserName;
            row.JobTitle = user.JobTitle ?? string.Empty;
            row.Area = user.Area ?? string.Empty;
            row.IsAdmin = user.IsAdmin;

            if (user.IsActive)
            {
                row.Status = "Active";
            }
            else
            {
                row.Status = "Inactive";
            }

            response.Add(row);
        }

        return response;
    }

    public SaveResult Create(StaffSaveRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DisplayName) || string.IsNullOrWhiteSpace(request.UserName))
        {
            return SaveResult.Fail("Enter the name and username.");
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return SaveResult.Fail("Enter a password.");
        }

        string userName = request.UserName.Trim();
        bool exists = _db.Users.Any(user => user.UserName == userName);

        if (exists)
        {
            return SaveResult.Fail("That username is already used.");
        }

        DirectoryUser row = new DirectoryUser();
        row.UserName = userName;
        row.DisplayName = request.DisplayName.Trim();
        row.FirstName = FirstNameFrom(row.DisplayName);
        row.JobTitle = request.JobTitle.Trim();
        row.Area = request.Area.Trim();
        row.IsActive = request.Status == "Active";
        row.IsAdmin = request.IsAdmin;
        row.PasswordHash = HashPassword(request.Password);

        _db.Users.Add(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Update(string userName, StaffSaveRequest request)
    {
        DirectoryUser? row = _db.Users.SingleOrDefault(user => user.UserName == userName);

        if (row is null)
        {
            return SaveResult.Fail("This staff member was not found.");
        }

        if (string.IsNullOrWhiteSpace(request.DisplayName))
        {
            return SaveResult.Fail("Enter the name.");
        }

        row.DisplayName = request.DisplayName.Trim();
        row.FirstName = FirstNameFrom(row.DisplayName);
        row.JobTitle = request.JobTitle.Trim();
        row.Area = request.Area.Trim();
        row.IsActive = request.Status == "Active";
        row.IsAdmin = request.IsAdmin;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            row.PasswordHash = HashPassword(request.Password);
        }

        _db.SaveChanges();

        return SaveResult.Done();
    }

    public SaveResult Delete(string userName)
    {
        DirectoryUser? row = _db.Users.SingleOrDefault(user => user.UserName == userName);

        if (row is null)
        {
            return SaveResult.Fail("This staff member was not found.");
        }

        _db.Users.Remove(row);
        _db.SaveChanges();

        return SaveResult.Done();
    }

    private static string FirstNameFrom(string displayName)
    {
        int space = displayName.IndexOf(' ');

        if (space < 0)
        {
            return displayName;
        }

        return displayName.Substring(0, space);
    }

    private static byte[] HashPassword(string password)
    {
        return SHA256.HashData(Encoding.Unicode.GetBytes(password));
    }
}

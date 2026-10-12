using backend.UbuntuSure.Api.Handlers.Login;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly LoginHandler _loginHandler;

    public AuthController(LoginHandler loginHandler)
    {
        _loginHandler = loginHandler;
    }

    [HttpPost("login")]
    public ActionResult<LoginResponse> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Enter your username and password." });
        }

        LoginResponse? employee = _loginHandler.Handle(request);

        if (employee is null)
        {
            return Unauthorized(new { message = "The username or password is incorrect." });
        }

        return Ok(employee);
    }
}

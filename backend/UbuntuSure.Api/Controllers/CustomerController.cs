using backend.UbuntuSure.Api.Handlers.Customer;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomerController : ControllerBase
{
    private readonly CustomerRequestHandler _customerRequestHandler;

    public CustomerController(CustomerRequestHandler customerRequestHandler)
    {
        _customerRequestHandler = customerRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<CustomerResponse>> GetCustomers()
    {
        CustomerRequest request = new CustomerRequest();

        List<CustomerResponse> response = _customerRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(CustomerSaveRequest request)
    {
        return Save(_customerRequestHandler.Create(request));
    }

    [HttpPut("{customerNumber}")]
    public ActionResult Update(string customerNumber, CustomerSaveRequest request)
    {
        return Save(_customerRequestHandler.Update(customerNumber, request));
    }

    [HttpDelete("{customerNumber}")]
    public ActionResult Delete(string customerNumber)
    {
        return Save(_customerRequestHandler.Delete(customerNumber));
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

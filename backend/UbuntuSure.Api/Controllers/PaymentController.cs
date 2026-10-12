using backend.UbuntuSure.Api.Handlers.Payment;
using backend.UbuntuSure.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.UbuntuSure.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly PaymentRequestHandler _paymentRequestHandler;

    public PaymentController(PaymentRequestHandler paymentRequestHandler)
    {
        _paymentRequestHandler = paymentRequestHandler;
    }

    [HttpGet]
    public ActionResult<List<PaymentResponse>> GetPayments()
    {
        PaymentRequest request = new PaymentRequest();

        List<PaymentResponse> response = _paymentRequestHandler.Handle(request);

        return Ok(response);
    }

    [HttpPost]
    public ActionResult Create(PaymentSaveRequest request)
    {
        return Save(_paymentRequestHandler.Create(request));
    }

    [HttpPut("{receiptNumber}")]
    public ActionResult Update(string receiptNumber, PaymentSaveRequest request)
    {
        return Save(_paymentRequestHandler.Update(receiptNumber, request));
    }

    [HttpDelete("{receiptNumber}")]
    public ActionResult Delete(string receiptNumber)
    {
        return Save(_paymentRequestHandler.Delete(receiptNumber));
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

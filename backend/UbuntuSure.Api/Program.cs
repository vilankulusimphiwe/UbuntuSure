using backend.UbuntuSure.Api.Data;
using backend.UbuntuSure.Api.Handlers.Administration;
using backend.UbuntuSure.Api.Handlers.Claim;
using backend.UbuntuSure.Api.Handlers.Customer;
using backend.UbuntuSure.Api.Handlers.Document;
using backend.UbuntuSure.Api.Handlers.Login;
using backend.UbuntuSure.Api.Handlers.Payment;
using backend.UbuntuSure.Api.Handlers.Policy;
using backend.UbuntuSure.Api.Handlers.Quote;
using backend.UbuntuSure.Api.Handlers.Report;
using backend.UbuntuSure.Api.Handlers.Search;
using backend.UbuntuSure.Api.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<UbuntuSureDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("UbuntuSure")));

builder.Services.AddScoped<UserDirectoryService>();
builder.Services.AddScoped<LoginHandler>();
builder.Services.AddScoped<CustomerRequestHandler>();
builder.Services.AddScoped<QuoteRequestHandler>();
builder.Services.AddScoped<PolicyRequestHandler>();
builder.Services.AddScoped<ClaimRequestHandler>();
builder.Services.AddScoped<PaymentRequestHandler>();
builder.Services.AddScoped<DocumentRequestHandler>();
builder.Services.AddScoped<ReportRequestHandler>();
builder.Services.AddScoped<StaffRequestHandler>();
builder.Services.AddScoped<SearchRequestHandler>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.MapControllers();

app.Run();
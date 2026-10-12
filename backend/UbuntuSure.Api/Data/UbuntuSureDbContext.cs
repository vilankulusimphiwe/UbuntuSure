using backend.UbuntuSure.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.UbuntuSure.Api.Data;

public class UbuntuSureDbContext : DbContext
{
    public UbuntuSureDbContext(DbContextOptions<UbuntuSureDbContext> options) : base(options)
    {
    }

    public DbSet<DirectoryUser> Users => Set<DirectoryUser>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<Policy> Policies => Set<Policy>();
    public DbSet<Claim> Claims => Set<Claim>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Report> Reports => Set<Report>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<DirectoryUser>(entity =>
        {
            entity.ToTable("Users", "identity");
            entity.HasKey(user => user.UserId);
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.ToTable("Customers", "customer");
            entity.HasKey(customer => customer.CustomerId);
        });

        modelBuilder.Entity<Quote>(entity =>
        {
            entity.ToTable("Quotes", "quote");
            entity.HasKey(quote => quote.QuoteId);
        });

        modelBuilder.Entity<Policy>(entity =>
        {
            entity.ToTable("Policies", "policy");
            entity.HasKey(policy => policy.PolicyId);
        });

        modelBuilder.Entity<Claim>(entity =>
        {
            entity.ToTable("Claims", "claim");
            entity.HasKey(claim => claim.ClaimId);
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("Payments", "payment");
            entity.HasKey(payment => payment.PaymentId);
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.ToTable("Documents", "document");
            entity.HasKey(document => document.DocumentId);
        });

        modelBuilder.Entity<Report>(entity =>
        {
            entity.ToTable("Reports", "report");
            entity.HasKey(report => report.ReportId);
        });
    }
}

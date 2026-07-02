using backend.Data;
using backend.Enums;
using backend.Other;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

var connectionString = configuration.GetConnectionString("DefaultConnection");
var environment = configuration.GetSection("environmentVariables")["ASPNETCORE_ENVIRONMENT"];

services.AddEndpointsApiExplorer();
services.AddSwaggerGen();

services.Configure<JwtOptions>(configuration.GetSection("JwtOptions"));

services.AddDbContext<HelpdeskDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

services.AddScoped<UserService>();
services.AddScoped<ApplicationService>();
services.AddScoped<AttachmentService>();

services.AddScoped<JwtProvider>();
services.AddScoped<PasswordHasher>();

services.AddControllers();

services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetSection("JwtOptions")["SecretKey"]!))
        };
        opt.Events = new JwtBearerEvents() 
        { 
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["tokies"];
                return Task.CompletedTask;
            }
        };
    });

var allRoles = new[]
{
    Role.Admin.ToString(),
    Role.Executor.ToString(),
    Role.Client.ToString()
};

services.AddAuthorizationBuilder()

    .AddPolicy("Users.Read", policy =>
        policy.RequireRole(Role.Admin.ToString()))

    .AddPolicy("Users.ReadAll", policy =>
        policy.RequireRole(Role.Admin.ToString()))

    .AddPolicy("Users.Delete", policy =>
        policy.RequireRole(Role.Admin.ToString()))


    .AddPolicy("Applications.Create", policy =>
        policy.RequireRole(allRoles))

    .AddPolicy("Applications.Read", policy =>
        policy.RequireRole(allRoles))

    .AddPolicy("Applications.ReadAll", policy =>
        policy.RequireRole(allRoles))

    .AddPolicy("Applications.ChangeStatus", policy =>
        policy.RequireRole(
            Role.Admin.ToString(),
            Role.Executor.ToString()))

    .AddPolicy("Applications.Assign", policy =>
        policy.RequireRole(
            Role.Admin.ToString(),
            Role.Executor.ToString()))


    .AddPolicy("Attachments.Upload", policy =>
        policy.RequireRole(allRoles))

    .AddPolicy("Attachments.Download", policy =>
        policy.RequireRole(allRoles))

    .AddPolicy("Attachments.Delete", policy =>
        policy.RequireRole(Role.Admin.ToString()));

var app = builder.Build();

if (environment == "Development") // для отключения поменять в appsettings.json на "Production"
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCookiePolicy(new CookiePolicyOptions()
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
});

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
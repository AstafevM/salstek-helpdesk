using backend.Data;
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

services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
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
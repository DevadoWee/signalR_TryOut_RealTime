using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SignalR;
using SignalRIntro.Api;
using Microsoft.OpenApi.Models;

var UriBuilder = WebApplication.CreateBuilder(args);

UriBuilder.Services.AddEndpointsApiExplorer();

UriBuilder.Services.AddAuthorization();
UriBuilder.Services.AddSignalR();
UriBuilder.Services.AddControllers();

UriBuilder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:61274")  // Your client-side app URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();  // Allow credentials (cookies, HTTP auth, etc.)
        });
});

UriBuilder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

//UriBuilder.Services.AddSignalR();

var app = UriBuilder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Optional: to have Swagger UI at the root
    });
}

app.UseCors("AllowSpecificOrigin");

app.MapPost("broadcast", async (string message, IHubContext<ChatHub, IChatClient> context) =>
{
    await context.Clients.All.ReceiveMessage(message);
    return Results.NoContent();
});

app.UseHttpsRedirection();
app.UseAuthorization();


app.MapHub<ChatHub>("chat-hub");

app.Run();

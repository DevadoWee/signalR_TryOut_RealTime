using Microsoft.AspNetCore.SignalR;
using SignalRIntro.Api;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true)
            .AllowCredentials();
    });
});
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Optional: to have Swagger UI at the root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin"); // Use CORS early in the pipeline
app.UseAuthorization();

// Map your endpoints and hubs
app.MapControllers();
app.MapHub<ChatHub>("chat-hub"); // Ensure this matches your client-side SignalR URL

// Optional: Example broadcast endpoint
app.MapPost("broadcast", async (string message, IHubContext<ChatHub, IChatClient> context) =>
{
    await context.Clients.All.SendMessageToClient(message);
    return Results.NoContent();
});

app.Run();

using Microsoft.AspNetCore.SignalR;

namespace SignalRIntro.Api;

//https://www.youtube.com/watch?v=9_pRk7PwkpY
public sealed class ChatHub : Hub<IChatClient>
{
    public override async Task OnConnectedAsync()
    {
        await Clients.All.SendMessageToClient($"{Context.ConnectionId} has joined");
    }

    public async Task SendMessageToAll(string msg)
    {
        await Clients.All.SendMessageToClient($"Message sent from server" + msg);
    }

    public async Task SendMessageToSpecific(string connectionId, string msg)
    {
        await Clients.User(connectionId).SendMessageToClient($"Specific message sent from server: {msg}");
    }



}
namespace SignalRIntro.Api;

public interface IChatClient
{
    Task SendMessageToClient(string message);
}
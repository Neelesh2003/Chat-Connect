using ChatConnect.Core.Interfaces;

namespace ChatConnect.Infrastructure.Services.SignalR
{
    public class ConnectionMapping<T> : IConnectionMapping<T>
    {
        private readonly Dictionary<T, List<string>> _connections = new();

        public void Add(T key, string connectionId)
        {
            lock (_connections)
            {
                if (!_connections.TryGetValue(key, out var connections))
                {
                    connections = new List<string>();
                    _connections[key] = connections;
                }

                lock (connections)
                {
                    connections.Add(connectionId);
                }
            }
        }

        public IEnumerable<string> GetConnections(T key)
        {
            lock (_connections)
            {
                if (_connections.TryGetValue(key, out var connections))
                {
                    return connections;
                }
                return Enumerable.Empty<string>();
            }
        }

        public void Remove(T key, string connectionId)
        {
            lock (_connections)
            {
                if (!_connections.TryGetValue(key, out var connections))
                {
                    return;
                }

                lock (connections)
                {
                    connections.Remove(connectionId);
                }

                if (connections.Count == 0)
                {
                    _connections.Remove(key);
                }
            }
        }
    }
}
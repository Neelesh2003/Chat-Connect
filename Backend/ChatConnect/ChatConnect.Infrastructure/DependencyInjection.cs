using ChatConnect.Core.Entities;
using ChatConnect.Core.Interfaces;
using ChatConnect.Core.Interfaces.Repositories;
using ChatConnect.Core.Interfaces.Services;
using ChatConnect.Infrastructure.Data;
using ChatConnect.Infrastructure.Persistence.Dapper;
using ChatConnect.Infrastructure.Persistence.Repositories;
using ChatConnect.Infrastructure.Services.Auth;
using ChatConnect.Infrastructure.Services.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ChatConnect.Infrastructure
{
    public static class InfrastructureDependencyInjection
    {
        public static IServiceCollection AddInfrastructureLayer(this IServiceCollection services, IConfiguration configuration)
        {
            // Database
            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

            // Repositories
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMessageRepository, MessageRepository>();
            services.AddScoped<IGroupRepository, GroupRepository>();
            services.AddScoped<IGroupMessageRepository, GroupMessageRepository>();
            services.AddScoped<IConversationDapperRepository, ConversationDapperRepository>();

            // Services
            services.AddScoped<IJwtService, JwtService>();
            services.AddSingleton<IConnectionMapping<int>, ConnectionMapping<int>>(); // For SignalR user connections

            //services.AddIdentityCore<User>().AddEntityFrameworkStores<AppDbContext>().AddDefaultTokenProviders();

            // Logging
            services.AddLogging(builder => builder.AddConsole());

            return services;
        }
    }
}
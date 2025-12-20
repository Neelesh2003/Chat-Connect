using AutoMapper;
using ChatConnect.Api.Models.AuthModels;
using ChatConnect.Api.Models.GroupModels;
using ChatConnect.Api.Models.MessageModels;
using ChatConnect.Application.Features.Auth.Commands.LoginUser;
using ChatConnect.Application.Features.Auth.Commands.RegisterUser;
using ChatConnect.Application.Features.Groups.Commands.AddMembersToGroup;
using ChatConnect.Application.Features.Groups.Commands.CreateGroup;
using ChatConnect.Application.Features.Groups.Commands.SendGroupMessage;
using ChatConnect.Application.Features.Messages.Commands.SendMessage;
using ChatConnect.Core.DTOs;

namespace ChatConnect.Api.Mappers
{
    public class ApiMappingProfile : Profile
    {
        public ApiMappingProfile()
        {
            // Auth
            CreateMap<RegisterRequest, RegisterUserCommand>();
            CreateMap<LoginRequest, LoginUserCommand>();
            CreateMap<AuthResultDto, AuthResponse>();

            // Messages
            CreateMap<SendMessageRequest, SendMessageCommand>();
            CreateMap<MessageDto, MessageResponse>();

            // Groups
            CreateMap<CreateGroupRequest, CreateGroupCommand>();
            CreateMap<AddMembersRequest, AddMembersToGroupCommand>();
            CreateMap<SendGroupMessageRequest, SendGroupMessageCommand>();
            CreateMap<GroupDto, GroupResponse>();
            CreateMap<GroupMessageDto, MessageResponse>(); // Reuse for group messages
        }
    }
}
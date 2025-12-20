using ChatConnect.Api.Models.MessageModels;
using FluentValidation;

namespace ChatConnect.Api.Validators.MessageValidators
{
    public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
    {
        public SendMessageRequestValidator()
        {
            RuleFor(x => x.ReceiverId).GreaterThan(0).WithMessage("Valid receiver ID is required");
            RuleFor(x => x.Message).NotEmpty().WithMessage("Message content is required");
        }
    }
}
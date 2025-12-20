using ChatConnect.Api.Models.GroupModels;
using FluentValidation;

namespace ChatConnect.Api.Validators.GroupValidators
{
    public class CreateGroupRequestValidator : AbstractValidator<CreateGroupRequest>
    {
        public CreateGroupRequestValidator()
        {
            RuleFor(x => x.Name).NotEmpty().WithMessage("Group name is required").Length(1, 100);
        }
    }
}
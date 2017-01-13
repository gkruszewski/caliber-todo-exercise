using Caliber.Core;

namespace Caliber.Business
{
    public class Todo
        : IEntity
    {
        public int Id { get; set; }

        public string Description { get; set; }
    }
}

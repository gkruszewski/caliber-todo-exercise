using Caliber.Business;
using Caliber.Core;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace Caliber.Web.Controllers
{
    [Route("api/[controller]")]
    public class TodoController
        : Controller
    {
        private readonly IRepository<Todo> _repository;

        public TodoController(IRepository<Todo> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public IEnumerable<Todo> All()
        {
            return _repository.All();
        }

        [HttpPost]
        public IActionResult Insert([FromBody]Todo todo)
        {
            return new ObjectResult(_repository.Insert(todo));
        }

        [HttpPut]
        public IActionResult Update([FromBody]Todo todo)
        {
            _repository.Update(todo);

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var todoId = int.Parse(id);

            _repository.Delete(w => w.Id == todoId);

            return new NoContentResult();
        }
    }
}
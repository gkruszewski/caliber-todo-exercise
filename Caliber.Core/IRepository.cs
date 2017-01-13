using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Caliber.Core
{
    public interface IRepository<T> where T : class
    {
        T Insert(T entity);

        void Update(T entity);

        void Delete(Expression<Func<T, bool>> where);

        IEnumerable<T> All();
    }
}
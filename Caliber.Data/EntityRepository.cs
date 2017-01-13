using Caliber.Core;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

namespace Caliber.Data
{
    public class EntityRepository<T>
        : IRepository<T> where T : class
    {
        private readonly DataContext _context;

        public EntityRepository()
        {
            _context = new DataContext();
        }

        public T Insert(T entity)
        {
            _context.Set<T>().Add(entity);
            _context.SaveChanges();

            return entity;
        }

        public void Update(T entity)
        {
            _context.Entry(entity).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public void Delete(Expression<Func<T, bool>> where)
        {
            _context.Set<T>().RemoveRange(_context.Set<T>().Where(where));
            _context.SaveChanges();
        }

        public IEnumerable<T> All()
        {
            return _context.Set<T>();
        }
    }
}

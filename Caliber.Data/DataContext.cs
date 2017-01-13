using Caliber.Business;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Threading;

namespace Caliber.Data
{
    public class DataContext
        : DbContext
    {
        private static int _initialized;

        public DataContext()
           : base(ContextConfiguration.DatabaseName)
        {
            SetInitializer();
            Database.Initialize(false);
            Configuration.LazyLoadingEnabled = false;
            Configuration.AutoDetectChangesEnabled = false;
            Configuration.ValidateOnSaveEnabled = false;
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            modelBuilder.Configurations.Add(new EntityTypeConfiguration<Todo>());
        }

        private void SetInitializer()
        {
            if (Interlocked.Increment(ref _initialized) == 1)
            {
                Database.SetInitializer(new CreateDatabaseIfNotExists<DataContext>());
            }
        }
    }
}

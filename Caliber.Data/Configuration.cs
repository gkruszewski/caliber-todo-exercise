using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.SqlServer;
using System.Data.SqlClient;
using System.IO;

namespace Caliber.Data
{
    internal sealed class ContextConfiguration
        : DbConfiguration
    {
        public const string DatabaseName = "CaliberExercise";

        public ContextConfiguration()
        {
            var connectionStringBuilder = new SqlConnectionStringBuilder
            {
                InitialCatalog = DatabaseName,
                DataSource = Path.Combine("(localdb)", "MSSQLLocalDB"),
                IntegratedSecurity = true
            };

            SetDefaultConnectionFactory(new SqlConnectionFactory(connectionStringBuilder.ConnectionString));
            SetProviderServices(SqlProviderServices.ProviderInvariantName, SqlProviderServices.Instance);
            SetDatabaseInitializer(new CreateDatabaseIfNotExists<DataContext>());
        }
    }
}
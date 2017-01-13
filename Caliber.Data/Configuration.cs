using System;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.SqlServer;
using System.Data.Sql;
using System.Data.SqlClient;
using System.IO;

namespace Caliber.Data
{
    internal sealed class ContextConfiguration
        : DbConfiguration
    {
        public const string DatabaseName = "CaliberExercise";

        public static string ConnectionString()
        {
            return new SqlConnectionStringBuilder
            {
                InitialCatalog = DatabaseName,
                DataSource = Path.Combine(".", GetInstanceName()),
                IntegratedSecurity = true
            }.ConnectionString;
        }

        public ContextConfiguration()
        {
            SetDefaultConnectionFactory(new SqlConnectionFactory(ConnectionString()));
            SetProviderServices(SqlProviderServices.ProviderInvariantName, SqlProviderServices.Instance);
        }

        private static string GetInstanceName()
        {
            var version = new Version();
            var instanceName = string.Empty;

            foreach (DataRow row in SqlDataSourceEnumerator.Instance.GetDataSources().Rows)
            {
                var versionNumber = row[3].ToString();

                if (!string.IsNullOrEmpty(versionNumber))
                {
                    var currentVersion = new Version(versionNumber);

                    if (currentVersion > version)
                    {
                        version = currentVersion;
                        instanceName = row[1].ToString();
                    }
                }
            }

            return instanceName;
        }
    }
}

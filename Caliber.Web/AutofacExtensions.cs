using Autofac;
using Caliber.Core;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

internal static class AutofacExtensions
{
    public static void PopulateRepositories(this ContainerBuilder containerBuilder, IHostingEnvironment hostingEnvironment)
    {
        var entityType = typeof(IEntity);
        var repositoryType = typeof(IRepository<>);
        var entityTypes = ProbeTypes("Business", hostingEnvironment, w => entityType.IsAssignableFrom(w));
        var dataType = ProbeTypes("Data", hostingEnvironment, w => w.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == repositoryType)).Single();

        foreach (var type in entityTypes)
        {
            containerBuilder.RegisterType(dataType.MakeGenericType(type)).As(repositoryType.MakeGenericType(type));
        }
    }

    private static IEnumerable<Type> ProbeTypes(string assemblyName, IHostingEnvironment hostingEnvironment, Func<Type, bool> predicate)
    {
        return ProbeAssemblies(assemblyName, hostingEnvironment).SelectMany(s => s.GetTypes().Where(predicate));
    }

    private static IEnumerable<Assembly> ProbeAssemblies(string assemblyName, IHostingEnvironment hostingEnvironment)
    {
        var files = Directory.EnumerateFiles(Path.Combine(hostingEnvironment.ContentRootPath, "bin"), "*." + assemblyName + ".dll", SearchOption.AllDirectories);

        return files.Select(s => Assembly.LoadFrom(s));
    }
}
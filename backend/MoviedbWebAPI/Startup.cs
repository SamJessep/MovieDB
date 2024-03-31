using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using MoviedbWebAPI.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace MoviedbWebAPI
{
    public class Startup
    {
        private string frontend_url;
        private bool useHttps = true;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            frontend_url = Environment.GetEnvironmentVariable("MOVIE_DB_FRONTEND_URL");
            if(frontend_url == null) frontend_url = "http://localhost:5000";

            string httpsFlag = Environment.GetEnvironmentVariable("USE_HTTPS");
            useHttps = httpsFlag == null || httpsFlag.ToUpper() != "NO";
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "MoviedbWebAPI", Version = "v1" });
            });
            services.AddCors(options =>
            {
                options.AddPolicy("cors-allow",
                    builder => builder.WithOrigins(frontend_url)
                                        .AllowAnyHeader()
                                        .AllowAnyMethod()
                );

                options.AddDefaultPolicy(builder => builder.WithOrigins(frontend_url));
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MoviedbWebAPI v1"));
            }

            if(useHttps) app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS runtime
WORKDIR /app
COPY . .
CMD dotnet build -c release && ASPNETCORE_URLS=http://*:$PORT dotnet /app/MoviedbWebAPI/bin/Release/net5.0/MoviedbWebAPI.dll
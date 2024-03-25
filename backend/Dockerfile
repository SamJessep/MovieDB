FROM mcr.microsoft.com/dotnet/sdk:5.0 AS runtime
WORKDIR /app
COPY . .
CMD dotnet build -c release && dotnet /app/MoviedbWebAPI/bin/Release/net5.0/MoviedbWebAPI.dll --urls="http://0.0.0.0:80;https://0.0.0.0:443"
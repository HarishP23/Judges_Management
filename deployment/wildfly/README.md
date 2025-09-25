# WildFly Deployment Guide for Judges Management System

This guide explains how to deploy your full-stack Judges Management System (Angular frontend + Spring Boot backend) to WildFly application server.

## 📋 Prerequisites

1. **WildFly** - Download and install WildFly from [wildfly.org](https://wildfly.org/downloads/)
2. **Java 17+** - Required for Spring Boot 3.x
3. **Maven** - For building the backend
4. **Node.js & npm** - For building the Angular frontend
5. **PostgreSQL** - Database (already configured in your application.properties)

## 🚀 Quick Deployment

### Option 1: Automated Script (Recommended)

#### Linux/macOS:
```bash
# Set WildFly home directory
export WILDFLY_HOME=/path/to/your/wildfly

# Run the deployment script
./deployment/wildfly/deploy.sh
```

#### Windows:
```cmd
# Set WildFly home directory
set WILDFLY_HOME=C:\path\to\your\wildfly

# Run the deployment script
deployment\wildfly\deploy.bat
```

### Option 2: Manual Deployment

1. **Build Frontend:**
   ```bash
   cd frontend
   npm install
   npx ng build --configuration production
   ```

2. **Build Backend with Frontend:**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

3. **Deploy to WildFly:**
   ```bash
   cp backend/target/judges.war $WILDFLY_HOME/standalone/deployments/
   ```

## 🔧 Configuration Details

### Application Architecture
- **Integrated Deployment**: Frontend is embedded within the backend WAR file
- **Single Context**: Both frontend and API are served under `/judges/` context
- **Static Resource Serving**: Frontend files are served as static resources
- **API Routing**: Backend APIs are available at `/judges/api/*`

### URL Structure
- **Frontend Application**: `http://localhost:8080/judges/`
- **API Endpoints**: `http://localhost:8080/judges/api/judges`
- **WildFly Admin Console**: `http://localhost:9990/`

### CORS Configuration
The backend includes CORS configuration to allow frontend-backend communication:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

## 🗂️ Project Structure After Deployment

```
judges.war/
├── index.html                 # Angular app entry point
├── *.js, *.css               # Angular compiled assets
├── WEB-INF/
│   ├── classes/               # Java compiled classes
│   └── lib/                   # JAR dependencies
└── META-INF/
```

## 🔍 Troubleshooting

### Common Issues

1. **Deployment Failed**
   - Check WildFly logs: `$WILDFLY_HOME/standalone/log/server.log`
   - Ensure database is running and accessible
   - Verify WILDFLY_HOME environment variable

2. **Frontend Not Loading**
   - Check if `index.html` is present in the WAR
   - Verify Angular build completed successfully
   - Check browser console for errors

3. **API Calls Failing**
   - Verify API URLs in Angular service: `/judges/api/judges`
   - Check CORS configuration
   - Ensure backend is running and healthy

4. **Database Connection Issues**
   - Update `application.properties` with correct database URL
   - Check PostgreSQL service is running
   - Verify database credentials

### Log Locations
- **WildFly Server Logs**: `$WILDFLY_HOME/standalone/log/server.log`
- **Application Logs**: Check WildFly console output

### Useful WildFly CLI Commands
```bash
# Start WildFly
$WILDFLY_HOME/bin/standalone.sh

# Connect to CLI
$WILDFLY_HOME/bin/jboss-cli.sh --connect

# List deployments
deployment-info

# Undeploy application
undeploy judges.war

# Deploy application
deploy /path/to/judges.war
```

## 🔄 Development Workflow

For ongoing development:

1. **Make Changes** to frontend or backend
2. **Run Deployment Script** - it rebuilds everything automatically
3. **Test Application** at `http://localhost:8080/judges/`

## 📊 Performance Considerations

- **Production Build**: Angular is built with production optimizations
- **Static Serving**: Frontend files are served efficiently by WildFly
- **Single WAR**: Reduces deployment complexity
- **Connection Pooling**: Configured for PostgreSQL

## 🛡️ Security Notes

- Update default WildFly admin credentials
- Configure HTTPS for production
- Review CORS settings for production environment
- Secure database connections

## 📈 Monitoring

- **WildFly Admin Console**: `http://localhost:9990/`
- **Application Health**: Monitor through WildFly metrics
- **Database**: Monitor PostgreSQL performance

---

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review WildFly and application logs
3. Verify all prerequisites are installed correctly
4. Ensure database connectivity

Happy deploying! 🚀
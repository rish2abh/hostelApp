import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  
  // Enable validation pipe with transform enabled
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))

  // Enable CORS
  app.enableCors();
  // app.enableCors({
  //   origin: [
  //     'http://localhost',
  //     'capacitor://localhost',
  //     'http://ec2-13-127-220-124.ap-south-1.compute.amazonaws.com:3000'
  //   ],
  //   credentials: true, // if using cookies or authorization headers
  // });

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Hostel Management API')
    .setDescription(`
      Welcome to the Hostel Management API documentation. This API provides endpoints to manage hostel rooms, 
      beds, users, and their assignments.

      ## Authentication
      All endpoints are protected with JWT authentication. Include the JWT token in the Authorization header:
      \`\`\`
      Authorization: Bearer <your_token>
      \`\`\`

      ## Authorization
      The API implements role-based access control with the following roles:
      - SUPER_ADMIN: Full access to all endpoints
      - ADMIN: Access to management endpoints
      - USER: Limited access to view endpoints

      ## Pagination
      List endpoints support pagination with the following query parameters:
      - page: Page number (default: 1)
      - limit: Items per page (default: 10)
    `)
    .setVersion('1.0')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     description: 'Enter your JWT token',
    //   },
    //   'JWT-auth'
    // )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', // <-- key used in decorators
    )
    .addTag('Rooms', 'Room management endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Beds', 'Bed management endpoints')
    .addTag('Manager', 'Authentication endpoints')
    .addTag('Payment', 'Cash Collection endpoints')
    .addTag('Expense', 'Payout endpoints')
    .setContact('Support Team', 'https://yourwebsite.com', 'support@yourwebsite.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  
  // Customize Swagger UI
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Hostel Management API Docs',
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();

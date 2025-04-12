import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "v0.0.1",
    title: "Dokumentasi Backend API Acara",
    description: "Dokumentasi Backend API Acara",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local Server",
    },
    {
      url: "https://backend-acara-teal.vercel.app/api",
      description: "Production Server",
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
    schemas: {
      LoginRequest: {
        identifier: "admin@gmail.com",
        password: "12345678"
      },
      RegisterRequest: {
        fullName: "admin",
        username: "admin",
        email: "zhikariz@yopmail.com",
        password: "12345678",
        confirmPassword: "12345678"
      },
      ActivationRequest: {
        code: "abcdef"
      }
    }
  },
}

const outputFile = "./swagger_output.json";
const endpointsFile = ["../routes/api.ts"];


swaggerAutogen({
  openapi: "3.0.0",
})(outputFile, endpointsFile, doc);

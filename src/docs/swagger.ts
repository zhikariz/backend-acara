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
      },
      CreateCategoryRequest: {
        name: "",
        description: "",
        icon: "",
      },
      CreateEventRequest: {
        name: "",
        banner: "",
        category: "category ObjectID",
        description: "",
        startDate: "yyyy-mm-dd hh:mm:ss",
        endDate: "yyyy-mm-dd hh:mm:ss",
        location: {
          region: "region id",
          coordinates: [
            0.0,
            0.0
          ],
          address: "address",
        },
        isOnline: false,
        isFeatured: false,
        isPublish: false,
      },
      RemoveMediaRequest: {
        fileUrl: ""
      },
      CreateTicketRequest: {
        name: "",
        price: 0,
        quantity: 0,
        description: "",
        event: "event ObjectID",
      },
    }
  },
}

const outputFile = "./swagger_output.json";
const endpointsFile = ["../routes/api.ts"];


swaggerAutogen({
  openapi: "3.0.0",
})(outputFile, endpointsFile, doc);

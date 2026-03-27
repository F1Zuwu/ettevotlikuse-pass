const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Ettevotlikuse Pass API",
    version: "1.0.0",
    description: "API documentation for the backend services.",
  },
  servers: [
    {
      url: "http://localhost:3005",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Admin" },
    { name: "Experiences" },
    { name: "Categories" },
    { name: "Reflections" },
    { name: "Statistics" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          error: { type: "string" },
        },
      },
      UserAuthPayload: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      RegisterPayload: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
          birthday: { type: "string", example: "2005-01-01" },
          phone: { type: "string" },
          promotional_content: { type: "boolean", example: false },
        },
      },
      ProfileUpdatePayload: {
        type: "object",
        properties: {
          name: { type: "string" },
          phone: { type: "string" },
          birthday: { type: "string", example: "2005-01-01" },
          profileimg: { type: "string" },
          promotional_content: { type: "boolean" },
          role: { type: "string", enum: ["admin", "user"] },
          moto: { type: "string" },
        },
      },
      GoogleAuthPayload: {
        type: "object",
        required: ["accessToken", "userInfo"],
        properties: {
          accessToken: { type: "string" },
          userInfo: {
            type: "object",
            properties: {
              sub: { type: "string" },
              email: { type: "string", format: "email" },
              name: { type: "string" },
              picture: { type: "string" },
              email_verified: { type: "boolean" },
            },
          },
        },
      },
      CategoryPayload: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", example: "Leadership" },
        },
      },
      ReflectionPayload: {
        type: "object",
        required: ["question"],
        properties: {
          question: { type: "string", example: "What did you learn?" },
          name: { type: "string", description: "Used by current update endpoint implementation" },
        },
      },
      ApproveExperiencePayload: {
        type: "object",
        required: ["status"],
        properties: {
          token: { type: "string" },
          email: { type: "string", format: "email" },
          feedback: { type: "string" },
          status: { type: "string", example: "approved" },
        },
      },
      RoleUpdatePayload: {
        type: "object",
        required: ["role"],
        properties: {
          role: { type: "string", enum: ["admin", "user"] },
        },
      },
      ExperienceFormData: {
        type: "object",
        required: ["title", "date", "description", "reflectionanswer"],
        properties: {
          title: { type: "string" },
          date: { type: "string", example: "31-12-2025", description: "Expected format DD-MM-YYYY" },
          description: { type: "string" },
          reflectionanswer: { type: "string" },
          status: { type: "string", example: "ootel" },
          category_id: { type: "integer" },
          reflection_id: { type: "integer" },
          approver_email: { type: "string", format: "email" },
          proofs: {
            oneOf: [
              { type: "string", description: "JSON stringified array of proof objects" },
              {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    proof_url: { type: "string", format: "uri" },
                    file_name: { type: "string" },
                  },
                },
              },
            ],
          },
          files: {
            type: "array",
            items: { type: "string", format: "binary" },
            description: "Up to 5 upload files",
          },
        },
      },
    },
  },
  paths: {
    "/api/user/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterPayload" },
            },
          },
        },
        responses: {
          201: { description: "User created" },
          400: { description: "Validation error" },
          500: { description: "Server error" },
        },
      },
    },
    "/api/user/login": {
      post: {
        tags: ["Auth"],
        summary: "Login with email/password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UserAuthPayload" },
            },
          },
        },
        responses: {
          200: { description: "Logged in" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/google": {
      post: {
        tags: ["Auth"],
        summary: "Login with Google access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/GoogleAuthPayload" },
            },
          },
        },
        responses: {
          200: { description: "Logged in via Google" },
          400: { description: "Invalid token or payload" },
        },
      },
    },
    "/api/sessions": {
      get: {
        tags: ["Users"],
        summary: "Get current JWT session",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Session returned" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users (admin only)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Users list" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/user/profile": {
      get: {
        tags: ["Users"],
        summary: "Get own profile",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Profile returned" },
          401: { description: "Unauthorized" },
        },
      },
      put: {
        tags: ["Users"],
        summary: "Update own profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProfileUpdatePayload" },
            },
          },
        },
        responses: {
          200: { description: "Profile updated" },
          404: { description: "User not found" },
        },
      },
    },
    "/api/admin/users/{id}/role": {
      put: {
        tags: ["Admin"],
        summary: "Update user role",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RoleUpdatePayload" },
            },
          },
        },
        responses: {
          200: { description: "Role updated" },
          400: { description: "Invalid role" },
          404: { description: "User not found" },
        },
      },
    },
    "/api/experience/add": {
      post: {
        tags: ["Experiences"],
        summary: "Create experience with optional file uploads",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ExperienceFormData" },
            },
          },
        },
        responses: {
          201: { description: "Experience created" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/experience/{id}": {
      get: {
        tags: ["Experiences"],
        summary: "Get single experience",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Experience returned" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Experiences"],
        summary: "Update experience with optional file uploads",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: { $ref: "#/components/schemas/ExperienceFormData" },
            },
          },
        },
        responses: {
          200: { description: "Experience updated" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["Experiences"],
        summary: "Delete experience",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/experiences/": {
      get: {
        tags: ["Experiences"],
        summary: "Get all experiences",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Experiences list" },
        },
      },
    },
    "/api/approve": {
      get: {
        tags: ["Experiences"],
        summary: "Get experience by approval token",
        parameters: [
          {
            in: "query",
            name: "token",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Experience returned" },
          404: { description: "Not found" },
        },
      },
      post: {
        tags: ["Experiences"],
        summary: "Approve or reject experience using token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ApproveExperiencePayload" },
            },
          },
        },
        responses: {
          200: { description: "Approval submitted" },
          400: { description: "Expired token or bad payload" },
          404: { description: "Invalid token" },
        },
      },
    },
    "/api/category": {
      post: {
        tags: ["Categories"],
        summary: "Create category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryPayload" },
            },
          },
        },
        responses: {
          201: { description: "Category created" },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/category/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Category returned" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Update category",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryPayload" },
            },
          },
        },
        responses: {
          200: { description: "Category updated" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Category deleted" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get all categories",
        responses: {
          200: { description: "Categories list" },
        },
      },
    },
    "/api/reflection": {
      post: {
        tags: ["Reflections"],
        summary: "Create reflection question",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReflectionPayload" },
            },
          },
        },
        responses: {
          201: { description: "Reflection created" },
        },
      },
    },
    "/api/reflection/{id}": {
      get: {
        tags: ["Reflections"],
        summary: "Get reflection by id",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Reflection returned" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Reflections"],
        summary: "Update reflection question",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReflectionPayload" },
            },
          },
        },
        responses: {
          200: { description: "Reflection updated" },
          404: { description: "Not found" },
        },
      },
      delete: {
        tags: ["Reflections"],
        summary: "Delete reflection",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Reflection deleted" },
          404: { description: "Not found" },
        },
      },
    },
    "/api/reflections": {
      get: {
        tags: ["Reflections"],
        summary: "Get all reflections",
        responses: {
          200: { description: "Reflections list" },
        },
      },
    },
    "/api/statistics/active-users": {
      get: {
        tags: ["Statistics"],
        summary: "Count users active today",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Active user count" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/statistics/new-users": {
      get: {
        tags: ["Statistics"],
        summary: "Count users created in last 30 days",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "New user count" },
        },
      },
    },
    "/api/statistics/recent-users": {
      get: {
        tags: ["Statistics"],
        summary: "Get recent users from last 30 days",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Recent users list" },
        },
      },
    },
    "/api/statistics/experience-status": {
      get: {
        tags: ["Statistics"],
        summary: "Get experience count grouped by status",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Status distribution" },
        },
      },
    },
    "/api/statistics/popular-categories": {
      get: {
        tags: ["Statistics"],
        summary: "Top categories by experience count",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Popular categories" },
        },
      },
    },
  },
};

module.exports = swaggerDocument;
import { z } from "zod";

// Step 1 Schema (System Settings)
const stepOneSchema = z.object({
  language: z.string().nonempty("Language is required"), // Language is required
  authenticationToken: z.string().nonempty("Authentication option is required"), // Authentication is required
  broadcastToClient: z.string().nonempty("Broadcast option is required"), // Broadcast option is required
  logFullMode: z.string().nonempty("Log full mode option is required"), // Log full mode option is required
});

// Step 2 Schema (SMTP Settings)
const stepTwoSchema = z.object({
  host: z.string().min(1, { message: "Host is required" }), // Host is required
  port: z.string().min(1, { message: "Port is required" }), // Port is required
  mailSender: z.string().email({ message: "Invalid email address" }), // Email is required
  userApiKey: z.string().min(1, { message: "User/ApiKey is required" }), // API key is required
  password: z.string().min(1, { message: "Password is required" }), // Password is required
  emailTest: z.string().email({ message: "Invalid email address for test" }), // Email test is required
});

// Step 3 Schema (DAQ Storage Settings)
const stepThreeSchema = z.object({

  retentionDAQ: z.string().nonempty("retentionDAQ option is required"),
  Alarmsretention: z.string().nonempty("Alarmsretention option is required"),
});

export const CampaignFormSchema = z.object({
  stepOne: stepOneSchema,
  stepTwo: stepTwoSchema,
  stepThree: stepThreeSchema,
});

export { stepOneSchema, stepTwoSchema, stepThreeSchema };

export const ConnectionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z.string().optional(),
    description: z.string().optional(),
    lastConnected: z.string().optional(),
    polling: z.number().optional(),
    enabled: z.boolean(),
    property: z.object({
      method: z.string().optional(),
      format: z.string().optional(),
      address: z.string().optional(),
      ip: z.string().optional(),
      port: z.number().optional(),
      host: z.number().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
      DSN: z.string().optional(),
      slot: z.number().optional(),
      rack: z.number().optional(),
      databaseType: z.string().optional(), // Add this field for database type
    }),
  })
  .superRefine((data, ctx) => {
    // If enabled is true, type is required
    if (data.enabled && !data.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Type is required",
        path: ["type"],
      });
    }

    // If enabled is true, polling is required
    if (data.enabled && !data.polling) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Polling is required",
        path: ["polling"],
      });
    }

    // Type-specific validations
    if (data.type === "WebAPI") {
      if (!data.property.method) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Method is required for WebAPI type",
          path: ["property", "method"],
        });
      }
      if (!data.property.format) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format is required for WebAPI type",
          path: ["property", "format"],
        });
      }
      if (!data.property.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required for WebAPI type",
          path: ["property", "address"],
        });
      }
    }

    if (data.type === "S7") {
      if (!data.property.ip) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "IP is required for S7 type",
          path: ["property", "ip"],
        });
      }
      if (!data.property.port) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Port is required for S7 type",
          path: ["property", "port"],
        });
      }
      if (!data.property.slot) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Slot is required for S7 type",
          path: ["property", "slot"],
        });
      }
      if (!data.property.rack) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Rack is required for S7 type",
          path: ["property", "rack"],
        });
      }
    }

    // Database-specific validations
    if (data.type === "Database" && data.enabled) {
      // Ensure databaseType is selected
      if (!data.property.databaseType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Database type is required",
          path: ["property", "databaseType"],
        });
      }

      // Conditional validation based on databaseType
      if (data.property.databaseType === "sqlServer") {
        // Removed SQLAlchemyURL validation here
      }

      if (data.property.databaseType === "mysql") {
        // Removed SQLAlchemyURL validation here
      }

      if (data.property.databaseType === "sqlite") {
        // Removed SQLAlchemyURL validation here
      }

      if (data.property.databaseType === "postgrSql") {
        if (!data.property.port) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Port is required for PostgreSQL",
            path: ["property", "port"],
          });
        }
        if (!data.property.DSN) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "DSN is required for PostgreSQL",
            path: ["property", "DSN"],
          });
        }
        if (!data.property.host) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Host is required for PostgreSQL",
            path: ["property", "host"],
          });
        }
        if (!data.property.username) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Username is required for PostgreSQL",
            path: ["property", "username"],
          });
        }
        if (!data.property.password) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password is required for PostgreSQL",
            path: ["property", "password"],
          });
        }
      }
    }
  });

export const AddProjectSchema = z.object({
  name: z.string().max(50).min(1, { message: "Name is required" }),
  description: z
    .string()
    .max(1000)
    .min(1, { message: "Description is required" }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: " email is required" }),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});
export const ViewSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  description: z
    .string()
    .max(5000, { message: "Description cannot exceed 5000 characters" })
    .optional(),

  // Allow both string and number, transforming strings to numbers
  width: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !val || val >= 0, {
      message: "Width must be a positive number",
    })
    .optional(),

  height: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !val || val >= 0, {
      message: "Height must be a positive number",
    })
    .optional(),

  backgroundColor: z.string().optional(),
  gridType: z.string().optional(),
});

export const UserSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "A valid email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  group: z.string().min(1),
});

export const SignUpSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "A valid email is required" }),
  password: z
    .string()
    .min(8, { message: "Be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
    .regex(/[0-9]/, { message: "Contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Contain at least one special character.",
    })
    .trim(),
});

export const EditProfileSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().email({ message: "A valid email is required" }),
});

export const InviteSchema = z.object({
  email: z.string().email({ message: "A valid email is required" }),
});

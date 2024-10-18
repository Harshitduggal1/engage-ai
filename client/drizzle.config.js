export default {
    dialect: "postgresql",
    schema: "./src/utils/db/schema.ts",
    out: "./drizzle",
  
    dbCredentials: {
      url: "postgresql://engage_owner:Xv5G9fEBPexT@ep-orange-haze-a4tswg0u.us-east-1.aws.neon.tech/engage?sslmode=require",
      connectionString:
        "postgresql://engage_owner:Xv5G9fEBPexT@ep-orange-haze-a4tswg0u.us-east-1.aws.neon.tech/engage?sslmode=require",
    },
  };
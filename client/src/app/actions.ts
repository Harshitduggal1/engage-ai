"use server";

import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { PostSchema, SiteCreationSchema, siteSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { stripe } from "./utils/stripe";

// CreateSiteAction: Handles creating a new site
export async function CreateSiteAction(formData: FormData) {
  try {
    // Parse the form data using Zod schema validation
    const submission = await parseWithZod(formData, {
      schema: SiteCreationSchema({
        async isSubdirectoryUnique() {
          const existingSubDirectory = await prisma.site.findUnique({
            where: {
              subdirectory: formData.get("subdirectory") as string,
            },
          });
          return !existingSubDirectory;
        },
      }),
      async: true, // Make Zod validation async
    });

    // Return validation errors if form submission fails
    if (submission.status !== "success") {
      return submission.reply();
    }

    // Prisma query to create a new site
    await prisma.site.create({
      data: {
        description: submission.value.description,
        name: submission.value.name,
        subdirectory: submission.value.subdirectory,
      },
    });

    // Redirect to dashboard after successful site creation
    return redirect("/dashboards/sites");
  } catch (error) {
    console.error("Error creating site:", error);
    throw new Error("An unexpected error occurred while creating the site.");
  }
}

// CreatePostAction: Handles creating a new post
export async function CreatePostAction(formData: FormData) {
  try {
    const submission = parseWithZod(formData, {
      schema: PostSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.post.create({
      data: {
        title: submission.value.title,
        smallDescription: submission.value.smallDescription,
        slug: submission.value.slug,
        articleContent: JSON.parse(submission.value.articleContent),
        image: submission.value.coverImage,
        siteId: formData.get("siteId") as string,
      },
    });

    return redirect(`/dashboards/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("An unexpected error occurred while creating the post.");
  }
}

// EditPostActions: Handles editing an existing post
export async function EditPostActions(formData: FormData) {
  try {
    const submission = parseWithZod(formData, {
      schema: PostSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.post.update({
      where: {
        id: formData.get("articleId") as string,
      },
      data: {
        title: submission.value.title,
        smallDescription: submission.value.smallDescription,
        slug: submission.value.slug,
        articleContent: JSON.parse(submission.value.articleContent),
        image: submission.value.coverImage,
      },
    });

    return redirect(`/dashboards/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error editing post:", error);
    throw new Error("An unexpected error occurred while editing the post.");
  }
}

// DeletePost: Handles deleting an existing post
export async function DeletePost(formData: FormData) {
  try {
    await prisma.post.delete({
      where: {
        id: formData.get("articleId") as string,
      },
    });

    return redirect(`/dashboards/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("An unexpected error occurred while deleting the post.");
  }
}

// UpdateImage: Updates the image for a site
export async function UpdateImage(formData: FormData) {
  try {
    await prisma.site.update({
      where: {
        id: formData.get("siteId") as string,
      },
      data: {
        imageUrl: formData.get("imageUrl") as string,
      },
    });

    return redirect(`/dashboards/sites/${formData.get("siteId")}`);
  } catch (error) {
    console.error("Error updating image:", error);
    throw new Error("An unexpected error occurred while updating the image.");
  }
}

// DeleteSite: Deletes a site
export async function DeleteSite(formData: FormData) {
  try {
    await prisma.site.delete({
      where: {
        id: formData.get("siteId") as string,
      },
    });

    return redirect("/dashboards/sites");
  } catch (error) {
    console.error("Error deleting site:", error);
    throw new Error("An unexpected error occurred while deleting the site.");
  }
}

// CreateSubscription: Creates a subscription session with Stripe
export async function CreateSubscription() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_update: {
        address: "auto",
        name: "auto",
      },
      success_url:
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com/dashboard/payment/success"
          : "http://localhost:3000/dashboard/payment/success",
      cancel_url:
        process.env.NODE_ENV === "production"
          ? "https://your-production-url.com/dashboard/payment/cancelled"
          : "http://localhost:3000/dashboard/payment/cancelled",
    });

    return redirect(session.url as string);
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw new Error("An unexpected error occurred while creating the subscription.");
  }
}

// ValidateSite: Validates site data using Zod schema
export async function ValidateSite(siteData: any) {
  try {
    const result = siteSchema.safeParse(siteData);
    return result.success ? { isValid: true } : { isValid: false, errors: result.error.errors };
  } catch (error) {
    console.error("Error validating site:", error);
    throw new Error("An unexpected error occurred during site validation.");
  }
}

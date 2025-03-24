"use server";
import { ResetPasswordEmail } from "@/components/email-templates/reset-password";
import { db } from "@/prisma/db";
import { InvitedUserProps, UserProps } from "@/types/types";
import bcrypt, { compare } from "bcrypt";
import { revalidatePath } from "next/cache";
import { PasswordProps } from "@/components/Forms/ChangePasswordForm";
import { Resend } from "resend";
import { generateToken } from "@/lib/token";
import { OrgData } from "@/components/Forms/RegisterForm";
import { generateOTP}  from "@/lib/generateOTP";
import VerifyEmail from "@/components/email-templates/verify-email";
import { adminPermissions } from "@/config/permissions";
import { inviteData } from "@/components/Forms/users/UserInvitationForm.";
import UserInvitation from "@/components/email-templates/user-invite";
// import { generateNumericToken } from "@/lib/token";
const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const DEFAULT_USER_ROLE = {
  displayName: "User",
  roleName: "user",
  description: "Default user role with basic permissions",
  permissions: [
    "dashboard.read",
    "profile.read",
    "profile.update",
    "orders.read",
  ],
};

const ADMIN_USER_ROLE = {
  displayName: "Administrator",
  roleName: "admin",
  description: "Full system access",
  permissions: adminPermissions,
};


// export async function createUser(data: UserProps, orgData:OrgData) {
//   const { email, password, firstName, lastName, name, phone, image } = data;

//   try {
//     // Use a transaction for atomic operations
//     return await db.$transaction(async (tx) => {
//       // Check for existing users
//       const existingUserByEmail = await tx.user.findUnique({
//         where: { email },
//       });

//       const existingUserByPhone = await tx.user.findUnique({
//         where: { phone },
//       });

//       if (existingUserByEmail) {
//         return {
//           error: `This email ${email} is already in use`,
//           status: 409,
//           data: null,
//         };
//       }

//       if (existingUserByPhone) {
//         return {
//           error: `This Phone number ${phone} is already in use`,
//           status: 409,
//           data: null,
//         };
//       }

//       //Check for already existing Organization
//       const existingOrganization = await tx.organization.findUnique({
//         where: { 
//           slug: orgData.slug
//         },
//       });

//       if (existingOrganization){
//         return {
//           error: `The Organization name ${orgData.name} is already taken. Kindly create a new Organization`,
//           status: 409,
//           data: null,
//         };
//       }
//       //Create the Organization
//       const org = await db.organization.create({
//         data:orgData,
//       })

//       // Find or create default role
//       let defaultRole = await tx.role.findFirst({
//         where: { roleName: DEFAULT_USER_ROLE.roleName },
//       });

//       // Create default role if it doesn't exist
//       if (!defaultRole) {
//         defaultRole = await tx.role.create({
//           data: DEFAULT_USER_ROLE,
//         });
//       }

//       // Hash password
//       const hashedPassword = await bcrypt.hash(password, 10);

//       //Generating a 6 figure token
//  const token = generateOTP() 

//       // Create user with role
//       const newUser = await tx.user.create({
//         data: {
//           email,
//           password: hashedPassword,
//           firstName,
//           lastName,
//           name,
//           orgId: org.id,
//           orgName: org.name,
//           phone,
//           image,
//           token,
//           roles: {
//             connect: {
//               id: defaultRole.id,
//             },
//           },
//         },
//         include: {
//           roles: true, // Include roles in the response
//         },
//       });
// //Send the Verification email
// const verificationCode = newUser.token??""
//       const { data, error } = await resend.emails.send({
//         from: "IzuInventory <info@desishub.com>",
//         to: email,
//         subject: "Verify Your Account",
//         react: VerifyEmail({verificationCode }),
//       });
//       if (error) {
//         console.log(error)
//       };
//       return {
//         error: `Something went wrong, Please try again`,
//         status: 500,
//         data: null,
//       };

//       console.log(data)
//       return {
//         error: null,
//         status: 200,
//         data: {id:newUser.id, email: newUser.email},
//       };
//     });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return {
//       error: `Something went wrong, Please try again`,
//       status: 500,
//       data: null,
//     };
//   }
// }




export async function createUser(data: UserProps, orgData: OrgData) {
  const { email, password, firstName, lastName, name, phone, image } = data;

  console.log("🟢 Starting user creation process...");
  console.log("Received data:", JSON.stringify(data, null, 2));
  console.log("Received organization data:", JSON.stringify(orgData, null, 2));

  try {
    return await db.$transaction(async (tx) => {
      console.log("🔵 Checking for existing users...");

      // Check for existing users
      const existingUserByEmail = await tx.user.findUnique({ where: { email } });
      const existingUserByPhone = await tx.user.findUnique({ where: { phone } });

      if (existingUserByEmail) {
        console.log("❌ Email already in use:", email);
        return { error: `This email ${email} is already in use`, status: 409, data: null };
      }

      if (existingUserByPhone) {
        console.log("❌ Phone number already in use:", phone);
        return { error: `This phone number ${phone} is already in use`, status: 409, data: null };
      }

      console.log("🔵 Checking for existing organization...");
      const existingOrganization = await tx.organization.findUnique({ where: { slug: orgData.slug } });

      if (existingOrganization) {
        console.log("❌ Organization already exists:", orgData.name);
        return { error: `The organization name ${orgData.name} is already taken. Kindly create a new organization`, status: 409, data: null };
      }

      console.log("🔵 Validating organization data...");
      if (!orgData.name || !orgData.slug || !orgData.country || !orgData.currency || !orgData.timezone) {
        console.error("❌ Missing required organization fields:", orgData);
        return { error: "Invalid organization data. Please provide all required fields.", status: 400, data: null };
      }

      console.log("🟢 Creating organization...");
      const org = await tx.organization.create({
        data: {
          name: orgData.name,
          slug: orgData.slug,
          country: orgData.country,
          currency: orgData.currency,
          timeZone: orgData.timezone,
          state: orgData.state ?? null,
          address: orgData.address ?? null,
          industry: orgData.industry ?? null,
          inventory: orgData.inventory ?? false,
          startDate: orgData.startDate ?? new Date(),
          fiscalYear: orgData.fiscalYear ?? null,
        },
      });
      console.log("✅ Organization created successfully:", org.id);

      console.log("🟢 Looking for default user role...");
      //Find or Create a default Admin role
      let defaultRole = await tx.role.findFirst({ where: { roleName: ADMIN_USER_ROLE.roleName } });

      if (!defaultRole) {
        console.log("🟢 Creating default user role...");
        defaultRole = await tx.role.create({ data: ADMIN_USER_ROLE });
      }

      console.log("🟢 Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);

      console.log("🟢 Generating verification token...");
      const token = generateOTP();
      console.log("Generated token:", token);

      console.log("🟢 Creating new user...");
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          name,
          orgId: org.id,
          orgName: org.name,
          phone,
          image,
          token,
          roles: { connect: { id: defaultRole.id } },
        },
        include: { roles: true },
      });

      console.log("✅ User created successfully:", newUser.id);

      console.log("🟢 Preparing email verification...");
      if (!newUser.token) {
        console.error("❌ User token is missing. Email verification cannot proceed.");
        return { error: "Failed to generate verification token.", status: 500, data: null };
      }

      console.log("Verification code:", newUser.token);

      console.log("🟢 Generating email template...");
      const emailTemplate = VerifyEmail({ verificationCode: newUser.token });

      if (!emailTemplate) {
        console.error("❌ Email template generation failed! It returned null or undefined.");
        return { error: "Failed to generate email verification template.", status: 500, data: null };
      }

      console.log("Generated email template:", emailTemplate);

      console.log("🟢 Sending verification email...");
      try {
        const { data: emailResponse, error: emailError } = await resend.emails.send({
          from: "IzuInventory <izu@inventory.mirronet.com>",
          to: email,
          subject: "Verify Your Account",
          react: emailTemplate,
        });

        if (emailError) {
          console.error("❌ Email sending failed:", emailError);
        } else {
          console.log("✅ Verification email sent successfully:", emailResponse);
        }
      } catch (emailErr) {
        console.error("❌ Exception occurred while sending email:", emailErr);
      }

      return { error: null, status: 200, data: { id: newUser.id, email: newUser.email } };
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return { error: "Something went wrong, Please try again", status: 500, data: null };
  }
}
export async function createInvitedUser(data: InvitedUserProps) {
  const { email, password, firstName, lastName, name, phone, image,orgId,roleId, orgName } = data;

  console.log("🟢 Starting user creation process...");
 

  try {
    return await db.$transaction(async (tx) => {
      console.log("🔵 Checking for existing users...");

      // Check for existing users
      const existingUserByEmail = await tx.user.findUnique({ where: { email } });
      const existingUserByPhone = await tx.user.findUnique({ where: { phone } });

      if (existingUserByEmail) {
        console.log("❌ Email already in use:", email);
        return { error: `This email ${email} is already in use`, status: 409, data: null };
      }

      if (existingUserByPhone) {
        console.log("❌ Phone number already in use:", phone);
        return { error: `This phone number ${phone} is already in use`, status: 409, data: null };
      }
      

      console.log("🟢 Hashing password...");
      const hashedPassword = await bcrypt.hash(password, 10);

  

      console.log("🟢 Creating new user...");
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          name,
          orgId: orgId,
          orgName: orgName,
          phone,
          image,
         
          roles: { connect: { id: roleId} },
        },
  
      });


      return { error: null, status: 200, data: { id: newUser.id, email: newUser.email } };
    });
  } catch (error) {
    console.error("❌ Error creating user:", error);
    return { error: "Something went wrong, Please try again", status: 500, data: null };
  }
}


export async function getAllMembers() {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return members;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
export async function getAllUsers() {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        roles: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
export async function getOrgUsers(orgId:string) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where:{
        orgId
      },
      include: {
        roles: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
export async function getOrgInvites(orgId:string) {
  try {
    const users = await db.invite.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where:{
        orgId
      },
      select:{
        email: true,
        id: true,
        createdAt:true,
        updatedAt:true,
        status:true,
      }
    });
    return users;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}

export async function deleteUser(id: string) {
  try {
    const deleted = await db.user.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deleted,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function sendResetLink(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        status: 404,
        error: "We cannot associate this email with any user",
        data: null,
      };
    }
    const token = generateToken();
    const update = await db.user.update({
      where: {
        email,
      },
      data: {
        token,
      },
    });
    const userFirstname = user.firstName;

    const resetPasswordLink = `${baseUrl}/reset-password?token=${token}&&email=${email}`;
    const { data, error } = await resend.emails.send({
      from: "IzuInventory <izu@inventory.mirronet.com>",
      to: email,
      subject: "Reset Password Request",
      react: ResetPasswordEmail({ userFirstname, resetPasswordLink }),
    });
    if (error) {
      return {
        status: 404,
        error: error.message,
        data: null,
      };
    }
    console.log(data);
    return {
      status: 200,
      error: null,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "We cannot find your email",
      data: null,
    };
  }
}

export async function updateUserPassword(id: string, data: PasswordProps) {
  const existingUser = await db.user.findUnique({
    where: {
      id,
    },
  });
  // Check if the Old Passw = User Pass
  let passwordMatch: boolean = false;
  //Check if Password is correct
  if (existingUser && existingUser.password) {
    // if user exists and password exists
    passwordMatch = await compare(data.oldPassword, existingUser.password);
  }
  if (!passwordMatch) {
    return { error: "Old Password Incorrect", status: 403 };
  }
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    revalidatePath("/dashboard/clients");
    return { error: null, status: 200 };
  } catch (error) {
    console.log(error);
  }
}
export async function resetUserPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const user = await db.user.findUnique({
    where: {
      email,
      token,
    },
  });
  if (!user) {
    return {
      status: 404,
      error: "Please use a valid reset link",
      data: null,
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        email,
        token,
      },
      data: {
        password: hashedPassword,
      },
    });
    return {
      status: 200,
      error: null,
      data: null,
    };
  } catch (error) {
    console.log(error);
  }
}
// export async function verifyOTP(userId:string, otp:string){
//  try {
//   const user = await db.user.findUnique({
//     where:{
//       id:userId
//     }
//   })
//   if(user?.token !==otp){
//     return{
//       status:403
//     }
//   };
//   {
//     return{
//       status:200
//     }
//   };
  
//  } catch (error) {
  
//  }
// }



// function generateOTP() {
//   throw new Error("Function not implemented.");
// }

// function generateOTP() {
//   throw new Error("Function not implemented.");
// }

// function generateOTP() {
//   throw new Error("Function not implemented.");
// }

// export async function verifyOTP(userId: string, otp: string) {
//   try {
//     const user = await db.user.findUnique({
//       where: {
//         id: userId,
//       },
//     });

//     if (user?.token !== otp) {
//       return {
//         status: 403,
//       };
//     }

//     return {
//       status: 200,
//     };
//     const update = await db.user.update({
//       where: {
//         id:userId,
//       },
//       data: {
//         isVerfied:true,
//       },
//     });

//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return {
//       status: 500, // Ensure a response is always returned
//     };
//   }
// }

export async function verifyOTP(userId: string, otp: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user || user.token !== otp) {
      return {
        status: 403,
      };
    }

    // Ensure the update runs before returning a response
    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerfied: true, // Fix typo: should be `isVerified`
      },
    });

    return {
      status: 200,
    };

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return {
      status: 500,
    };
  }
}

export async function getCurrentUsersCount(){
  try {
    const count = await db.user.count();
    return count;
    
  } catch (error) {
    console.error("Error getting current users count:", error);
    return 0;
    
  }
}

// export async function sendInvite(data: inviteData) {
//   const { email, orgId, orgName, roleId, roleName} = data;
//   try {
//       // Check for existing users
//       const existingUserByEmail = await db.user.findUnique({ where: { email} });
//       if (existingUserByEmail) {
//         console.log("❌ Email already in use:", email);
//         return { error: `This email ${email} is already in use`, status: 409, data: null };
//       }

//       //check if this user is already invited
//       const existingInvite = await db.invite.findFirst({ where: { email} });
//       if (existingInvite) {
//         console.log("❌ Email already in use:", email);
//         return { error: `This user ${email} is already invited`, status: 409, data: null };
//       }
//       //Sending email verification link
//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//      const linkUrl = `${baseUrl}/user-invite/${orgId}?roleId=${roleId}&&email=${email}&&orgName=${orgName}`;
//         const { data, error } = await resend.emails.send({
//           from: "IzuInventory <izu@inventory.mirronet.com>",
//           to: email,
//           subject: `Welcome to ${orgName} Inventory Management Team`,
//           react: UserInvitation({orgName, roleName, linkUrl})
//         });

//         if (error) {
//           console.log(error); // Removed incorrect `{`
//           return {
//             error: "Something went wrong, try again",
//             status: 500,
//             data: null,
//           };
//         }
        
//         console.log(data);
//         return {
//           error: null,
//           status: 200,
//           data,
//         };
//   }
export async function sendInvite(data: inviteData) {
  const { email, orgId, orgName, roleId, roleName } = data;
  try {
    // Check for existing users
    const existingUserByEmail = await db.user.findUnique({ where: { email } });
    if (existingUserByEmail) {
      console.log("❌ Email already in use:", email);
      return { error: `This email ${email} is already in use`, status: 409, data: null };
    }

    // Check if this user is already invited
    const existingInvite = await db.invite.findFirst({ where: { email } });
    if (existingInvite) {
      console.log("❌ Email already in use:", email);
      return { error: `This user ${email} is already invited`, status: 409, data: null };
    }

    //Create Invite
    await db.invite.create({
      data:{
        email,
        orgId,
      },
    })

    // Sending email verification link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const linkUrl = `${baseUrl}/user-invite/${orgId}?roleId=${roleId}&&email=${email}&&orgName=${orgName}`;
    const { data, error } = await resend.emails.send({
      from: "IzuInventory <izu@inventory.mirronet.com>",
      to: email,
      subject: `Welcome to ${orgName} Inventory Management Team`,
      react: UserInvitation({ orgName, roleName, linkUrl }),
    });

    if (error) {
      console.log(error);
      return {
        error: "Something went wrong, try again",
        status: 500,
        data: null,
      };
    }

    console.log(data);
    return {
      error: null,
      status: 200,
      data,
    };
  } catch (err) {
    console.error("Unexpected error:", err);
    return {
      error: "Internal server error",
      status: 500,
      data: null,
    };
  }
} 

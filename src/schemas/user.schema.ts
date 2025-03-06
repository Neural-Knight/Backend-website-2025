import { z } from 'zod';

const certificateSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  organization: z.string(),
  issueDate: z.string(),
  description: z.string().optional(),
  image: z.string().optional()
});

const projectSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  organization: z.string(),
  finishDate: z.string(),
  description: z.string().optional(),
  image: z.string().optional()
});

export const updateUserSchema = z.object({
  phoneNumber: z.string().length(10, 'Phone number must be 10 digits').optional(),
  emergencyMobileNumber: z.string().optional(),
  yearOfPassing: z.number().int('Year must be a valid integer').optional(),
  emailId: z.string().email('Valid email is required').optional(),
  roomNumber: z.string().optional(),
  dateOfBirth: z.string().refine(
      (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
      { message: 'Date of birth must be in format YYYY-MM-DD' }
    ).optional(),
  image: z.string().optional(),
  about: z.string().optional(),
  experience: z.string().optional(),
  skills: z.array(z.string()).optional(),
  certificates: z.array(certificateSchema).optional(),
  projects: z.array(projectSchema).optional(),
});

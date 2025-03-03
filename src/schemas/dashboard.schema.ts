import { z } from 'zod';

export const updateDashboardSchema = z.object({
  phoneNumber: z.string().length(10, 'Phone number must be 10 digits').optional(),
  emergencyMobileNumber: z.string().optional(),
  yearOfPassing: z.number().int('Year must be a valid integer').optional(),
  emailId: z.string().email('Valid email is required').optional(),
  roomNumber: z.string().optional(),
  dateOfBirth: z.string().refine(
      (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
      { message: 'Date of birth must be in format YYYY-MM-DD' }
    ).optional(),
});

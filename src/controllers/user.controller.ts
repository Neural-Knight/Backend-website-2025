import { Response } from 'express';
import { prisma } from '../lib/prisma';
import { updateDashboardSchema } from '../schemas/dashboard.schema'
import { AuthRequest } from '../middleware/auth.middleware';

export const getUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          rollNumber: true,
          phoneNumber: true,
          rkId: true,
          department: true,
          emailId: true,
          instituteEmailId: true,
          yearOfPassing: true,
          dateOfBirth: true,
          emergencyMobileNumber: true,
          roomNumber: true,
        },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId;
      const result = updateDashboardSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
      }
      const data = result.data;
      
      const updateData = { ...data } as { [key: string]: any };
      if (updateData.dateOfBirth) {
        updateData.dateOfBirth = new Date(updateData.dateOfBirth);
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          rollNumber: true,
          phoneNumber: true,
          rkId: true,
          department: true,
          emailId: true,
          instituteEmailId: true,
          yearOfPassing: true,
          dateOfBirth: true,
          emergencyMobileNumber: true,
          roomNumber: true,
        },
      });
      res.json({ user: updatedUser });
    } catch (error) {
      console.error('Error updating dashboard:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

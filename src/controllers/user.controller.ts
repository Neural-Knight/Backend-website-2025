import { Request,Response } from 'express';
import { prisma } from '../lib/prisma';
import { updateUserSchema } from '../schemas/user.schema'
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
          image: true,
          about: true,
          experience: true,
          skills: true,
          certificates: {
            select: {
              id: true,
              title: true,
              organization: true,
              issueDate: true,
              description: true,
              image: true
            },
          },
            projects: {
              select: {
                id: true,
                title: true,
                organization: true,
                finishDate: true,
                description: true,
                image: true
              },
            },
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
      const result = updateUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
      }
      const data = result.data;
      
      const {certificates, projects, dateOfBirth, ...coreData} = data;
      const updateData: {[key: string]: any} = {...coreData};
      if (dateOfBirth) {
        updateData.dateOfBirth = new Date(dateOfBirth);
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
      
      if(certificates) {
        for(const certificate of certificates) {
          if(certificate.id){
            await prisma.certificate.update({
              where:{id : certificate.id},
              data:{
                title: certificate.title,
                organization: certificate.organization,
                issueDate: new Date(certificate.issueDate),
                description: certificate.description,
                image: certificate.image,
              },
            });
          }else{
            await prisma.certificate.create({
              data:{
                title: certificate.title,
                organization: certificate.organization,
                issueDate: new Date(certificate.issueDate),
                description: certificate.description,
                image: certificate.image,
                userId: userId!,
              },
            });
          }
        }
      }

      if(projects){
        for(const project of projects){
          if(project.id){
            await prisma.project.update({
              where:{id: project.id},
              data:{
                title: project.title,
                organization: project.organization,
                finishDate: new Date(project.finishDate),
                description: project.description,
                image: project.image,
              },
            });
          }else{
            await prisma.project.create({
              data:{
                title: project.title,
                organization: project.organization,
                finishDate: new Date(project.finishDate),
                description: project.description,
                image: project.image,
                userId: userId!,
              },
            });
          }
        }
      }

      const finalUser= await prisma.user.findUnique({
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
          image: true,
          about: true,
          experience: true,
          skills: true,
          certificates: {
            select: {
              id: true,
              title: true,
              organization: true,
              issueDate: true,
              description: true,
              image: true,
            },
          },
            projects: {
              select: {
                id: true,
                title: true,
                organization: true,
                finishDate: true,
                description: true,
                image: true,
              },
            },
        }
      });
      res.json({ user: finalUser });
      } catch (error) {
        console.error('Error updating dashboard:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  };

import { db } from './db';
import { compare } from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
  userType: string;
  hasCompletedSurvey: boolean;
  hasCarePlan: boolean;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  error?: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      console.log('Attempting to find user with email:', email);
      
      const user = await db.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          userType: true,
          hasCompletedSurvey: true,
          carePlans: {
            select: {
              id: true
            }
          }
        }
      });

      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        console.log('No user found with email:', email);
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      console.log('Comparing passwords...');
      const isValid = await compare(password, user.password);
      console.log('Password comparison result:', isValid ? 'Valid' : 'Invalid');

      if (!isValid) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Remove password from user object
      const { password: _, carePlans, ...userWithoutPassword } = user;

      // Check if user has any care plans
      const hasCarePlan = carePlans.length > 0;
      console.log('User has care plans:', hasCarePlan);

      const userWithDefaults: User = {
        id: user.id,
        email: user.email,
        name: user.name ?? '', // in case it's null
        userType: user.userType,
        hasCompletedSurvey: user.hasCompletedSurvey ?? false,
        hasCarePlan
      }
      

      console.log('Returning user data:', userWithDefaults);

      return {
        success: true,
        user: userWithDefaults
      };
    } catch (error) {
      console.error('Login error details:', error);
      return {
        success: false,
        error: 'An error occurred during login'
      };
    }
  }
}; 
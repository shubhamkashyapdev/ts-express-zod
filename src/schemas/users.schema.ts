import { z } from 'zod';

export const userRegisterZodSchema = z.object({
  body: z
    .object({
      username: z.string({
        required_error: 'Username is required',
      }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email address'),
      phone: z
        .string({
          required_error: 'Phone number is required',
        })
        .min(10, 'Not a valid phone number'),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(6, 'Password must be at least 6 characters long')
        .max(255, 'Password must be less than 255 characters long'),
      confirmPassword: z
        .string({
          required_error: 'Confirm Password is required',
        })
        .optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Password do not match',
      path: ['confirmPassword'],
    }),
});

export const userLoginZodSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Please provide a username',
    }),
    password: z.string({
      required_error: 'Please provide a password',
    }),
  }),
});

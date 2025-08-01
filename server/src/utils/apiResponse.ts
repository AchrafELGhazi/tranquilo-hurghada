import { Response } from 'express';

// Success response interface
interface ApiSuccessResponse {
  success: true;
  message?: string;
  data?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
    timestamp?: string;
  };
}

// Error response interface
interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    type?: string;
    details?: any;
    stack?: string;
  };
  timestamp?: string;
}

// Main API Response Helper Class
export class ApiResponse {
  // SUCCESS RESPONSES

  // Basic success
  static success(res: Response, data?: any, message?: string) {
    const response: ApiSuccessResponse = {
      success: true,
      ...(message && { message }),
      ...(data && { data }),
    };

    return res.status(200).json(response);
  }

  // Created (201)
  static created(
    res: Response,
    data?: any,
    message: string = 'Resource created successfully'
  ) {
    const response: ApiSuccessResponse = {
      success: true,
      message,
      ...(data && { data }),
    };

    return res.status(201).json(response);
  }

  // No content (204)
  static noContent(res: Response) {
    return res.status(204).send();
  }

  // Success with pagination
  static successWithPagination(
    res: Response,
    data: any,
    pagination: { page: number; limit: number; total: number; pages: number },
    message?: string
  ) {
    const response: ApiSuccessResponse = {
      success: true,
      ...(message && { message }),
      data,
      meta: {
        ...pagination,
        timestamp: new Date().toISOString(),
      },
    };

    return res.status(200).json(response);
  }

  // ERROR RESPONSES

  // Bad request (400)
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    details?: any
  ) {
    const response: ApiErrorResponse = {
      success: false,
      message,
      ...(details && {
        error: {
          type: 'BAD_REQUEST',
          details,
        },
      }),
      timestamp: new Date().toISOString(),
    };

    return res.status(400).json(response);
  }

  // Unauthorized (401)
  static unauthorized(res: Response, message: string = 'Unauthorized access') {
    const response: ApiErrorResponse = {
      success: false,
      message,
      error: { type: 'UNAUTHORIZED' },
      timestamp: new Date().toISOString(),
    };

    return res.status(401).json(response);
  }

  // Forbidden (403)
  static forbidden(res: Response, message: string = 'Access forbidden') {
    const response: ApiErrorResponse = {
      success: false,
      message,
      error: { type: 'FORBIDDEN' },
      timestamp: new Date().toISOString(),
    };

    return res.status(403).json(response);
  }

  // Not found (404)
  static notFound(res: Response, message: string = 'Resource not found') {
    const response: ApiErrorResponse = {
      success: false,
      message,
      error: { type: 'NOT_FOUND' },
      timestamp: new Date().toISOString(),
    };

    return res.status(404).json(response);
  }

  // Validation error (422)
  static validationError(
    res: Response,
    errors: any,
    message: string = 'Validation failed'
  ) {
    const response: ApiErrorResponse = {
      success: false,
      message,
      error: {
        type: 'VALIDATION_ERROR',
        details: errors,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(422).json(response);
  }

  // Internal server error (500)
  static serverError(
    res: Response,
    message: string = 'Internal server error',
    error?: Error
  ) {
    const response: ApiErrorResponse = {
      success: false,
      message,
      error: {
        type: 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' &&
          error && {
            details: error.message,
            stack: error.stack,
          }),
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(500).json(response);
  }

  // Custom response
  static custom(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: any
  ) {
    const response = {
      success,
      message,
      ...(data && { data }),
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }
}

// SIMPLIFIED HELPER FUNCTIONS (even easier to use)

export const sendSuccess = (res: Response, data?: any, message?: string) => {
  return ApiResponse.success(res, data, message);
};

export const sendCreated = (res: Response, data?: any, message?: string) => {
  return ApiResponse.created(res, data, message);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  details?: any
) => {
  const response: ApiErrorResponse = {
    success: false,
    message,
    ...(details && { error: { details } }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

export const sendBadRequest = (
  res: Response,
  message?: string,
  details?: any
) => {
  return ApiResponse.badRequest(res, message, details);
};

export const sendNotFound = (res: Response, message?: string) => {
  return ApiResponse.notFound(res, message);
};

export const sendUnauthorized = (res: Response, message?: string) => {
  return ApiResponse.unauthorized(res, message);
};

export const sendServerError = (
  res: Response,
  message?: string,
  error?: Error
) => {
  return ApiResponse.serverError(res, message, error);
};

// USAGE EXAMPLES IN CONTROLLERS:

/*
// src/controllers/userController.ts
import { Request, Response } from 'express';
import { ApiResponse, sendSuccess, sendCreated, sendNotFound } from '../utils/apiResponse';
import { asyncHandler } from '../middleware/asyncHandler';

// Using ApiResponse class
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find();
  return ApiResponse.success(res, users, 'Users retrieved successfully');
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return ApiResponse.notFound(res, 'User not found');
  }
  
  return ApiResponse.success(res, user);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.create(req.body);
  return ApiResponse.created(res, user, 'User created successfully');
});

// Using simple helper functions
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
  if (!user) {
    return sendNotFound(res, 'User not found');
  }
  
  return sendSuccess(res, user, 'User updated successfully');
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  
  if (!user) {
    return sendNotFound(res, 'User not found');
  }
  
  return ApiResponse.noContent(res);
});

// With pagination
export const getUsersWithPagination = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const users = await User.find()
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
  const total = await User.countDocuments();
  
  return ApiResponse.successWithPagination(
    res,
    users,
    {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
    'Users retrieved successfully'
  );
});

// Validation error example
export const validateAndCreateUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  const errors: any = {};
  if (!name) errors.name = 'Name is required';
  if (!email) errors.email = 'Email is required';
  
  if (Object.keys(errors).length > 0) {
    return ApiResponse.validationError(res, errors);
  }
  
  const user = await User.create(req.body);
  return sendCreated(res, user);
});
*/

// RESPONSE EXAMPLES:

/*
// Success Response:
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    { "id": 1, "name": "John", "email": "john@example.com" }
  ]
}

// Success with Pagination:
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "timestamp": "2025-01-01T10:00:00.000Z"
  }
}

// Error Response:
{
  "success": false,
  "message": "User not found",
  "error": {
    "type": "NOT_FOUND"
  },
  "timestamp": "2025-01-01T10:00:00.000Z"
}

// Validation Error:
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "type": "VALIDATION_ERROR",
    "details": {
      "name": "Name is required",
      "email": "Email is required"
    }
  },
  "timestamp": "2025-01-01T10:00:00.000Z"
}
*/

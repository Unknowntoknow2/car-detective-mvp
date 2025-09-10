import { ErrorHandler, ResponseBuilder, withErrorHandling, AppError } from '../../src/utils/errorHandling';

describe('Error Handling Utilities', () => {
  describe('ErrorHandler', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should create proper error objects', () => {
      const error = ErrorHandler.createError(
        'TEST_ERROR',
        'Test message',
        { field: 'test' },
        new Error('Original'),
        'test-context'
      );

      expect(error).toMatchObject({
        code: 'TEST_ERROR',
        message: 'Test message',
        details: { field: 'test' },
        context: 'test-context'
      });
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.originalError).toBeInstanceOf(Error);
    });

    it('should log errors with proper structure', () => {
      const mockError: AppError = {
        code: 'TEST_ERROR',
        message: 'Test message',
        timestamp: new Date(),
        context: 'test'
      };

      ErrorHandler.logError(mockError);

      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('TEST_ERROR'),
        expect.objectContaining({
          context: 'test',
          details: undefined
        })
      );
    });

    it('should handle API errors from Error instances', () => {
      const originalError = new Error('API failed');
      const result = ErrorHandler.handleApiError(originalError, 'api-call');

      expect(result.code).toBe('API_ERROR');
      expect(result.message).toBe('API failed');
      expect(result.originalError).toBe(originalError);
      expect(result.context).toBe('api-call');
    });

    it('should handle unknown API errors', () => {
      const result = ErrorHandler.handleApiError('string error', 'api-call');

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('An unknown error occurred');
      expect(result.details).toEqual({ originalError: 'string error' });
    });

    it('should handle database errors', () => {
      const dbError = new Error('Connection failed');
      const result = ErrorHandler.handleDatabaseError(dbError, 'insert');

      expect(result.code).toBe('DATABASE_ERROR');
      expect(result.message).toBe('Database operation failed: insert');
      expect(result.details).toEqual({ operation: 'insert' });
      expect(result.context).toBe('database');
    });

    it('should handle validation errors', () => {
      const result = ErrorHandler.handleValidationError('email', 'invalid-email', 'valid email format');

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toBe("Validation failed for field 'email': valid email format");
      expect(result.details).toEqual({
        field: 'email',
        value: 'invalid-email',
        rule: 'valid email format'
      });
      expect(result.context).toBe('validation');
    });
  });

  describe('ResponseBuilder', () => {
    it('should create success responses', () => {
      const data = { id: 1, name: 'test' };
      const response = ResponseBuilder.success(data, { requestId: 'req-123' });

      expect(response.success).toBe(true);
      expect(response.data).toBe(data);
      expect(response.metadata).toMatchObject({
        version: '1.0.0',
        requestId: 'req-123'
      });
      expect(response.metadata?.timestamp).toBeInstanceOf(Date);
    });

    it('should create error responses', () => {
      const error: AppError = {
        code: 'TEST_ERROR',
        message: 'Test error',
        timestamp: new Date()
      };
      const response = ResponseBuilder.error(error, { requestId: 'req-123' });

      expect(response.success).toBe(false);
      expect(response.error).toBe(error);
      expect(response.metadata).toMatchObject({
        version: '1.0.0',
        requestId: 'req-123'
      });
    });
  });

  describe('withErrorHandling', () => {
    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should return success response for successful operations', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await withErrorHandling(operation, 'test-context');

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(operation).toHaveBeenCalled();
    });

    it('should return error response for failed operations', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Operation failed'));
      const result = await withErrorHandling(operation, 'test-context');

      expect(result.success).toBe(false);
      expect(result.error).toMatchObject({
        code: 'API_ERROR',
        message: 'Operation failed',
        context: 'test-context'
      });
    });

    it('should handle non-Error rejections', async () => {
      const operation = jest.fn().mockRejectedValue('string error');
      const result = await withErrorHandling(operation, 'test-context');

      expect(result.success).toBe(false);
      expect(result.error?.code).toBe('UNKNOWN_ERROR');
      expect(result.error?.details).toEqual({ originalError: 'string error' });
    });
  });
});

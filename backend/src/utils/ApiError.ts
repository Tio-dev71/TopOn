export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, errors?: any[]) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Không có quyền truy cập') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Không có quyền thực hiện hành động này') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Không tìm thấy') {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message = 'Lỗi server nội bộ') {
    return new ApiError(500, message);
  }
}

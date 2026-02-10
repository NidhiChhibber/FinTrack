package com.fintrack.common;

public class ApiResponse<T> {
  private boolean success;
  private T data;
  private String error;
  private Object details;
  private Pagination pagination;

  public ApiResponse() {}

  public static <T> ApiResponse<T> success(T data) {
    ApiResponse<T> response = new ApiResponse<>();
    response.success = true;
    response.data = data;
    return response;
  }

  public static <T> ApiResponse<T> success(T data, Pagination pagination) {
    ApiResponse<T> response = new ApiResponse<>();
    response.success = true;
    response.data = data;
    response.pagination = pagination;
    return response;
  }

  public static <T> ApiResponse<T> failure(String error, Object details) {
    ApiResponse<T> response = new ApiResponse<>();
    response.success = false;
    response.error = error;
    response.details = details;
    return response;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public T getData() {
    return data;
  }

  public void setData(T data) {
    this.data = data;
  }

  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
  }

  public Object getDetails() {
    return details;
  }

  public void setDetails(Object details) {
    this.details = details;
  }

  public Pagination getPagination() {
    return pagination;
  }

  public void setPagination(Pagination pagination) {
    this.pagination = pagination;
  }
}

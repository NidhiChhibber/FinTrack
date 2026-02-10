package com.fintrack.common;

public class Pagination {
  private int page;
  private int limit;
  private long total;
  private boolean hasMore;

  public Pagination() {}

  public Pagination(int page, int limit, long total, boolean hasMore) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.hasMore = hasMore;
  }

  public int getPage() {
    return page;
  }

  public void setPage(int page) {
    this.page = page;
  }

  public int getLimit() {
    return limit;
  }

  public void setLimit(int limit) {
    this.limit = limit;
  }

  public long getTotal() {
    return total;
  }

  public void setTotal(long total) {
    this.total = total;
  }

  public boolean isHasMore() {
    return hasMore;
  }

  public void setHasMore(boolean hasMore) {
    this.hasMore = hasMore;
  }
}

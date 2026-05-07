import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ProductCard } from '../components/ProductCard';
import { productService, categoryService } from '../services/api';
import type { ProductSummary, Category, Brand, PageResponse } from '../types';
import {
  Loader2, AlertCircle, ChevronLeft, ChevronRight,
  Search, X, ChevronDown, ChevronUp,
} from 'lucide-react';

const PAGE_SIZE = 12;
const COLLAPSED_LIMIT = 5;

// ─── FilterSection — mỗi nhóm danh mục/thương hiệu ───────────────────────────

interface FilterItem { id: number; label: string }

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, items, selectedId, onSelect }) => {
  const [expanded, setExpanded] = useState(false);

  const hasMore = items.length > COLLAPSED_LIMIT;
  const visibleItems = expanded ? items : items.slice(0, COLLAPSED_LIMIT);

  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </p>
      <ul className="space-y-0.5">
        {/* Mục "Tất cả" */}
        <li>
          <button
            onClick={() => onSelect(null)}
            className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${
              selectedId === null
                ? 'bg-emerald-50 text-emerald-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Tất cả
          </button>
        </li>

        {visibleItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item.id)}
              className={`w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors truncate ${
                selectedId === item.id
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Nút Xem thêm / Thu gọn */}
      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex items-center gap-1 px-2 py-1 text-xs text-emerald-600 hover:text-emerald-800 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3" />
              Thu gọn
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3" />
              Xem thêm ({items.length - COLLAPSED_LIMIT})
            </>
          )}
        </button>
      )}
    </div>
  );
};

// ─── SearchInput ───────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear, className = '' }) => (
  <div className={`relative ${className}`}>
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Tìm kiếm sản phẩm..."
      className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
    />
    {value && (
      <button
        onClick={onClear}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label="Xoá tìm kiếm"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

// ─── Home Page ─────────────────────────────────────────────────────────────────

export const Home: React.FC = () => {
  // ─── Product state ───────────────────────────────────────────────────────────
  const [pageData, setPageData] = useState<PageResponse<ProductSummary> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // ─── Filter state ────────────────────────────────────────────────────────────
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);

  // ─── Sidebar data ────────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // ─── Debounce keyword ────────────────────────────────────────────────────────
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedKeyword(val);
      setPage(0);
    }, 500);
  };

  const clearKeyword = () => {
    setKeyword('');
    setDebouncedKeyword('');
    setPage(0);
  };

  // ─── Fetch sidebar data once ─────────────────────────────────────────────────
  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
    categoryService.getBrands().then(setBrands).catch(() => {});
  }, []);

  // ─── Fetch products ──────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getProducts({
        page,
        size: PAGE_SIZE,
        keyword: debouncedKeyword || undefined,
        categoryId: selectedCategoryId,
        brandId: selectedBrandId,
      });
      setPageData(data);
    } catch {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedKeyword, selectedCategoryId, selectedBrandId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategorySelect = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(0);
  };

  const handleBrandSelect = (id: number | null) => {
    setSelectedBrandId(id);
    setPage(0);
  };

  const products = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 0;

  // Chuẩn hóa sang FilterItem[]
  const categoryItems: FilterItem[] = categories.map((c) => ({ id: c.id, label: c.categoryName }));
  const brandItems: FilterItem[] = brands.map((b) => ({ id: b.id, label: b.brandName }));

  return (
    <div className="flex gap-8">
      {/* ─── Sidebar — Desktop ───────────────────────────────────────────── */}
      <aside className="hidden lg:block w-52 flex-shrink-0">
        <SearchInput
          value={keyword}
          onChange={handleKeywordChange}
          onClear={clearKeyword}
          className="mb-5"
        />

        {categoryItems.length > 0 && (
          <FilterSection
            title="Danh mục"
            items={categoryItems}
            selectedId={selectedCategoryId}
            onSelect={handleCategorySelect}
          />
        )}

        {brandItems.length > 0 && (
          <FilterSection
            title="Thương hiệu"
            items={brandItems}
            selectedId={selectedBrandId}
            onSelect={handleBrandSelect}
          />
        )}
      </aside>

      {/* ─── Main Content ───────────────────────────────────────────────── */}
      <div className="flex-1 min-w-0">
        {/* Mobile search */}
        <SearchInput
          value={keyword}
          onChange={handleKeywordChange}
          onClear={clearKeyword}
          className="mb-5 lg:hidden"
        />

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-semibold text-gray-900">
            Sản phẩm
            {pageData && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({pageData.totalElements} kết quả)
              </span>
            )}
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-emerald-600 gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="text-sm text-gray-500">Đang tải sản phẩm...</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-center gap-2 p-4 text-red-700 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16 text-gray-500 border border-gray-200 rounded-lg bg-white">
            <p className="font-medium">Không tìm thấy sản phẩm nào</p>
            <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={pageData?.first}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Trước
                </button>

                <span className="text-sm text-gray-600 px-2">
                  Trang {page + 1} / {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={pageData?.last}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Tiếp
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

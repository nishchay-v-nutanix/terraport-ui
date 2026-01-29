import { useState, useCallback, useMemo } from 'react';
import {
  AnyResourceMapping,
  TranslationStats,
  FilterState,
  ConfidenceLevel,
  ResourceFilterType,
  ConfidenceFilterType,
} from '../types';

interface UseTranslationStateReturn {
  mappings: AnyResourceMapping[];
  allMappings: AnyResourceMapping[];
  stats: TranslationStats;
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  hasUnsavedChanges: boolean;
  approveMapping: (mappingId: string) => void;
  rejectMapping: (mappingId: string) => void;
  updateMappingTarget: (mappingId: string, newTarget: unknown) => void;
  setSearchQuery: (query: string) => void;
  setFilterType: (type: ResourceFilterType) => void;
  setConfidenceFilter: (confidence: ConfidenceLevel | 'all') => void;
  setConfidenceTabFilter: (tab: ConfidenceFilterType) => void;
  resetFilters: () => void;
}

const initialFilter: FilterState = {
  type: 'all',
  searchQuery: '',
  showOnlyNeedsReview: false,
  confidenceFilter: 'all',
  confidenceTabFilter: 'all',
};

export function useTranslationState(
  initialMappings: AnyResourceMapping[]
): UseTranslationStateReturn {
  const [mappings, setMappings] = useState<AnyResourceMapping[]>(initialMappings);
  const [filter, setFilter] = useState<FilterState>(initialFilter);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Computed stats
  const stats = useMemo((): TranslationStats => {
    const approvedCount = mappings.filter((m) => m.status === 'approved').length;
    return {
      totalResources: mappings.length,
      needsReview: mappings.filter((m) => m.needsReview).length,
      readyToCommit: approvedCount,
      approvedCount,
    };
  }, [mappings]);

  // Filtered mappings
  const filteredMappings = useMemo(() => {
    return mappings.filter((mapping) => {
      // Filter by resource type
      if (filter.type !== 'all' && mapping.source.type !== filter.type) {
        return false;
      }

      // Filter by search query
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const searchableFields = [
          mapping.source.id,
          mapping.source.name,
          mapping.source.tags?.Name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchableFields.includes(query)) {
          return false;
        }
      }

      // Filter by confidence level
      if (
        filter.confidenceFilter !== 'all' &&
        mapping.confidence !== filter.confidenceFilter
      ) {
        return false;
      }

      // Filter by confidence tab (All, High, Medium, Low, Unmapped)
      if (filter.confidenceTabFilter !== 'all') {
        if (filter.confidenceTabFilter === 'unmapped') {
          // Unmapped = no target or manual confidence
          if (mapping.target !== null && mapping.confidence !== 'manual') {
            return false;
          }
        } else {
          // Filter by specific confidence level
          if (mapping.confidence !== filter.confidenceTabFilter) {
            return false;
          }
        }
      }

      // Filter by needs review
      if (filter.showOnlyNeedsReview && !mapping.needsReview) {
        return false;
      }

      return true;
    });
  }, [mappings, filter]);

  // Actions
  const approveMapping = useCallback((mappingId: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.id === mappingId
          ? { ...m, status: 'approved' as const, needsReview: false }
          : m
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const rejectMapping = useCallback((mappingId: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.id === mappingId
          ? { ...m, status: 'rejected' as const, needsReview: false }
          : m
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  const updateMappingTarget = useCallback(
    (mappingId: string, newTarget: unknown) => {
      setMappings((prev) =>
        prev.map((m) => {
          if (m.id === mappingId) {
            // Type assertion needed to preserve union type
            return {
              ...m,
              target: newTarget,
              status: 'modified',
              needsReview: true,
            } as AnyResourceMapping;
          }
          return m;
        })
      );
      setHasUnsavedChanges(true);
    },
    []
  );

  // Filter helpers
  const setSearchQuery = useCallback((query: string) => {
    setFilter((prev) => ({ ...prev, searchQuery: query }));
  }, []);

  const setFilterType = useCallback((type: ResourceFilterType) => {
    setFilter((prev) => ({ ...prev, type }));
  }, []);

  const setConfidenceFilter = useCallback(
    (confidence: ConfidenceLevel | 'all') => {
      setFilter((prev) => ({ ...prev, confidenceFilter: confidence }));
    },
    []
  );

  const setConfidenceTabFilter = useCallback(
    (tab: ConfidenceFilterType) => {
      setFilter((prev) => ({ ...prev, confidenceTabFilter: tab }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilter(initialFilter);
  }, []);

  return {
    mappings: filteredMappings,
    allMappings: mappings,
    stats,
    filter,
    setFilter,
    hasUnsavedChanges,
    approveMapping,
    rejectMapping,
    updateMappingTarget,
    setSearchQuery,
    setFilterType,
    setConfidenceFilter,
    setConfidenceTabFilter,
    resetFilters,
  };
}

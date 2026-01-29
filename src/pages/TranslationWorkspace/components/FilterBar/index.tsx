import React from 'react';
import {
  FlexLayout,
  Input,
  Button,
  ButtonGroup,
  FilterIcon,
  DownloadIcon,
} from '@nutanix-ui/prism-reactjs';
import { ResourceFilterType } from '../../types';
import { FILTER_TABS } from '../../constants';

interface FilterBarProps {
  searchQuery: string;
  activeFilter: ResourceFilterType;
  onSearchChange: (query: string) => void;
  onFilterChange: (filter: ResourceFilterType) => void;
  onExport?: () => void;
  onAdvancedFilter?: () => void;
}

export default function FilterBar({
  searchQuery,
  activeFilter,
  onSearchChange,
  onFilterChange,
  onExport,
  onAdvancedFilter,
}: FilterBarProps): React.ReactElement {
  return (
    <FlexLayout
      justifyContent="space-between"
      alignItems="center"
      itemGap="L"
    >
      {/* Search Input */}
      <Input
        search={true}
        placeholder="Search by ID, CIDR, or Tag..."
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
        style={{ width: '400px' }}
      />

      {/* Right side: Filter tabs + Actions */}
      <FlexLayout alignItems="center" itemGap="L">
        {/* Filter Tabs */}
        <ButtonGroup>
          {FILTER_TABS.map((tab) => (
            <Button
              key={tab.key}
              type={
                activeFilter === tab.key
                  ? Button.ButtonTypes.PRIMARY
                  : Button.ButtonTypes.SECONDARY
              }
              onClick={() => onFilterChange(tab.key as ResourceFilterType)}
            >
              {tab.label}
            </Button>
          ))}
        </ButtonGroup>

        {/* Action Buttons */}
        <FlexLayout alignItems="center" itemGap="S">
          <Button
            type={Button.ButtonTypes.SECONDARY}
            onClick={onAdvancedFilter}
            aria-label="Advanced filters"
          >
            <FlexLayout alignItems="center" itemGap="XS">
              <FilterIcon style={{ width: '16px', height: '16px' }} />
              Filter
            </FlexLayout>
          </Button>
          <Button
            type={Button.ButtonTypes.SECONDARY}
            onClick={onExport}
            aria-label="Export mappings"
          >
            <FlexLayout alignItems="center" itemGap="XS">
              <DownloadIcon style={{ width: '16px', height: '16px' }} />
              Export
            </FlexLayout>
          </Button>
        </FlexLayout>
      </FlexLayout>
    </FlexLayout>
  );
}

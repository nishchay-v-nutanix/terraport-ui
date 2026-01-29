import React from 'react';
import {
  FlexLayout,
  Input,
  Button,
  ButtonGroup,
} from '@nutanix-ui/prism-reactjs';
import { ConfidenceFilterType } from '../../types';
import { CONFIDENCE_FILTER_TABS } from '../../constants';

interface FilterBarProps {
  searchQuery: string;
  activeConfidenceTab: ConfidenceFilterType;
  onSearchChange: (query: string) => void;
  onConfidenceTabChange: (tab: ConfidenceFilterType) => void;
}

export default function FilterBar({
  searchQuery,
  activeConfidenceTab,
  onSearchChange,
  onConfidenceTabChange,
}: FilterBarProps): React.ReactElement {
  return (
    <FlexLayout
      justifyContent="space-between"
      alignItems="center"
      itemGap="L"
    >
      {/* Left side: Confidence Filter Tabs */}
      <ButtonGroup>
        {CONFIDENCE_FILTER_TABS.map((tab) => (
          <Button
            key={tab.key}
            type={
              activeConfidenceTab === tab.key
                ? Button.ButtonTypes.PRIMARY
                : Button.ButtonTypes.SECONDARY
            }
            onClick={() => onConfidenceTabChange(tab.key as ConfidenceFilterType)}
          >
            {tab.label}
          </Button>
        ))}
      </ButtonGroup>

      {/* Right side: Search */}
      <Input
        search={true}
        placeholder="Search by ID, CIDR, or Tag..."
        value={searchQuery}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value)
        }
        style={{ width: '300px' }}
      />
    </FlexLayout>
  );
}

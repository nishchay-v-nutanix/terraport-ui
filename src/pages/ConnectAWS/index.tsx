import React, { useState } from 'react';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  TextLabel,
  Input,
  Select,
  Link,
} from '@nutanix-ui/prism-reactjs';
import {
  PageContainer,
  ContentWrapper,
  MainContent,
  Sidebar,
  ProgressBarContainer,
  ProgressBarFill,
  FormCard,
  InfoCard,
  PermissionItem,
  CheckIcon,
  InputWrapper,
  VisibilityToggle,
  FormRow,
  ButtonContainer,
  HelpCard,
  IconWrapper,
  StepLabel,
} from './styles';
import {
  AWSCredentials,
  CONNECTION_STEPS,
  AWS_REGIONS,
  REQUIRED_PERMISSIONS,
} from './types';

// Select row data interface matching Prism Select component
interface SelectRowData {
  key?: string | number;
  label: string;
  disabled?: boolean;
}

export default function ConnectAWS(): React.ReactElement {
  const [credentials, setCredentials] = useState<AWSCredentials>({
    accessKeyId: '',
    secretAccessKey: '',
    defaultRegion: '',
    accountAlias: '',
  });
  const [showAccessKey, setShowAccessKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [currentStep] = useState(1);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const progressPercent = (currentStep / CONNECTION_STEPS.length) * 100;
  const currentStepData = CONNECTION_STEPS[currentStep - 1];

  const handleInputChange = (field: keyof AWSCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleRegionChange = (selectedRow: SelectRowData | undefined) => {
    setCredentials((prev) => ({
      ...prev,
      defaultRegion: selectedRow?.key as string || '',
    }));
  };

  // Convert AWS_REGIONS to Select rowsData format
  const regionRowsData: SelectRowData[] = AWS_REGIONS.map((region) => ({
    key: region.value,
    label: region.label,
  }));

  // Get the selected region row
  const selectedRegionRow = regionRowsData.find(
    (row) => row.key === credentials.defaultRegion
  );

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsTestingConnection(false);
    console.log('Testing connection with:', credentials);
  };

  const handleSaveAndContinue = () => {
    console.log('Saving credentials:', credentials);
  };

  const renderHeader = () => (
    <StackingLayout itemGap="S">
      <Title size={Title.TitleSizes.H1}>Connect AWS Environment</Title>
      <Paragraph type="secondary">
        Enter your IAM credentials to allow Terraport to discover your AWS
        infrastructure. This corresponds to Module A: Connection & Discovery.
      </Paragraph>
    </StackingLayout>
  );

  const renderProgressSection = () => (
    <StackingLayout itemGap="S" padding="30px-0px">
      <FlexLayout alignItems="center" justifyContent="space-between">
        <StackingLayout itemGap="none">
          <StepLabel>
            STEP {currentStep} OF {CONNECTION_STEPS.length}
          </StepLabel>
          <Title size={Title.TitleSizes.H3}>{currentStepData.title}</Title>
        </StackingLayout>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          {progressPercent}% Completed
        </TextLabel>
      </FlexLayout>
      <ProgressBarContainer>
        <ProgressBarFill percent={progressPercent} />
      </ProgressBarContainer>
    </StackingLayout>
  );

  const renderCredentialsForm = () => (
    <FormCard>
      <StackingLayout itemGap="L">
        <FlexLayout alignItems="center" itemGap="S">
          <IconWrapper>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </IconWrapper>
          <Title size={Title.TitleSizes.H4}>AWS Credentials</Title>
        </FlexLayout>

        {/* Access Key ID */}
        <StackingLayout itemGap="XS">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            Access Key ID
          </TextLabel>
          <InputWrapper>
            <Input
              type={showAccessKey ? 'text' : 'password'}
              value={credentials.accessKeyId}
              onChange={handleInputChange('accessKeyId')}
              placeholder="AKIAIOSFODNN7EXAMPLE"
            />
            <VisibilityToggle
              type="button"
              onClick={() => setShowAccessKey(!showAccessKey)}
              aria-label={showAccessKey ? 'Hide access key' : 'Show access key'}
            >
              {showAccessKey ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </VisibilityToggle>
          </InputWrapper>
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
          >
            Enter the 20-character access key ID.
          </TextLabel>
        </StackingLayout>

        {/* Secret Access Key */}
        <StackingLayout itemGap="XS">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            Secret Access Key
          </TextLabel>
          <InputWrapper>
            <Input
              type={showSecretKey ? 'text' : 'password'}
              value={credentials.secretAccessKey}
              onChange={handleInputChange('secretAccessKey')}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            />
            <VisibilityToggle
              type="button"
              onClick={() => setShowSecretKey(!showSecretKey)}
              aria-label={showSecretKey ? 'Hide secret key' : 'Show secret key'}
            >
              {showSecretKey ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </VisibilityToggle>
          </InputWrapper>
        </StackingLayout>

        {/* Region and Account Alias Row */}
        <FormRow>
          <StackingLayout itemGap="XS">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
              Default Region
            </TextLabel>
            <Select
              rowsData={regionRowsData}
              selectedRow={selectedRegionRow}
              onSelectedChange={handleRegionChange}
              placeholder="Select a region"
            />
          </StackingLayout>
          <StackingLayout itemGap="XS">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
              Account Alias (Optional)
            </TextLabel>
            <Input
              value={credentials.accountAlias}
              onChange={handleInputChange('accountAlias')}
              placeholder="e.g. Production AWS"
            />
          </StackingLayout>
        </FormRow>

        {/* Action Buttons */}
        <ButtonContainer>
          <Button
            type={Button.ButtonTypes.SECONDARY}
            onClick={handleTestConnection}
            disabled={isTestingConnection}
          >
            <FlexLayout alignItems="center" itemGap="XS">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M23 4v6h-6" />
                <path d="M1 20v-6h6" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </FlexLayout>
          </Button>
          <Button
            type={Button.ButtonTypes.PRIMARY}
            onClick={handleSaveAndContinue}
          >
            <FlexLayout alignItems="center" itemGap="XS">
              Save & Continue
              <span>→</span>
            </FlexLayout>
          </Button>
        </ButtonContainer>
      </StackingLayout>
    </FormCard>
  );

  const renderSidebar = () => (
    <Sidebar>
      {/* Permissions Required Card */}
      <InfoCard>
        <StackingLayout itemGap="M">
          <FlexLayout alignItems="center" itemGap="S">
            <IconWrapper color="var(--color-text-success)">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="10" />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </IconWrapper>
            <Title size={Title.TitleSizes.H4}>Permissions Required</Title>
          </FlexLayout>
          <Paragraph type="secondary">
            To successfully discover your infrastructure, the IAM user must have
            the following read-only permissions:
          </Paragraph>
          <StackingLayout itemGap="XS">
            {REQUIRED_PERMISSIONS.map((permission) => (
              <PermissionItem key={permission}>
                <CheckIcon>✓</CheckIcon>
                <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
                  {permission}
                </TextLabel>
              </PermissionItem>
            ))}
          </StackingLayout>
          <Link type="forward" href="#policy">
            View Full IAM Policy
          </Link>
        </StackingLayout>
      </InfoCard>

      {/* End-to-End Encryption Card */}
      <InfoCard>
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" itemGap="S">
            <IconWrapper color="var(--color-text-success)">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </IconWrapper>
            <Title size={Title.TitleSizes.H4}>End-to-End Encryption</Title>
          </FlexLayout>
          <Paragraph type="secondary">
            Your keys are encrypted using AES-256 before transmission and are
            never stored in plain text.
          </Paragraph>
        </StackingLayout>
      </InfoCard>

      {/* Need Help Card */}
      <HelpCard>
        <FlexLayout alignItems="center" itemGap="S">
          <IconWrapper>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </IconWrapper>
          <StackingLayout itemGap="none">
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
              Need help?
            </TextLabel>
            <TextLabel
              type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
              size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            >
              Contact Support
            </TextLabel>
          </StackingLayout>
        </FlexLayout>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>›</TextLabel>
      </HelpCard>
    </Sidebar>
  );

  return (
    <PageContainer>
      <ContentWrapper>
        <MainContent>
          {renderHeader()}
          {renderProgressSection()}
          {renderCredentialsForm()}
        </MainContent>
        {renderSidebar()}
      </ContentWrapper>
    </PageContainer>
  );
}

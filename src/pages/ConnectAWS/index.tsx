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
  Progress,
  ContainerLayout,
  // Prism Icons
  LockIcon,
  SecureIcon,
  RefreshIcon,
  QuestionIcon,
  ShowIcon,
  HideIcon,
  ChevronRightIcon,
  SuccessStatusIcon,
  InformationStatusIcon,
} from '@nutanix-ui/prism-reactjs';

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
      defaultRegion: (selectedRow?.key as string) || '',
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
      <Paragraph type="secondary" forceMultiLineHeight>
        Enter your IAM credentials to allow Terraport to discover your AWS
        infrastructure.
      </Paragraph>
    </StackingLayout>
  );

  const renderProgressSection = () => (
    <StackingLayout itemGap="S" padding="20px-0px">
      <FlexLayout alignItems="center" justifyContent="space-between">
        <StackingLayout itemGap="XS">
          <TextLabel
            type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}
            size={TextLabel.TEXT_LABEL_SIZE.SMALL}
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--color-text-link)',
              fontWeight: 600,
            }}
          >
            STEP {currentStep} OF {CONNECTION_STEPS.length}
          </TextLabel>
          <Title size={Title.TitleSizes.H3}>{currentStepData.title}</Title>
        </StackingLayout>
        <TextLabel type={TextLabel.TEXT_LABEL_TYPE.SECONDARY}>
          {progressPercent}% Completed
        </TextLabel>
      </FlexLayout>
      <Progress
        percent={progressPercent}
        status={Progress.ProgressStatus.ACTIVE}
        label={false}
      />
    </StackingLayout>
  );

  const renderCredentialsForm = () => (
    <ContainerLayout border padding="30px" style={{ marginTop: '20px' }}>
      <StackingLayout itemGap="L">
        <FlexLayout alignItems="center" itemGap="S">
          <LockIcon color="var(--color-text-primary-label)" />
          <Title size={Title.TitleSizes.H4}>AWS Credentials</Title>
        </FlexLayout>

        {/* Access Key ID */}
        <StackingLayout itemGap="XS">
          <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
            Access Key ID
          </TextLabel>
          <FlexLayout alignItems="center" style={{ position: 'relative' }}>
            <Input
              type={showAccessKey ? 'text' : 'password'}
              value={credentials.accessKeyId}
              onChange={handleInputChange('accessKeyId')}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              style={{ paddingRight: '40px' }}
            />
            <Button
              type={Button.ButtonTypes.ICON_DEFAULT}
              onClick={() => setShowAccessKey(!showAccessKey)}
              aria-label={showAccessKey ? 'Hide access key' : 'Show access key'}
              style={{
                position: 'absolute',
                right: '4px',
                background: 'transparent',
              }}
            >
              {showAccessKey ? <HideIcon /> : <ShowIcon />}
            </Button>
          </FlexLayout>
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
          <FlexLayout alignItems="center" style={{ position: 'relative' }}>
            <Input
              type={showSecretKey ? 'text' : 'password'}
              value={credentials.secretAccessKey}
              onChange={handleInputChange('secretAccessKey')}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              style={{ paddingRight: '40px' }}
            />
            <Button
              type={Button.ButtonTypes.ICON_DEFAULT}
              onClick={() => setShowSecretKey(!showSecretKey)}
              aria-label={showSecretKey ? 'Hide secret key' : 'Show secret key'}
              style={{
                position: 'absolute',
                right: '4px',
                background: 'transparent',
              }}
            >
              {showSecretKey ? <HideIcon /> : <ShowIcon />}
            </Button>
          </FlexLayout>
        </StackingLayout>

        {/* Region and Account Alias Row */}
        <FlexLayout itemGap="L">
          <StackingLayout itemGap="XS" style={{ flex: 1 }}>
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
          <StackingLayout itemGap="XS" style={{ flex: 1 }}>
            <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
              Account Alias (Optional)
            </TextLabel>
            <Input
              value={credentials.accountAlias}
              onChange={handleInputChange('accountAlias')}
              placeholder="e.g. Production AWS"
            />
          </StackingLayout>
        </FlexLayout>

        {/* Action Buttons */}
        <FlexLayout
          alignItems="center"
          justifyContent="flex-end"
          itemGap="M"
          style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border-separator)',
          }}
        >
          <Button
            type={Button.ButtonTypes.SECONDARY}
            onClick={handleTestConnection}
            disabled={isTestingConnection}
          >
            <FlexLayout alignItems="center" itemGap="XS">
              <RefreshIcon />
              {isTestingConnection ? 'Testing...' : 'Test Connection'}
            </FlexLayout>
          </Button>
          <Button
            type={Button.ButtonTypes.PRIMARY}
            onClick={handleSaveAndContinue}
          >
            <FlexLayout alignItems="center" itemGap="XS">
              Save & Continue
              <ChevronRightIcon />
            </FlexLayout>
          </Button>
        </FlexLayout>
      </StackingLayout>
    </ContainerLayout>
  );

  const renderSidebar = () => (
    <StackingLayout itemGap="M" style={{ width: '360px', flexShrink: 0 }}>
      {/* Permissions Required Card */}
      <ContainerLayout border padding="20px">
        <StackingLayout itemGap="M">
          <FlexLayout alignItems="center" itemGap="S">
            <InformationStatusIcon color="var(--color-text-success)" />
            <Title size={Title.TitleSizes.H4}>Permissions Required</Title>
          </FlexLayout>
          <Paragraph type="secondary" forceMultiLineHeight>
            To successfully discover your infrastructure, the IAM user must have
            the following read-only permissions:
          </Paragraph>
          <StackingLayout itemGap="XS">
            {REQUIRED_PERMISSIONS.map((permission) => (
              <FlexLayout key={permission} alignItems="center" itemGap="S">
                <SuccessStatusIcon
                  color="var(--color-text-success)"
                  iconColor="var(--color-background-base)"
                />
                <TextLabel type={TextLabel.TEXT_LABEL_TYPE.PRIMARY}>
                  {permission}
                </TextLabel>
              </FlexLayout>
            ))}
          </StackingLayout>
          <Link type="forward" href="#policy">
            View Full IAM Policy
          </Link>
        </StackingLayout>
      </ContainerLayout>

      {/* End-to-End Encryption Card */}
      <ContainerLayout border padding="20px">
        <StackingLayout itemGap="S">
          <FlexLayout alignItems="center" itemGap="S">
            <SecureIcon color="var(--color-text-success)" />
            <Title size={Title.TitleSizes.H4}>End-to-End Encryption</Title>
          </FlexLayout>
          <Paragraph type="secondary" forceMultiLineHeight>
            Your keys are encrypted using AES-256 before transmission and are
            never stored in plain text.
          </Paragraph>
        </StackingLayout>
      </ContainerLayout>

      {/* Need Help Card */}
      <ContainerLayout
        border
        padding="15px"
        style={{ cursor: 'pointer' }}
      >
        <FlexLayout alignItems="center" justifyContent="space-between">
          <FlexLayout alignItems="center" itemGap="S">
            <QuestionIcon color="var(--color-text-secondary-label)" />
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
          <ChevronRightIcon color="var(--color-text-secondary-label)" />
        </FlexLayout>
      </ContainerLayout>
    </StackingLayout>
  );

  return (
    <ContainerLayout padding="40px">
      <FlexLayout itemGap="XL">
        <StackingLayout style={{ flex: 1, maxWidth: '720px' }}>
          {renderHeader()}
          {renderProgressSection()}
          {renderCredentialsForm()}
        </StackingLayout>
        {renderSidebar()}
      </FlexLayout>
    </ContainerLayout>
  );
}

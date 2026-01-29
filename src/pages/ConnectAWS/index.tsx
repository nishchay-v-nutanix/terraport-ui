import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  FlexLayout,
  StackingLayout,
  Title,
  Paragraph,
  TextLabel,
  Input,
  Select,
  Progress,
  ContainerLayout,
  // Prism Icons
  LockIcon,
  RefreshIcon,
  QuestionIcon,
  ShowIcon,
  HideIcon,
  ChevronRightIcon,
} from '@nutanix-ui/prism-reactjs';

import {
  AWSCredentials,
  CONNECTION_STEPS,
  AWS_REGIONS,
} from './types';
import StepFooter, { STEP_FOOTER_HEIGHT } from '../../components/StepFooter';

// Select row data interface matching Prism Select component
interface SelectRowData {
  key?: string | number;
  label: string;
  disabled?: boolean;
}

// Title Bar Component - persists across all wizard steps
interface TitleBarProps {
  title: string;
}

const TitleBar: React.FC<TitleBarProps> = ({ title }) => (
  <ContainerLayout
    padding="20px"
    style={{
      paddingLeft: '40px',
      paddingRight: '40px',
      borderBottom: '1px solid var(--color-border-separator)',
      background: 'var(--color-background-base)',
    }}
  >
    <Title size={Title.TitleSizes.H2}>{title}</Title>
  </ContainerLayout>
);

// Wizard Progress Component - persists across all wizard steps
interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  description: string;
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  currentStep,
  totalSteps,
  stepTitle,
  description,
}) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <StackingLayout itemGap="M" padding="0px">
      <FlexLayout alignItems="center" justifyContent="space-between">
        <StackingLayout itemGap="S">
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
            STEP {currentStep} OF {totalSteps}
          </TextLabel>
          <Title size={Title.TitleSizes.H3}>{stepTitle}</Title>
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
      <Paragraph type="secondary" forceMultiLineHeight>
        {description}
      </Paragraph>
    </StackingLayout>
  );
};

// Need Help Component - positioned above the footer
const NeedHelpBox: React.FC = () => (
  <ContainerLayout
    border
    padding="15px"
    style={{
      cursor: 'pointer',
      position: 'fixed',
      bottom: '84px',
      right: '16px',
      width: '280px',
      background: 'var(--color-background-base)',
      zIndex: 100,
    }}
  >
    <FlexLayout alignItems="center" justifyContent="space-between">
      <FlexLayout alignItems="center" itemGap="S">
        <QuestionIcon color="var(--color-text-secondary-label)" />
        <StackingLayout itemGap="S">
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
);

export default function ConnectAWS(): React.ReactElement {
  const history = useHistory();
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
    // Generate a unique scan ID and navigate to the scanning screen
    const scanId = `SCAN-${Date.now().toString(36).toUpperCase()}`;
    history.push(`/scan/${scanId}`);
  };

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
              placeholder="Your Access Key ID"
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

        {/* Test Connection Button */}
        <FlexLayout
          alignItems="center"
          justifyContent="flex-start"
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
        </FlexLayout>
      </StackingLayout>
    </ContainerLayout>
  );

  const handleBack = () => {
    history.push('/');
  };

  return (
    <FlexLayout flexDirection="column" style={{ minHeight: '100vh', width: '100%', paddingBottom: `${STEP_FOOTER_HEIGHT}px` }}>
      {/* Title Bar - persists across all wizard steps */}
      <TitleBar title="Migrate AWS Environment" />

      {/* Main Content Area */}
      <ContainerLayout padding="40px" style={{ flex: 1 }}>
        <StackingLayout style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Wizard Progress - persists across all wizard steps */}
          <WizardProgress
            currentStep={currentStep}
            totalSteps={CONNECTION_STEPS.length}
            stepTitle={currentStepData.title}
            description={currentStepData.description}
          />

          {/* Step Content - changes per step */}
          {renderCredentialsForm()}
        </StackingLayout>
      </ContainerLayout>

      {/* Need Help Box - fixed at bottom right */}
      <NeedHelpBox />

      {/* Step Footer */}
      <StepFooter
        currentStep={currentStep}
        totalSteps={CONNECTION_STEPS.length}
        nextLabel="Start Scan"
        onNext={handleSaveAndContinue}
        onBack={handleBack}
      />
    </FlexLayout>
  );
}

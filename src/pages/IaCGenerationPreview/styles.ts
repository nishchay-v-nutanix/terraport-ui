import styled from 'styled-components';

export const ExplorerContainer = styled.div`
  width: 280px;
  min-width: 280px;
  background-color: var(--color-background-dark);
  border-right: 1px solid var(--color-border-separator);
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

export const EditorContainer = styled.div<{ $isFullscreen?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-base);
  overflow: hidden;
  ${({ $isFullscreen }) =>
    $isFullscreen &&
    `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
  `}
`;

export const FileItemContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: ${({ $isActive }) =>
    $isActive ? 'var(--color-background-selected)' : 'transparent'};
  border-radius: 4px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive
        ? 'var(--color-background-selected)'
        : 'var(--color-background-hover)'};
  }
`;

export const TabContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px !important;
  border-right: 1px solid var(--color-border-separator);
  background-color: ${({ $isActive }) =>
    $isActive ? 'var(--color-background-white)' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive
        ? 'var(--color-background-white)'
        : 'var(--color-background-hover)'};
  }
`;

export const MonacoWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const StatusBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 12px;
  background-color: var(--color-background-dark);
  border-top: 1px solid var(--color-border-separator);
`;

export const MainContentArea = styled.div`
  display: flex;
  height: calc(100vh - 520px);
  min-height: 300px;
  border: 1px solid var(--color-border-separator);
  border-radius: 4px;
  overflow: hidden;
`;

export const FooterBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 40px !important;
  background-color: var(--color-background-base);
  border-top: 1px solid var(--color-border-separator);
  z-index: 100;
`;

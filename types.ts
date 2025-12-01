export interface ScanResult {
  id: string;
  imageData: string; // Base64 encoded image
  timestamp: number;
  question: string;
  solution: string;
  isPending: boolean;
  error?: string;
}

export type ViewState = 'list' | 'camera' | 'detail';

export interface CameraComponentProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
}

export interface SolutionViewProps {
  data: ScanResult;
  onBack: () => void;
  onDelete: (id: string) => void;
}

export interface HistoryListProps {
  items: ScanResult[];
  onSelect: (item: ScanResult) => void;
  onScanNew: () => void;
}

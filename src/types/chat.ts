export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface RiskAssessment {
  level: RiskLevel;
  explanation: string;
  emotionalTone: string;
  supportResponse: string;
  crisis?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
  riskAssessment?: RiskAssessment;
}

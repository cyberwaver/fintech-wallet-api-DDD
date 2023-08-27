export class UserOnboardingRuleValidatedDTO {
  label: string;
  validatedAt: Date;
  passed: boolean;
  reason?: string;
}

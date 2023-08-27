import { plainToClass } from 'class-transformer';
import { ValueObject } from 'src/common/domain/ValueObject';

class ValidationRuleProps {
  label: string;
  validatedAt: Date;
  passed: boolean;
  reason: string;
}

export class ValidationRule extends ValueObject<ValidationRuleProps> {
  constructor(value: unknown) {
    super(plainToClass(ValidationRuleProps, value));
  }

  public CHECKED = !!this.value.validatedAt;
  public PASSED = this.value.passed;

  public static CheckBVN = new ValidationRule({ label: 'CHECK_BVN' });
  public static CheckDefaultBankAccount = new ValidationRule({
    label: 'CHECK_DEFAULT_BANK_ACCOUNT',
  });
}

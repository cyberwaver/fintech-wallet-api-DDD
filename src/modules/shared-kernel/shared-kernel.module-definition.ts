import { ConfigurableModuleBuilder } from '@nestjs/common';
import { SharedKernelModuleOptions } from './shared-kernel.module';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SharedKernelModuleOptions>().build();

import type { CompilerPass, FF } from '../Value';
import { GlobalInvokeStack } from '../GlobalInvokeStack';
import { KernelFeatureServices } from './KernelFeatureServices';

export const KernelFeature: FF<KernelFeatureServices> =
  function kernelFeature() {
    return {
      compilerPass: () => ({
        register: (pass: CompilerPass) => {
          GlobalInvokeStack.addCompilerPass(pass);
        },
      }),
      compilerInfo: () => GlobalInvokeStack.getRoot(),
    };
  };

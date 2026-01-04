import React, { forwardRef, useImperativeHandle, useRef } from "react";
import SignatureScreen from "react-native-signature-canvas";

export type SignaturePadRef = {
  salvar: () => void;
  limpar: () => void;
};

type Props = {
  onSave: (signature: string) => void;
};

export const SignaturePad = forwardRef<SignaturePadRef, Props>(
  ({ onSave }, ref) => {
    const signatureRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      salvar: () => {
        signatureRef.current?.readSignature();
      },
      limpar: () => {
        signatureRef.current?.clearSignature();
      },
    }));

    return (
      <SignatureScreen
        ref={signatureRef}
        onOK={onSave}
        onEmpty={() => console.log("Assinatura vazia")}
        webStyle={`
          .m-signature-pad {
            box-shadow: none;
            border: none;
          }
          .m-signature-pad--footer {
            display: none;
          }
        `}
      />
    );
  }
);

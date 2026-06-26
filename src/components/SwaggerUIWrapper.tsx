"use client";
import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

interface SwaggerUIWrapperProps {
  url: string;
  docExpansion?: "list" | "full" | "none";
  deepLinking?: boolean;
}

export default function SwaggerUIWrapper({ url, docExpansion = "list", deepLinking = true }: SwaggerUIWrapperProps) {
  useEffect(() => {
    // Store the original console.error
    const originalError = console.error;
    
    // Override console.error to filter out UNSAFE_componentWillReceiveProps warnings
    console.error = (...args) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('UNSAFE_componentWillReceiveProps') || 
           message.includes('ModelCollapse') || 
           message.includes('OperationContainer'))) {
        // Suppress these specific warnings
        return;
      }
      // Log all other errors normally
      originalError.apply(console, args);
    };

    // Cleanup: restore original console.error when component unmounts
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI 
        url={url} 
        docExpansion={docExpansion} 
        deepLinking={deepLinking} 
      />
      <style jsx global>{`
        html, body { margin: 0; background: #fff !important; background-image: none !important; }
        .swagger-ui { background: #fff !important; }
      `}</style>
    </div>
  );
}

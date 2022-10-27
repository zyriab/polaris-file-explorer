import React from 'react';
import { Spinner as PolarisSpinner } from '@shopify/polaris';

import './Spinner.css';

export function Spinner() {
  return (
    <div className="Spinner__Wrapper">
      <PolarisSpinner accessibilityLabel="Editor loading spinner" />
    </div>
  );
}

import React from 'react';
import { Spinner } from '@shopify/polaris';

import './Spinner.css';

export function Spinner() {
  return (
    <div className="Spinner__Wrapper">
      <Spinner accessibilityLabel="Editor loading spinner" />
    </div>
  );
}

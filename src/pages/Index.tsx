import React, { useState } from 'react';
import { WindowProvider } from '@/contexts/WindowContext';
import { Desktop } from '@/components/Desktop';
import { BootScreen } from '@/components/BootScreen';

const Index: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <WindowProvider>
      {isBooting && <BootScreen onComplete={() => setIsBooting(false)} />}
      <Desktop />
    </WindowProvider>
  );
};

export default Index;

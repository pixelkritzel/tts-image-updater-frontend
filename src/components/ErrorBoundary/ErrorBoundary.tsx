import React from 'react';
import { observer } from 'mobx-react';
import { StoreContext } from 'components/StoreContext';

interface ErrorBoundaryProps {}

@observer
export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  static contextType = StoreContext;
  context!: React.ContextType<typeof StoreContext>;

  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
